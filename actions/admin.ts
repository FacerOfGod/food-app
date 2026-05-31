"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isAdminEmail } from "@/lib/admin";
import { validateImageUrl } from "@/lib/images";
import { ACTIVITIES_PRESET } from "@/lib/presets/activities";

const ADMIN_SYNC_FETCH_TIMEOUT_MS = 5_000;
const ADMIN_SYNC_MAX_ITEMS = 1_000;

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

// Race a fetch against an AbortController to bound latency in admin sync loops.
async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = ADMIN_SYNC_FETCH_TIMEOUT_MS
): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function getUsers() {
  const admin = await requireAdmin();
  if (!admin) return [];
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, isBanned: true, createdAt: true },
  });
}

export async function deleteUserAction(userId: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé." };
  if (userId === admin.id) return { error: "Impossible de se supprimer soi-même." };

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
  return { success: true };
}

export async function banUserAction(userId: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé." };
  if (userId === admin.id) return { error: "Impossible de se bannir soi-même." };
  await prisma.user.update({ where: { id: userId }, data: { isBanned: true } });
  revalidatePath("/admin");
  return { success: true };
}

export async function unbanUserAction(userId: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé." };
  await prisma.user.update({ where: { id: userId }, data: { isBanned: false } });
  revalidatePath("/admin");
  return { success: true };
}

export async function resetIngredientsDbAction() {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé." };

  const { INGREDIENTS_PRESET } = await import("@/lib/presets/ingredients");

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.dish.findMany({ where: { topic: "ingredients" }, select: { id: true } });
    const ids = existing.map((d) => d.id);
    if (ids.length > 0) {
      await tx.vote.deleteMany({ where: { dishId: { in: ids } } });
      await tx.dish.deleteMany({ where: { topic: "ingredients" } });
    }
    await tx.dish.createMany({
      data: INGREDIENTS_PRESET.map((d, i) => ({
        name: d.name,
        topic: "ingredients",
        category: d.category || null,
        imageUrl: d.imageUrl || null,
        proposerId: null,
        order: i,
        authorsJson: "[]",
      })),
    });
    return { deleted: ids.length };
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { deleted: result.deleted, seeded: INGREDIENTS_PRESET.length };
}

export async function backfillMoviePostersAction() {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé.", updated: 0, total: 0, failed: 0 };

  const key = process.env.TMDB_API_KEY;
  if (!key) return { error: "TMDB_API_KEY non configuré.", updated: 0, total: 0, failed: 0 };

  // Target movies missing a rating (covers first-run seeded movies and any that
  // failed previously). Capped to keep the action bounded.
  const movies = await prisma.dish.findMany({
    where: { topic: "movies", tmdbRating: null },
    select: { id: true, name: true, imageUrl: true },
    take: ADMIN_SYNC_MAX_ITEMS,
  });

  const BATCH_SIZE = 8;
  type Pending = { id: string; data: { tmdbRating: number | null; imageUrl?: string } };
  const pending: Pending[] = [];
  const failed: { name: string; reason: string }[] = [];

  for (let i = 0; i < movies.length; i += BATCH_SIZE) {
    const batch = movies.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (movie): Promise<Pending | { error: string; movie: typeof movie }> => {
        try {
          const searchUrl = new URL("https://api.themoviedb.org/3/search/movie");
          searchUrl.searchParams.set("query", movie.name);
          searchUrl.searchParams.set("language", "fr-FR");
          const searchRes = await fetchWithTimeout(searchUrl.toString(), {
            headers: { Authorization: `Bearer ${key}` },
          });
          if (!searchRes) return { error: "Délai dépassé", movie };
          if (!searchRes.ok) {
            return { error: `TMDB ${searchRes.status}`, movie };
          }

          const searchData = await searchRes.json();
          const first = searchData.results?.[0];
          if (!first) return { error: "Aucun résultat", movie };

          const tmdbRating =
            (first.vote_count ?? 0) > 0 ? (first.vote_average ?? null) : null;

          // Only refresh the poster if it's missing or a placeholder.
          // Use the TMDB CDN URL directly instead of inlining the image as a
          // base64 data: URL (which bloats the DB and bypasses validateImageUrl).
          const needsImage =
            !movie.imageUrl || movie.imageUrl.startsWith("https://images.unsplash.com");

          const data: Pending["data"] = { tmdbRating };
          if (needsImage && first.poster_path) {
            const candidate = `https://image.tmdb.org/t/p/w500${first.poster_path}`;
            const safe = validateImageUrl(candidate);
            if (safe) data.imageUrl = safe;
          }

          return { id: movie.id, data };
        } catch (e) {
          return { error: e instanceof Error ? e.message : "Erreur inconnue", movie };
        }
      })
    );

    for (const r of results) {
      if ("error" in r) {
        failed.push({ name: r.movie.name, reason: r.error });
      } else {
        pending.push(r);
      }
    }
  }

  if (pending.length > 0) {
    await prisma.$transaction(
      pending.map((p) => prisma.dish.update({ where: { id: p.id }, data: p.data }))
    );
  }

  if (failed.length > 0) {
    console.error(`[backfillMoviePostersAction] ${failed.length} failed:`, failed.slice(0, 10));
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { updated: pending.length, total: movies.length, failed: failed.length };
}

export async function syncActivitiesAction() {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé.", inserted: 0, updated: 0 };

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.dish.findMany({
      where: { topic: "activities" },
      select: { name: true },
    });
    const existingNames = new Set(existing.map((d) => d.name));

    const toInsert = ACTIVITIES_PRESET.filter((d) => !existingNames.has(d.name));
    const toUpdate = ACTIVITIES_PRESET.filter((d) => existingNames.has(d.name));

    const maxOrderResult = await tx.dish.aggregate({
      where: { topic: "activities" },
      _max: { order: true },
    });
    const startOrder = (maxOrderResult._max.order ?? -1) + 1;

    if (toInsert.length > 0) {
      await tx.dish.createMany({
        data: toInsert.map((d, i) => ({
          name: d.name,
          topic: "activities",
          category: d.category || null,
          imageUrl: validateImageUrl(d.imageUrl),
          proposerId: null,
          order: startOrder + i,
          authorsJson: "[]",
        })),
      });
    }

    for (const d of toUpdate) {
      await tx.dish.updateMany({
        where: { topic: "activities", name: d.name, proposerId: null },
        data: { imageUrl: validateImageUrl(d.imageUrl) },
      });
    }

    return { inserted: toInsert.length, updated: toUpdate.length };
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return result;
}
