import { NextRequest, NextResponse } from "next/server";
import { INGREDIENT_FR } from "@/lib/i18n/ingredients-fr";
import { guardProxyRequest } from "@/lib/api-guards";

export const dynamic = "force-dynamic";

type MealDbIngredient = {
  idIngredient: string;
  strIngredient: string;
  strDescription: string | null;
  strType: string | null;
};

let cache: { at: number; data: MealDbIngredient[] } | null = null;
const TTL_MS = 24 * 60 * 60 * 1000;

async function loadAll(): Promise<MealDbIngredient[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list", { cache: "no-store" });
  if (!res.ok) {
    if (cache) return cache.data;
    return [];
  }
  const data = await res.json();
  cache = { at: Date.now(), data: (data.meals as MealDbIngredient[]) ?? [] };
  return cache.data;
}

function norm(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function slug(name: string): string {
  return name.toLowerCase().replace(/ /g, "_");
}

export async function GET(request: NextRequest) {
  const guard = await guardProxyRequest(request);
  if (!guard.ok) return guard.response;
  if (!guard.q) return NextResponse.json({ ingredients: [] });

  const all = await loadAll();
  if (all.length === 0) {
    return NextResponse.json({ error: "TheMealDB unreachable", ingredients: [] }, { status: 502 });
  }

  const nq = norm(guard.q);
  const matches = all
    .filter((ing) => {
      if (!ing.strIngredient) return false;
      const en = norm(ing.strIngredient);
      const fr = norm(INGREDIENT_FR[ing.strIngredient] ?? "");
      return en.includes(nq) || (fr && fr.includes(nq));
    })
    .slice(0, 12)
    .map((ing) => {
      const s = slug(ing.strIngredient);
      return {
        id: ing.idIngredient,
        name: INGREDIENT_FR[ing.strIngredient] ?? ing.strIngredient,
        slugEn: ing.strIngredient,
        imageUrl: `https://www.themealdb.com/images/ingredients/${s}.png`,
        thumb: `https://www.themealdb.com/images/ingredients/${s}-Small.png`,
        description: ing.strDescription,
      };
    });

  return NextResponse.json({ ingredients: matches });
}
