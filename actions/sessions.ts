"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { parseTopicsJson, stringifyTopics, isValidTopic } from "@/lib/topics";
import type { TopicKey } from "@/lib/presets";

export async function createSessionAction(_prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Session expirée — reconnectez-vous." };
  }

  const raw = formData.get("name");
  const name = typeof raw === "string" ? raw.trim() : "";
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
    console.error("createSessionAction DB error:", e);
    return { error: "Impossible de créer le groupe. Réessayez." };
  }

  redirect(`/host/${session.id}`);
}

export async function getHostSessions() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const sessions = await prisma.session.findMany({
    where: { hostId: user.id },
    include: {
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const joinedSessions = await prisma.session.findMany({
    where: { 
      hostId: { not: user.id },
      members: { some: { userId: user.id } }
    },
    include: {
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return { user, sessions, joinedSessions };
}

export async function getSessionPartageData(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      name: true,
      hostId: true,
      allowedTopicsJson: true,
      members: {
        where: { userId: user.id },
        select: { sharedTopicsJson: true },
      },
    },
  });
  if (!session) return null;

  const isHost = session.hostId === user.id;
  const isMember = session.members.length > 0;
  if (!isHost && !isMember) return null;

  return {
    id: session.id,
    name: session.name,
    role: isHost ? ("host" as const) : ("member" as const),
    allowedTopics: parseTopicsJson(session.allowedTopicsJson),
    sharedTopics: parseTopicsJson(session.members[0]?.sharedTopicsJson ?? "[]"),
  };
}

export async function setSessionAllowedTopicsAction(sessionId: string, topics: string[]) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) return { error: "Groupe introuvable." };
  if (session.hostId !== user.id) return { error: "Seul l'hôte peut modifier les thèmes du groupe." };

  const valid = topics.filter(isValidTopic) as TopicKey[];
  if (valid.length === 0) return { error: "Au moins un thème doit rester actif." };

  await prisma.session.update({
    where: { id: sessionId },
    data: { allowedTopicsJson: stringifyTopics(valid) },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/host/${sessionId}`);
  return { success: true };
}

export async function setMemberSharedTopicsAction(sessionId: string, topics: string[]) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) return { error: "Groupe introuvable." };

  const membership = await prisma.sessionMember.findUnique({
    where: { sessionId_userId: { sessionId, userId: user.id } },
  });
  if (!membership) return { error: "Vous n'êtes pas membre de ce groupe." };

  const allowed = parseTopicsJson(session.allowedTopicsJson);
  const valid = topics
    .filter(isValidTopic)
    .filter((t) => allowed.includes(t as TopicKey)) as TopicKey[];

  await prisma.sessionMember.update({
    where: { sessionId_userId: { sessionId, userId: user.id } },
    data: { sharedTopicsJson: stringifyTopics(valid) },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/host/${sessionId}`);
  return { success: true };
}

export async function leaveSessionAction(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { hostId: true },
  });
  if (!session) return { error: "Groupe introuvable." };
  // The host can't leave — they must delete the group instead.
  if (session.hostId === user.id) {
    return { error: "L'hôte ne peut pas quitter son propre groupe. Supprimez-le." };
  }

  await prisma.sessionMember.deleteMany({
    where: { sessionId, userId: user.id },
  });

  revalidatePath("/dashboard");
  return { success: true };
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
