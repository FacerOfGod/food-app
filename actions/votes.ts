"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function submitVoteAction(formData: FormData) {
  const dishId = formData.get("dishId") as string;
  const rating = parseInt(formData.get("rating") as string, 10);

  if (!dishId || isNaN(rating) || rating < 1 || rating > 5) {
    return { error: "Données invalides." };
  }

  const user = await getCurrentUser();
  if (!user) redirect("/");

  await prisma.vote.upsert({
    where: { userId_dishId: { userId: user.id, dishId } },
    update: { rating },
    create: { userId: user.id, dishId, rating },
  });

  return { success: true };
}

export async function getVotingData() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [dishes, userVotes] = await Promise.all([
    prisma.dish.findMany({
      include: { proposer: { select: { name: true } } },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    }),
    prisma.vote.findMany({
      where: { userId: user.id },
      select: { dishId: true, rating: true },
    }),
  ]);

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

export async function joinSessionAction(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  await prisma.sessionMember.upsert({
    where: { sessionId_userId: { sessionId, userId: user.id } },
    update: {},
    create: { sessionId, userId: user.id },
  });
}

export async function getPeopleResults(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) return null;

  const membership = await prisma.sessionMember.findUnique({
    where: { sessionId_userId: { sessionId, userId: user.id } },
  });
  if (session.hostId !== user.id && !membership) return null;

  const members = await prisma.sessionMember.findMany({
    where: { sessionId },
    include: {
      user: {
        include: {
          votes: {
            include: { dish: true },
          },
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  const dishes = await prisma.dish.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return { session, members, dishes, currentUser: user };
}

export async function getDishResults(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) return null;

  const membership = await prisma.sessionMember.findUnique({
    where: { sessionId_userId: { sessionId, userId: user.id } },
  });
  if (session.hostId !== user.id && !membership) return null;

  const members = await prisma.sessionMember.findMany({
    where: { sessionId },
    select: { userId: true },
  });
  const memberIds = members.map((m) => m.userId);

  const dishes = await prisma.dish.findMany({
    include: {
      votes: {
        where: { userId: { in: memberIds } },
        include: { user: { select: { id: true, name: true } } },
      },
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const votedDishes = dishes.filter((d) => d.votes.length > 0);

  const dishStats = votedDishes.map((dish) => {
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

  dishStats.sort((a, b) => b.avgRating - a.avgRating);

  return { session, dishStats, currentUser: user };
}
