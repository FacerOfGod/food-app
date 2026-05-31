"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createOtp, verifyOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { setUserCookie, clearUserCookie } from "@/lib/session";
import { safeRedirectPath } from "@/lib/redirects";
import { otpSendLimiter, otpVerifyLimiter } from "@/lib/rate-limit";

const DEFAULT_NAME = "Utilisateur";

function readString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function sendOtpAction(_prevState: unknown, formData: FormData) {
  const email = readString(formData, "email").trim().toLowerCase();
  const submittedName = readString(formData, "name").trim();
  const rawRedirect = readString(formData, "redirectTo") || null;
  const redirectTo = safeRedirectPath(rawRedirect, "/dashboard");

  if (!email) {
    return { error: "Veuillez entrer votre email." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Adresse email invalide." };
  }

  if (!otpSendLimiter.consume(`send:${email}`)) {
    return { error: "Trop de demandes. Réessayez dans une minute." };
  }

  // Resolve the name without revealing whether the account exists.
  // Existing accounts keep their stored name; new accounts use the submitted
  // value (or a generic fallback), so the response shape is identical either way.
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { name: true },
  });
  const name =
    existingUser?.name?.trim() || submittedName || DEFAULT_NAME;

  try {
    const code = await createOtp(email, name);
    await sendOtpEmail(email, name, code, redirectTo);
  } catch {
    return { error: "Impossible d'envoyer l'email. Réessayez." };
  }

  const params = new URLSearchParams({ email });
  if (rawRedirect && redirectTo !== "/dashboard") {
    params.set("redirectTo", redirectTo);
  }

  redirect(`/auth/verify?${params.toString()}`);
}

export async function resendOtpAction(email: string, redirectTo?: string) {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return { error: "Email manquant." };

  if (!otpSendLimiter.consume(`send:${normalized}`)) {
    return { error: "Trop de demandes. Réessayez dans une minute." };
  }

  const safeRedirect = safeRedirectPath(redirectTo, "/dashboard");

  const user = await prisma.user.findUnique({
    where: { email: normalized },
    select: { name: true },
  });
  const name = user?.name?.trim() || DEFAULT_NAME;

  try {
    const code = await createOtp(normalized, name);
    await sendOtpEmail(normalized, name, code, safeRedirect);
    return { success: true };
  } catch {
    return { error: "Impossible d'envoyer l'email. Réessayez." };
  }
}

export async function verifyOtpAction(_prevState: unknown, formData: FormData) {
  const email = readString(formData, "email").trim().toLowerCase();
  const code = readString(formData, "code").trim();
  const rawRedirect = readString(formData, "redirectTo") || null;
  const redirectTo = safeRedirectPath(rawRedirect, "/dashboard");

  if (!email || !code) {
    return { error: "Veuillez entrer votre code." };
  }

  if (!otpVerifyLimiter.consume(`verify:${email}`)) {
    return { error: "Trop de tentatives. Réessayez dans une minute." };
  }

  const result = await verifyOtp(email, code);

  if (!result.valid) {
    return { error: "Code invalide ou expiré." };
  }

  // Upsert user without overwriting existing name
  const user = await prisma.user.upsert({
    where: { email },
    update: {}, // Keep existing name
    create: { email, name: result.name },
  });

  if (user.isBanned) {
    return { error: "Ce compte a été banni." };
  }

  await setUserCookie(user.id);

  redirect(redirectTo);
}

export async function logoutAction() {
  await clearUserCookie();
  redirect("/");
}
