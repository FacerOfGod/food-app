"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { DISHES_PRESET } from "@/lib/dishes-preset";

export async function seedPresetDishesAction() {
  const user = await getCurrentUser();
  if (!user) return;

  const existing = await prisma.dish.findMany({ select: { name: true } });
  const existingNames = new Set(existing.map((d) => d.name.toLowerCase()));

  const toAdd = DISHES_PRESET.filter((d) => !existingNames.has(d.name.toLowerCase()));
  if (toAdd.length === 0) return;

  await prisma.dish.createMany({
    data: toAdd.map((d, i) => ({
      name: d.name,
      category: d.category || null,
      imageUrl: d.imageUrl || null,
      proposerId: user.id,
      order: existing.length + i,
      authorsJson: "[]",
    })),
  });

  revalidatePath("/dashboard");
}

export async function getAllDishes() {
  const user = await getCurrentUser();
  if (!user) return null;
  return prisma.dish.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { id: true, name: true, imageUrl: true, authorsJson: true },
  });
}

export async function addDishAsMemberAction(
  dish: { name: string; category: string; imageUrl: string }
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const allDishes = await prisma.dish.findMany({ select: { name: true } });
  const duplicate = allDishes.some(
    (d) => d.name.toLowerCase() === dish.name.toLowerCase()
  );
  if (duplicate) return { error: "Ce plat existe déjà." };

  const count = await prisma.dish.count();
  const authorName = user.name ?? user.email;
  await prisma.dish.create({
    data: {
      name: dish.name,
      category: dish.category || null,
      imageUrl: dish.imageUrl || null,
      proposerId: user.id,
      order: count,
      authorsJson: JSON.stringify([authorName]),
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function removeDishAsMemberAction(dishId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  await prisma.dish.delete({ where: { id: dishId } });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateDishAsMemberAction(
  dishId: string,
  updates: { name?: string; imageUrl?: string }
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const dish = await prisma.dish.findFirst({
    where: { id: dishId },
    select: { authorsJson: true, name: true },
  });
  if (!dish) return { error: "Plat introuvable." };

  if (updates.name && updates.name.toLowerCase() !== dish.name.toLowerCase()) {
    const allDishes = await prisma.dish.findMany({ select: { id: true, name: true } });
    const duplicate = allDishes.some(
      (d) => d.id !== dishId && d.name.toLowerCase() === updates.name!.toLowerCase()
    );
    if (duplicate) return { error: "Ce nom de plat existe déjà." };
  }

  let authors: string[] = [];
  try { authors = JSON.parse(dish.authorsJson); } catch { authors = []; }
  const authorName = user.name ?? user.email;
  if (!authors.includes(authorName)) authors.push(authorName);

  await prisma.dish.update({
    where: { id: dishId },
    data: {
      ...(updates.name ? { name: updates.name } : {}),
      ...(updates.imageUrl !== undefined ? { imageUrl: updates.imageUrl || null } : {}),
      authorsJson: JSON.stringify(authors),
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function addDishAction(_prevState: unknown, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;

  if (!name) return { error: "Veuillez entrer un nom de plat." };

  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const count = await prisma.dish.count();

  await prisma.dish.create({
    data: { name, category, imageUrl, proposerId: user.id, order: count },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

interface DishInput {
  name: string;
  category: string;
  imageUrl: string;
}

export async function addManyDishesAction(dishesToAdd: DishInput[]) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const count = await prisma.dish.count();

  await prisma.dish.createMany({
    data: dishesToAdd.map((d, i) => ({
      name: d.name,
      category: d.category || null,
      imageUrl: d.imageUrl || null,
      proposerId: user.id,
      order: count + i,
    })),
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function removeAllDishesAction() {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  await prisma.dish.deleteMany();

  revalidatePath("/dashboard");
  return { success: true };
}

export async function removeDishAction(_prevState: unknown, formData: FormData) {
  const dishId = formData.get("dishId") as string;

  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  await prisma.dish.delete({ where: { id: dishId } });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getSessionDishes(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Non authentifié");

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) throw new Error(`Session ${sessionId} introuvable`);
  if (session.hostId !== user.id) throw new Error("Accès refusé");

  const dishes = await prisma.dish.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return { session, user, dishes };
}
