"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isAdminEmail } from "@/lib/admin";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function getUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, isBanned: true, createdAt: true },
  });
}

export async function deleteUserAction(userId: string) {
  const admin = await requireAdmin();
  if (userId === admin.id) throw new Error("Cannot delete yourself");

  await prisma.$transaction([
    // Remove votes
    prisma.vote.deleteMany({ where: { userId } }),
    // Remove session memberships
    prisma.sessionMember.deleteMany({ where: { userId } }),
    // Delete hosted sessions (cascades to their SessionMember rows)
    prisma.session.deleteMany({ where: { hostId: userId } }),
    // Detach proposed dishes (proposerId is nullable with SET NULL in schema)
    prisma.dish.updateMany({ where: { proposerId: userId }, data: { proposerId: null } }),
    // Finally delete the user
    prisma.user.delete({ where: { id: userId } }),
  ]);

  revalidatePath("/admin");
}

export async function banUserAction(userId: string) {
  const admin = await requireAdmin();
  if (userId === admin.id) throw new Error("Cannot ban yourself");
  await prisma.user.update({ where: { id: userId }, data: { isBanned: true } });
  revalidatePath("/admin");
}

export async function unbanUserAction(userId: string) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { isBanned: false } });
  revalidatePath("/admin");
}
