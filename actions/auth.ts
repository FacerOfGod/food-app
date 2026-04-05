"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createOtp, verifyOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { setUserCookie, clearUserCookie } from "@/lib/session";

export async function sendOtpAction(_prevState: unknown, formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  let name = (formData.get("name") as string)?.trim();
  const redirectTo = formData.get("redirectTo") as string | null;

  if (!email) {
    return { error: "Veuillez entrer votre email." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Adresse email invalide." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    name = existingUser.name || "Utilisateur";
  } else if (!name) {
    return { needsName: true, email };
  }

  try {
    const code = await createOtp(email, name);
    await sendOtpEmail(email, name, code);
  } catch {
    return { error: "Impossible d'envoyer l'email. Réessayez." };
  }

  const params = new URLSearchParams({ email });
  if (redirectTo) params.set("redirectTo", redirectTo);

  redirect(`/auth/verify?${params.toString()}`);
}

export async function verifyOtpAction(_prevState: unknown, formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const code = (formData.get("code") as string)?.trim();
  const redirectTo = formData.get("redirectTo") as string | null;

  if (!email || !code) {
    return { error: "Veuillez entrer votre code." };
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

  await setUserCookie(user.id);

  redirect(redirectTo ?? "/dashboard");
}

export async function logoutAction() {
  await clearUserCookie();
  redirect("/");
}
