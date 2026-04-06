import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = "user_id";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // temporarily disable secure constraint for HTTP compatibility
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export async function setUserCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, COOKIE_OPTIONS);
}

export async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function getCurrentUser() {
  const userId = await getUserId();
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function clearUserCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
