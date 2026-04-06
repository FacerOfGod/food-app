"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, clearUserCookie } from "@/lib/session";

export async function createSessionAction(_prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    await clearUserCookie();
    redirect("/");
  }

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Veuillez donner un nom à la session." };

  let session;
  try {
    session = await prisma.session.create({
      data: {
        name,
        hostId: user.id,
        members: {
          create: { userId: user.id },
        },
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { error: `Erreur DB: ${msg}` };
  }

  redirect(`/host/${session.id}/dishes`);
}

export async function getHostSessions() {
  const user = await getCurrentUser();
  if (!user) {
    await clearUserCookie();
    return null;
  }

  const sessions = await prisma.session.findMany({
    where: { hostId: user.id },
    include: {
      _count: { select: { members: true, dishes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const joinedSessions = await prisma.session.findMany({
    where: { 
      hostId: { not: user.id },
      members: { some: { userId: user.id } }
    },
    include: {
      _count: { select: { members: true, dishes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return { user, sessions, joinedSessions };
}

export async function deleteSessionAction(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non autorisé" };

  try {
    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.hostId !== user.id) {
      return { error: "Non autorisé" };
    }

    await prisma.session.delete({
      where: { id: sessionId },
    });

    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la suppression" };
  }
}
