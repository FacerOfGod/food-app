import { NextRequest, NextResponse } from "next/server";
import { guardProxyRequest } from "@/lib/api-guards";

export const dynamic = "force-dynamic";

const CATEGORY_MAP: Record<string, string> = {
  Beef: "Viande",
  Chicken: "Volaille",
  Seafood: "Fruits de mer",
  Vegetarian: "Végétarienne",
  Vegan: "Végétalienne",
  Pasta: "Pâtes",
  Pork: "Charcuterie",
  Lamb: "Viande",
  Starter: "Entrée",
  Side: "Accompagnement",
  Dessert: "Dessert",
  Breakfast: "Petit-déjeuner",
};

export async function GET(request: NextRequest) {
  const guard = await guardProxyRequest(request);
  if (!guard.ok) return guard.response;
  if (!guard.q) return NextResponse.json({ meals: [] });

  const url = new URL("https://www.themealdb.com/api/json/v1/1/search.php");
  url.searchParams.set("s", guard.q);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: "MealDB error" }, { status: 502 });

  const data = await res.json();
  const meals = (data.meals ?? []).slice(0, 8).map((m: {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strThumbnail: string;
  }) => ({
    id: m.idMeal,
    name: m.strMeal,
    category: CATEGORY_MAP[m.strCategory] ?? "Autre",
    thumb: m.strThumbnail ? `${m.strThumbnail}/preview` : null,
    imageUrl: m.strThumbnail ?? "",
  }));

  return NextResponse.json({ meals });
}
