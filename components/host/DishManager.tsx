"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  addDishAction,
  addManyDishesAction,
  removeDishAction,
  removeAllDishesAction,
} from "@/actions/dishes";
import { DISHES_PRESET, PRESET_CATEGORIES } from "@/lib/dishes-preset";

interface Dish {
  id: string;
  name: string;
  category: string | null;
  imageUrl: string | null;
}

interface Props {
  sessionId: string;
  dishes: Dish[];
}

export function DishManager({ sessionId, dishes }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const [isPending, startTransition] = useTransition();

  const sessionDishNames = new Set(dishes.map((d) => d.name.toLowerCase()));

  const filtered = DISHES_PRESET.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      activeCategory === "Tous" || d.category === activeCategory;
    return matchSearch && matchCat;
  });

  async function addPreset(dish: (typeof DISHES_PRESET)[0]) {
    if (sessionDishNames.has(dish.name.toLowerCase())) return;
    const fd = new FormData();
    fd.set("sessionId", sessionId);
    fd.set("name", dish.name);
    fd.set("category", dish.category);
    fd.set("imageUrl", dish.imageUrl);
    startTransition(async () => {
      await addDishAction(null, fd);
    });
  }

  async function removeDish(dishId: string) {
    const fd = new FormData();
    fd.set("sessionId", sessionId);
    fd.set("dishId", dishId);
    startTransition(async () => {
      await removeDishAction(null, fd);
    });
  }

  function selectAllVisible() {
    const toAdd = filtered.filter(
      (d) => !sessionDishNames.has(d.name.toLowerCase())
    );
    if (toAdd.length === 0) return;
    startTransition(async () => {
      await addManyDishesAction(sessionId, toAdd);
    });
  }

  function removeAll() {
    startTransition(async () => {
      await removeAllDishesAction(sessionId);
    });
  }

  const unadded = filtered.filter(
    (d) => !sessionDishNames.has(d.name.toLowerCase())
  ).length;

  return (
    <div className="space-y-6">
      {/* Current session dishes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">
            Plats sélectionnés{" "}
            <span className="text-orange-500 font-bold">({dishes.length})</span>
          </h2>
          {dishes.length > 0 && (
            <button
              onClick={removeAll}
              disabled={isPending}
              className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors"
            >
              Tout retirer
            </button>
          )}
        </div>

        {dishes.length === 0 ? (
          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-4 text-center">
            Aucun plat sélectionné. Choisissez dans le catalogue ci-dessous.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {dishes.map((dish) => (
              <div
                key={dish.id}
                className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full pl-1 pr-3 py-1"
              >
                {dish.imageUrl && (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="text-xs font-medium text-orange-700">
                  {dish.name}
                </span>
                <button
                  onClick={() => removeDish(dish.id)}
                  disabled={isPending}
                  className="text-orange-400 hover:text-red-500 transition-colors text-xs leading-none"
                  aria-label={`Retirer ${dish.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Catalog */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">
            Catalogue de plats
          </h2>
          {unadded > 0 && (
            <button
              onClick={selectAllVisible}
              disabled={isPending}
              className="text-xs text-orange-500 hover:text-orange-700 font-medium disabled:opacity-50 transition-colors"
            >
              Tout sélectionner ({unadded})
            </button>
          )}
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un plat…"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
        />

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {["Tous", ...PRESET_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dish grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((dish) => {
            const isAdded = sessionDishNames.has(dish.name.toLowerCase());
            return (
              <button
                key={dish.name}
                onClick={() => addPreset(dish)}
                disabled={isAdded || isPending}
                className={`relative rounded-xl overflow-hidden border-2 transition-all text-left group
                  ${
                    isAdded
                      ? "border-orange-400 opacity-60 cursor-default"
                      : "border-transparent hover:border-orange-300 hover:shadow-md cursor-pointer"
                  }`}
              >
                <div className="relative h-24 w-full bg-gray-100">
                  <Image
                    src={dish.imageUrl}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover"
                  />
                  {isAdded && (
                    <div className="absolute inset-0 bg-orange-500/30 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">✓</span>
                    </div>
                  )}
                </div>
                <div className="bg-white px-2 py-1.5">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {dish.name}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {dish.category}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-6">
            Aucun plat trouvé pour &quot;{search}&quot;
          </p>
        )}
      </div>
    </div>
  );
}
