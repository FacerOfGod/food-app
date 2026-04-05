"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addDishAsMemberAction } from "@/actions/dishes";
import { DISHES_PRESET, PRESET_CATEGORIES } from "@/lib/dishes-preset";

interface Props {
  sessionId: string;
  existingDishNames: string[]; // already in session (lowercase)
}

export function GuestDishAdder({ sessionId, existingDishNames }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  // Draft state for custom dish
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftCategory, setDraftCategory] = useState("Autre");
  const [draftImageUrl, setDraftImageUrl] = useState("");

  const existingSet = new Set(existingDishNames.map((n) => n.toLowerCase()));

  const filtered = DISHES_PRESET.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      activeCategory === "Tous" || d.category === activeCategory;
    return matchSearch && matchCat;
  });

  async function addDish(dish: { name: string; category: string; imageUrl: string }) {
    if (existingSet.has(dish.name.toLowerCase())) return;
    startTransition(async () => {
      const result = await addDishAsMemberAction(sessionId, dish);
      if (result?.error) {
        setFeedback(result.error);
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback(`✓ "${dish.name}" ajouté !`);
        setTimeout(() => setFeedback(null), 2000);
        router.refresh();
      }
    });
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-orange-500 font-medium hover:text-orange-700 transition-colors"
      >
        + Proposer un plat
      </button>

      {/* Backdrop + panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div className="relative bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-xl">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">
                Proposer un plat
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Feedback toast */}
            {feedback && (
              <div className="mx-4 mt-2 text-xs text-center py-2 px-3 rounded-lg bg-orange-50 text-orange-700 font-medium">
                {feedback}
              </div>
            )}

            {/* Search */}
            <div className="px-4 pt-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher…"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
              />
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
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

            {/* Dish list */}
            <div className="overflow-y-auto px-4 pb-6 flex-1">
              {search.trim() !== "" &&
                !existingSet.has(search.trim().toLowerCase()) &&
                !DISHES_PRESET.some(
                  (d) => d.name.toLowerCase() === search.trim().toLowerCase()
                ) && (
                  isDrafting ? (
                    <div className="p-4 rounded-xl border border-orange-300 bg-orange-50 mb-4 space-y-3">
                      <p className="text-sm font-semibold text-orange-900">
                        Nouveau plat: &quot;{search.trim()}&quot;
                      </p>
                      <div>
                        <label className="block text-xs font-medium text-orange-800 mb-1">Catégorie</label>
                        <select
                          value={draftCategory}
                          onChange={(e) => setDraftCategory(e.target.value)}
                          className="w-full px-2 py-1.5 text-sm rounded-lg border border-orange-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                          <option value="Autre">Autre</option>
                          {PRESET_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-orange-800 mb-1">URL de l&apos;image (optionnelle)</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={draftImageUrl}
                          onChange={(e) => setDraftImageUrl(e.target.value)}
                          className="w-full px-2 py-1.5 text-sm rounded-lg border border-orange-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => {
                            setIsDrafting(false);
                            setDraftImageUrl("");
                            setDraftCategory("Autre");
                          }}
                          className="flex-1 py-1.5 text-xs font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => {
                            addDish({
                              name: search.trim(),
                              category: draftCategory,
                              imageUrl: draftImageUrl,
                            });
                            setIsDrafting(false);
                            setDraftImageUrl("");
                            setDraftCategory("Autre");
                            setSearch("");
                          }}
                          disabled={isPending}
                          className="flex-1 py-1.5 text-xs font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                        >
                          Confirmer l&apos;ajout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsDrafting(true)}
                      disabled={isPending}
                      className="w-full flex items-center gap-3 rounded-xl border border-orange-300 bg-orange-50 hover:bg-orange-100 transition-all text-left px-3 py-2 mb-4"
                    >
                      <div className="w-12 h-12 rounded-lg bg-orange-200 flex items-center justify-center flex-shrink-0 text-orange-600 font-bold text-xl">
                        +
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-orange-900">
                          Ajouter &quot;{search.trim()}&quot;
                        </p>
                        <p className="text-xs text-orange-600">
                          Nouveau plat / ingrédient
                        </p>
                      </div>
                    </button>
                  )
                )}

              {filtered.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-6">
                  Aucun résultat pour &quot;{search}&quot;
                </p>
              )}
              <div className="space-y-2">
                {filtered.map((dish) => {
                  const isAdded = existingSet.has(dish.name.toLowerCase());
                  return (
                    <button
                      key={dish.name}
                      onClick={() => addDish(dish)}
                      disabled={isAdded || isPending}
                      className={`w-full flex items-center gap-3 rounded-xl border transition-all text-left px-3 py-2
                        ${
                          isAdded
                            ? "border-orange-200 bg-orange-50 opacity-60 cursor-default"
                            : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm"
                        }`}
                    >
                      {dish.imageUrl && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={dish.imageUrl}
                            alt={dish.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {dish.name}
                        </p>
                        <p className="text-xs text-gray-400">{dish.category}</p>
                      </div>
                      {isAdded ? (
                        <span className="text-orange-400 text-sm">✓</span>
                      ) : (
                        <span className="text-gray-300 text-sm">+</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
