"use client";

import { useState } from "react";

interface User {
  id: string;
  name: string | null;
}

interface DishStat {
  id: string;
  name: string;
  category: string | null;
  totalVotes: number;
  avgRating: number;
  likers: User[];
  dislikers: User[];
}

interface Props {
  dishStats: DishStat[];
}

export function DishesView({ dishStats }: Props) {
  const [selectedDish, setSelectedDish] = useState<DishStat | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  if (dishStats.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-8">
        Aucun plat dans cette session.
      </p>
    );
  }

  const normalizeSearch = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const searchNormalized = normalizeSearch(searchQuery);

  const filteredDishes = dishStats.filter(d =>
    normalizeSearch(d.name).includes(searchNormalized) ||
    (d.category && normalizeSearch(d.category).includes(searchNormalized))
  );
  const visibleDishes = filteredDishes.slice(0, visibleCount);

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(20); }}
          placeholder="Rechercher un plat…"
          className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        />
      </div>

      <div className="space-y-3">
        {filteredDishes.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">Aucun résultat.</p>
        ) : visibleDishes.map((dish) => {
          const likeCount = dish.likers.length;
          const dislikeCount = dish.dislikers.length;
          const total = dish.totalVotes;
          const likePercent = total > 0 ? Math.round((likeCount / total) * 100) : 0;
          const dislikePercent = total > 0 ? Math.round((dislikeCount / total) * 100) : 0;

          return (
            <button
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
              className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-gray-900 text-sm">{dish.name}</span>
                  {dish.category && (
                    <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {dish.category}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-700">
                    {dish.avgRating > 0 ? dish.avgRating.toFixed(1) : "—"}
                  </span>
                  <span className="text-xs text-gray-400"> / 5</span>
                </div>
              </div>

              {total > 0 ? (
                <>
                  {/* Like/dislike bar */}
                  <div className="h-2 rounded-full bg-gray-100 flex overflow-hidden">
                    {likePercent > 0 && (
                      <div
                        className="h-full bg-green-400 transition-all"
                        style={{ width: `${likePercent}%` }}
                      />
                    )}
                    {dislikePercent > 0 && (
                      <div
                        className="h-full bg-red-300 ml-auto transition-all"
                        style={{ width: `${dislikePercent}%` }}
                      />
                    )}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-green-600">
                      👍 {likeCount} aime
                    </span>
                    <span className="text-xs text-gray-400">{total} votes</span>
                    <span className="text-xs text-red-500">
                      {dislikeCount} évite 👎
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-gray-400">Aucun vote</p>
              )}
            </button>
          );
        })}
      </div>

      {filteredDishes.length > visibleCount && (
        <button
          onClick={() => setVisibleCount((n) => n + 20)}
          className="w-full mt-3 py-2.5 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl border border-orange-200 transition-colors"
        >
          Voir plus ({filteredDishes.length - visibleCount} restants)
        </button>
      )}

      {/* Dislikers modal */}
      {selectedDish && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedDish(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-gray-900 text-base mb-1">
              {selectedDish.name}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {selectedDish.totalVotes} vote{selectedDish.totalVotes !== 1 ? "s" : ""}
            </p>

            {selectedDish.dislikers.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">
                  Évitent ce plat
                </p>
                <div className="space-y-1">
                  {selectedDish.dislikers.map((u) => (
                    <div key={u.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center">
                        {(u.name ?? "?")[0].toUpperCase()}
                      </div>
                      {u.name ?? "Anonyme"}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDish.likers.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">
                  Aiment ce plat
                </p>
                <div className="space-y-1">
                  {selectedDish.likers.map((u) => (
                    <div key={u.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center justify-center">
                        {(u.name ?? "?")[0].toUpperCase()}
                      </div>
                      {u.name ?? "Anonyme"}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDish.dislikers.length === 0 && selectedDish.likers.length === 0 && (
              <p className="text-sm text-gray-400">Aucun vote extrême.</p>
            )}

            <button
              onClick={() => setSelectedDish(null)}
              className="w-full mt-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
