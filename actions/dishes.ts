"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getPresetForTopic } from "@/lib/presets";

export async function seedPresetDishesAction(topic: string = "food") {
  const user = await getCurrentUser();
  if (!user) return;

  const presets = getPresetForTopic(topic);

  const existing = await prisma.dish.findMany({
    where: { topic },
    select: { name: true },
  });
  const existingNames = new Set(existing.map((d) => d.name.toLowerCase()));

  const toAdd = presets.filter((d) => !existingNames.has(d.name.toLowerCase()));
  if (toAdd.length === 0) return;

  const totalCount = await prisma.dish.count({ where: { topic } });

  await prisma.dish.createMany({
    data: toAdd.map((d, i) => ({
      name: d.name,
      topic,
      category: d.category || null,
      imageUrl: d.imageUrl || null,
      proposerId: user.id,
      order: totalCount + i,
      authorsJson: "[]",
    })),
  });
}

export async function getAllDishes(topic: string = "food") {
  const user = await getCurrentUser();
  if (!user) return null;
  return prisma.dish.findMany({
    where: { topic },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { id: true, name: true, imageUrl: true, authorsJson: true },
  });
}

export async function addDishAsMemberAction(
  dish: { name: string; category: string; imageUrl: string; topic?: string }
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const topic = dish.topic || "food";

  const allDishes = await prisma.dish.findMany({
    where: { topic },
    select: { name: true },
  });
  const duplicate = allDishes.some(
    (d) => d.name.toLowerCase() === dish.name.toLowerCase()
  );
  if (duplicate) {
    const label =
      topic === "movies" ? "film" : topic === "activities" ? "activité" : "plat";
    return { error: `Ce ${label} existe déjà.` };
  }

  const count = await prisma.dish.count({ where: { topic } });
  const authorName = user.name ?? user.email;
  await prisma.dish.create({
    data: {
      name: dish.name,
      topic,
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
    select: { authorsJson: true, name: true, topic: true },
  });
  if (!dish) return { error: "Élément introuvable." };

  if (updates.name && updates.name.toLowerCase() !== dish.name.toLowerCase()) {
    const allDishes = await prisma.dish.findMany({
      where: { topic: dish.topic },
      select: { id: true, name: true },
    });
    const duplicate = allDishes.some(
      (d) => d.id !== dishId && d.name.toLowerCase() === updates.name!.toLowerCase()
    );
    if (duplicate) return { error: "Ce nom existe déjà." };
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
  const topic = (formData.get("topic") as string)?.trim() || "food";

  if (!name) return { error: "Veuillez entrer un nom." };

  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const count = await prisma.dish.count({ where: { topic } });

  await prisma.dish.create({
    data: { name, topic, category, imageUrl, proposerId: user.id, order: count },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

interface DishInput {
  name: string;
  category: string;
  imageUrl: string;
  topic?: string;
}

export async function addManyDishesAction(dishesToAdd: DishInput[], topic: string = "food") {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const count = await prisma.dish.count({ where: { topic } });

  await prisma.dish.createMany({
    data: dishesToAdd.map((d, i) => ({
      name: d.name,
      topic: d.topic || topic,
      category: d.category || null,
      imageUrl: d.imageUrl || null,
      proposerId: user.id,
      order: count + i,
    })),
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function removeAllDishesAction(topic: string = "food") {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  await prisma.dish.deleteMany({ where: { topic } });

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

export async function getSessionDishes(sessionId: string, topic: string = "food") {
  const user = await getCurrentUser();
  if (!user) throw new Error("Non authentifié");

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) throw new Error(`Session ${sessionId} introuvable`);
  if (session.hostId !== user.id) throw new Error("Accès refusé");

  const dishes = await prisma.dish.findMany({
    where: { topic },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return { session, user, dishes };
}
