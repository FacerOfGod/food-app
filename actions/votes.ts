"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { parseTopicsJson, stringifyTopics, isValidTopic } from "@/lib/topics";
import type { TopicKey } from "@/lib/presets";

export async function deleteVoteAction(dishId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };
  await prisma.vote.deleteMany({ where: { userId: user.id, dishId } });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function submitVoteAction(input: { dishId: string; rating: number }) {
  const { dishId } = input;
  const rating = Number(input.rating);

  if (!dishId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Données invalides." };
  }

  const user = await getCurrentUser();
  if (!user) redirect("/");

  await prisma.vote.upsert({
    where: { userId_dishId: { userId: user.id, dishId } },
    update: { rating },
    create: { userId: user.id, dishId, rating },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getVotingData(topic: string = "ingredients") {
  const user = await getCurrentUser();
  if (!user) return null;

  const [dishes, allUserVotes] = await Promise.all([
    prisma.dish.findMany({
      where: { topic },
      include: { proposer: { select: { name: true } } },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    }),
    prisma.vote.findMany({
      where: { userId: user.id },
      select: { dishId: true, rating: true },
    }),
  ]);

  const dishIds = new Set(dishes.map((d) => d.id));
  const userVotes = allUserVotes.filter((v) => dishIds.has(v.dishId));
  const votedDishIds = new Set(userVotes.map((v) => v.dishId));
  const nextDish = dishes.find((d) => !votedDishIds.has(d.id)) ?? null;

  return {
    user,
    dishes,
    userVotes,
    nextDish,
    totalDishes: dishes.length,
    votedCount: userVotes.length,
  };
}

export async function joinSessionAction(sessionId: string, topic?: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const existing = await prisma.sessionMember.findUnique({
    where: { sessionId_userId: { sessionId, userId: user.id } },
  });
  if (existing) {
    // Already a member — don't overwrite their privacy preferences
    return { success: true, alreadyMember: true };
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { allowedTopicsJson: true },
  });
  if (!session) return { error: "Groupe introuvable." };

  const allowed = parseTopicsJson(session.allowedTopicsJson);
  const initialShared: TopicKey[] =
    topic && isValidTopic(topic) && allowed.includes(topic as TopicKey)
      ? [topic as TopicKey]
      : allowed;

  await prisma.sessionMember.create({
    data: {
      sessionId,
      userId: user.id,
      sharedTopicsJson: stringifyTopics(initialShared),
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getPeopleResults(sessionId: string, topic: string = "ingredients") {
  const user = await getCurrentUser();
  if (!user) return null;

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) return null;

  const membership = await prisma.sessionMember.findUnique({
    where: { sessionId_userId: { sessionId, userId: user.id } },
  });
  if (session.hostId !== user.id && !membership) return null;

  const allowedTopics = parseTopicsJson(session.allowedTopicsJson);
  const topicAllowed = allowedTopics.includes(topic as TopicKey);

  // First pass: load members WITHOUT votes — cheap, just to know who shares
  // the topic. (SQLite can't query inside the JSON string with Prisma's where,
  // so the share check stays in JS but operates on a tiny payload.)
  const memberShells = await prisma.sessionMember.findMany({
    where: { sessionId },
    select: {
      id: true,
      sessionId: true,
      userId: true,
      sharedTopicsJson: true,
      joinedAt: true,
      user: { select: { id: true, name: true } },
    },
    orderBy: { joinedAt: "asc" },
  });

  const sharingUserIds: string[] = topicAllowed
    ? memberShells
        .filter((m) => parseTopicsJson(m.sharedTopicsJson).includes(topic as TopicKey))
        .map((m) => m.userId)
    : [];

  // Second pass: load votes only for members who share the topic.
  const sharedVotes = sharingUserIds.length
    ? await prisma.vote.findMany({
        where: { userId: { in: sharingUserIds }, dish: { topic } },
        include: { dish: true },
      })
    : [];

  const votesByUser = new Map<string, typeof sharedVotes>();
  for (const v of sharedVotes) {
    const arr = votesByUser.get(v.userId) ?? [];
    arr.push(v);
    votesByUser.set(v.userId, arr);
  }

  const members = memberShells.map((m) => ({
    id: m.id,
    sessionId: m.sessionId,
    userId: m.userId,
    sharedTopicsJson: m.sharedTopicsJson,
    joinedAt: m.joinedAt,
    user: {
      ...m.user,
      votes: votesByUser.get(m.userId) ?? [],
    },
  }));

  const dishes = await prisma.dish.findMany({
    where: { topic },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return { session, members, dishes, currentUser: user };
}

export async function getDishResults(sessionId: string, topic: string = "ingredients") {
  const user = await getCurrentUser();
  if (!user) return null;

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) return null;

  const membership = await prisma.sessionMember.findUnique({
    where: { sessionId_userId: { sessionId, userId: user.id } },
  });
  if (session.hostId !== user.id && !membership) return null;

  const allowedTopics = parseTopicsJson(session.allowedTopicsJson);
  if (!allowedTopics.includes(topic as TopicKey)) {
    return { session, dishStats: [], currentUser: user };
  }

  const members = await prisma.sessionMember.findMany({
    where: { sessionId },
    select: { userId: true, sharedTopicsJson: true },
  });
  const sharingUserIds = members
    .filter((m) => parseTopicsJson(m.sharedTopicsJson).includes(topic as TopicKey))
    .map((m) => m.userId);

  const dishes = await prisma.dish.findMany({
    where: { topic },
    include: {
      votes: {
        where: { userId: { in: sharingUserIds } },
        include: { user: { select: { id: true, name: true } } },
      },
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  // Include all dishes — zero-vote ones surface "we forgot to vote on this"
  // to the host. The UI is responsible for distinguishing them.
  const dishStats = dishes.map((dish) => {
    const votes = dish.votes;
    const totalVotes = votes.length;
    const avgRating =
      totalVotes > 0
        ? votes.reduce((sum, v) => sum + v.rating, 0) / totalVotes
        : 0;
    const likers = votes.filter((v) => v.rating >= 4).map((v) => v.user);
    const dislikers = votes.filter((v) => v.rating <= 2).map((v) => v.user);

    return {
      id: dish.id,
      name: dish.name,
      category: dish.category,
      totalVotes,
      avgRating,
      likers,
      dislikers,
    };
  });

  // Sort: higher average first, then more votes (more confident), then by name
  // for a stable, deterministic order.
  dishStats.sort((a, b) =>
    b.avgRating - a.avgRating ||
    b.totalVotes - a.totalVotes ||
    a.name.localeCompare(b.name)
  );

  return { session, dishStats, currentUser: user };
}
