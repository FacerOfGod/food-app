"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getPresetForTopic } from "@/lib/presets";
import { validateImageUrl } from "@/lib/images";
import { isAdminEmail } from "@/lib/admin";

type DishOwner = { proposerId: string | null };
type UserLike = { id: string; email: string };

function canModifyDish(user: UserLike, dish: DishOwner): boolean {
  if (isAdminEmail(user.email)) return true;
  return dish.proposerId === user.id;
}

function isUniqueViolation(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
}

export async function seedPresetDishesAction(topic: string = "ingredients") {
  const user = await getCurrentUser();
  if (!user) return;

  // Only seed when the catalogue for this topic is empty.
  // Avoids a Dish.findMany on every dashboard render once data exists.
  const totalCount = await prisma.dish.count({ where: { topic } });
  if (totalCount > 0) return;

  const presets = getPresetForTopic(topic);
  if (presets.length === 0) return;

  // Preset rows are "owned by the catalogue" (proposerId: null), not by the
  // happens-to-be-first visitor. Admins can edit them via canModifyDish.
  // Wrapped in a transaction so a partial insert can't strand the catalogue
  // half-empty (the count gate would then refuse to re-seed).
  // The unique constraint on (topic, name) makes concurrent seed attempts safe:
  // the second one fails atomically and we ignore it.
  try {
    await prisma.$transaction(async (tx) => {
      await tx.dish.createMany({
        data: presets.map((d, i) => ({
          name: d.name,
          topic,
          category: d.category || null,
          imageUrl: validateImageUrl(d.imageUrl),
          proposerId: null,
          order: i,
          authorsJson: "[]",
        })),
      });
    });
  } catch (err) {
    if (!isUniqueViolation(err)) throw err;
  }
}

export async function getAllDishes(topic: string = "ingredients") {
  const user = await getCurrentUser();
  if (!user) return null;
  const dishes = await prisma.dish.findMany({
    where: { topic },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      name: true,
      imageUrl: true,
      proposerId: true,
      proposer: { select: { name: true, email: true } },
    },
  });
  // Drop proposerId/proposer from the client-facing shape — only ship the
  // booleans/strings we need. canModify mirrors the server-side guard;
  // author is the display name of whoever added the dish (null for presets).
  return dishes.map(({ proposerId, proposer, ...d }) => ({
    ...d,
    canModify: canModifyDish(user, { proposerId }),
    author: proposer ? (proposer.name ?? proposer.email) : null,
  }));
}

function duplicateLabel(topic: string): string {
  if (topic === "movies") return "film";
  if (topic === "activities") return "activité";
  if (topic === "ingredients") return "ingrédient";
  return "plat";
}

export async function addDishAsMemberAction(
  dish: { name: string; category: string; imageUrl: string; topic?: string; tmdbRating?: number | null }
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const topic = dish.topic || "ingredients";
  const count = await prisma.dish.count({ where: { topic } });
  const authorName = user.name ?? user.email;

  // Rely on the (topic, name) unique constraint as the source of truth.
  // A pre-check would race against concurrent inserts.
  try {
    await prisma.dish.create({
      data: {
        name: dish.name,
        topic,
        category: dish.category || null,
        imageUrl: validateImageUrl(dish.imageUrl),
        tmdbRating: dish.tmdbRating ?? null,
        proposerId: user.id,
        order: count,
        authorsJson: JSON.stringify([authorName]),
      },
    });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { error: `Ce ${duplicateLabel(topic)} existe déjà.` };
    }
    throw err;
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function removeDishAsMemberAction(dishId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const dish = await prisma.dish.findUnique({
    where: { id: dishId },
    select: { proposerId: true },
  });
  if (!dish) return { error: "Élément introuvable." };
  if (!canModifyDish(user, dish)) return { error: "Non autorisé." };

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
    select: { name: true, topic: true, proposerId: true },
  });
  if (!dish) return { error: "Élément introuvable." };
  if (!canModifyDish(user, dish)) return { error: "Non autorisé." };

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

  // authorsJson is no longer mutated on edit. Permissions are owned by
  // canModifyDish (proposer + admin); a "co-author" credit that doesn't grant
  // any rights was misleading. The column is kept for legacy reads.
  try {
    await prisma.dish.update({
      where: { id: dishId },
      data: {
        ...(updates.name ? { name: updates.name } : {}),
        ...(updates.imageUrl !== undefined ? { imageUrl: validateImageUrl(updates.imageUrl) } : {}),
      },
    });
  } catch (err) {
    if (isUniqueViolation(err)) return { error: "Ce nom existe déjà." };
    throw err;
  }

  revalidatePath("/dashboard");
  return { success: true };
}

function readString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function addDishAction(_prevState: unknown, formData: FormData) {
  const name = readString(formData, "name").trim();
  const category = readString(formData, "category").trim() || null;
  const imageUrl = readString(formData, "imageUrl").trim() || null;
  const topic = readString(formData, "topic").trim() || "ingredients";

  if (!name) return { error: "Veuillez entrer un nom." };

  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const count = await prisma.dish.count({ where: { topic } });

  try {
    await prisma.dish.create({
      data: { name, topic, category, imageUrl: validateImageUrl(imageUrl), proposerId: user.id, order: count },
    });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { error: `Ce ${duplicateLabel(topic)} existe déjà.` };
    }
    throw err;
  }

  revalidatePath("/dashboard");
  return { success: true };
}

interface DishInput {
  name: string;
  category: string;
  imageUrl: string;
  topic?: string;
}

export async function addManyDishesAction(dishesToAdd: DishInput[], topic: string = "ingredients") {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const count = await prisma.dish.count({ where: { topic } });

  await prisma.dish.createMany({
    data: dishesToAdd.map((d, i) => ({
      name: d.name,
      topic: d.topic || topic,
      category: d.category || null,
      imageUrl: validateImageUrl(d.imageUrl),
      proposerId: user.id,
      order: count + i,
    })),
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function removeAllDishesAction(topic: string = "ingredients") {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };
  if (!isAdminEmail(user.email)) return { error: "Non autorisé." };

  await prisma.dish.deleteMany({ where: { topic } });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function removeDishAction(_prevState: unknown, formData: FormData) {
  const dishId = readString(formData, "dishId").trim();
  if (!dishId) return { error: "Données invalides." };

  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié." };

  const dish = await prisma.dish.findUnique({
    where: { id: dishId },
    select: { proposerId: true },
  });
  if (!dish) return { error: "Élément introuvable." };
  if (!canModifyDish(user, dish)) return { error: "Non autorisé." };

  await prisma.dish.delete({ where: { id: dishId } });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getSessionDishes(sessionId: string, topic: string = "ingredients") {
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
