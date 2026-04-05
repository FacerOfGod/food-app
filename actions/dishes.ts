"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

async function assertHostAccess(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Non authentifié");

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session || session.hostId !== user.id)
    throw new Error("Accès refusé");

  return { user, session };
}

async function assertMemberAccess(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Non authentifié");

  const membership = await prisma.sessionMember.findUnique({
    where: { sessionId_userId: { sessionId, userId: user.id } },
  });
  if (!membership) throw new Error("Accès refusé");

  return { user };
}

export async function addDishAsMemberAction(
  sessionId: string,
  dish: { name: string; category: string; imageUrl: string }
) {
  let currentUser;
  try {
    const { user } = await assertMemberAccess(sessionId);
    currentUser = user;
  } catch {
    return { error: "Accès refusé." };
  }

  // Check for duplicate (case-insensitive)
  const allDishes = await prisma.dish.findMany({
    where: { sessionId },
    select: { name: true },
  });
  const duplicate = allDishes.some(
    (d) => d.name.toLowerCase() === dish.name.toLowerCase()
  );
  if (duplicate) return { error: "Ce plat existe déjà dans la session." };

  const count = await prisma.dish.count({ where: { sessionId } });
  await prisma.dish.create({
    data: {
      name: dish.name,
      category: dish.category || null,
      imageUrl: dish.imageUrl || null,
      sessionId,
      proposerId: currentUser.id,
      order: count,
    },
  });

  revalidatePath(`/vote/${sessionId}`);
  return { success: true };
}

export async function addDishAction(_prevState: unknown, formData: FormData) {
  const sessionId = formData.get("sessionId") as string;
  const name = (formData.get("name") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;

  if (!name) return { error: "Veuillez entrer un nom de plat." };

  let currentUser;
  try {
    const { user } = await assertHostAccess(sessionId);
    currentUser = user;
  } catch {
    return { error: "Accès refusé." };
  }

  const count = await prisma.dish.count({ where: { sessionId } });

  await prisma.dish.create({
    data: { name, category, imageUrl, sessionId, proposerId: currentUser.id, order: count },
  });

  revalidatePath(`/host/${sessionId}/dishes`);
  return { success: true };
}

interface DishInput {
  name: string;
  category: string;
  imageUrl: string;
}

export async function addManyDishesAction(
  sessionId: string,
  dishesToAdd: DishInput[]
) {
  let currentUser;
  try {
    const { user } = await assertHostAccess(sessionId);
    currentUser = user;
  } catch {
    return { error: "Accès refusé." };
  }

  const count = await prisma.dish.count({ where: { sessionId } });

  await prisma.dish.createMany({
    data: dishesToAdd.map((d, i) => ({
      name: d.name,
      category: d.category || null,
      imageUrl: d.imageUrl || null,
      sessionId,
      proposerId: currentUser.id,
      order: count + i,
    })),
  });

  revalidatePath(`/host/${sessionId}/dishes`);
  return { success: true };
}

export async function removeAllDishesAction(sessionId: string) {
  try {
    await assertHostAccess(sessionId);
  } catch {
    return { error: "Accès refusé." };
  }

  await prisma.dish.deleteMany({ where: { sessionId } });

  revalidatePath(`/host/${sessionId}/dishes`);
  return { success: true };
}

export async function removeDishAction(_prevState: unknown, formData: FormData) {
  const sessionId = formData.get("sessionId") as string;
  const dishId = formData.get("dishId") as string;

  try {
    await assertHostAccess(sessionId);
  } catch {
    return { error: "Accès refusé." };
  }

  await prisma.dish.delete({ where: { id: dishId } });

  revalidatePath(`/host/${sessionId}/dishes`);
  return { success: true };
}

export async function getSessionDishes(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      dishes: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
    },
  });

  if (!session || session.hostId !== user.id) return null;

  return { session, user };
}
