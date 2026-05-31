import { cookies } from "next/headers";
import { cache } from "react";
import { prisma } from "./prisma";

const COOKIE_NAME = "user_id";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export async function setUserCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, COOKIE_OPTIONS);
}

// Wrapped in React 19's cache() so multiple actions within a single request
// share one DB round-trip. A typical page renders 3+ actions that all start
// with getCurrentUser(); without this they each query User by id.
export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value ?? null;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
});

export async function clearUserCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
