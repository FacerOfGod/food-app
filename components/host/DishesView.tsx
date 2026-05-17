"use client";

import { useState } from "react";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { listContainerVariants, listItemVariants, scaleInVariants, barGrowVariants } from "@/components/motion/variants";

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
      <div className="text-center py-8">
        <p className="text-sm text-gray-400 mb-2">Aucun vote pour ce groupe.</p>
        <Link
          href="/dashboard?view=vote"
          className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
        >
          Voter sur les plats !
        </Link>
      </div>
    );
  }

  const normalizeSearch = (str: string) =>
    str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const searchNormalized = normalizeSearch(searchQuery);

  const filteredDishes = dishStats.filter(
    (d) =>
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
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 bg-white transition-all"
        />
      </div>

      <m.div
        className="space-y-3"
        variants={listContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredDishes.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">Aucun résultat.</p>
        ) : visibleDishes.map((dish, index) => {
          const likeCount = dish.likers.length;
          const dislikeCount = dish.dislikers.length;
          const total = dish.totalVotes;
          const likePercent = total > 0 ? Math.round((likeCount / total) * 100) : 0;
          const dislikePercent = total > 0 ? Math.round((dislikeCount / total) * 100) : 0;

          return (
            <m.button
              key={dish.id}
              variants={listItemVariants}
              onClick={() => setSelectedDish(dish)}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.15 }}
              className="w-full bg-white border border-gray-100 rounded-2xl p-4 hover:border-orange-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-all text-left shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold text-gray-900 text-sm">{dish.name}</span>
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
                  <div className="h-2 rounded-full bg-gray-100 flex overflow-hidden">
                    {likePercent > 0 && (
                      <m.div
                        className="h-full bg-green-400 origin-left"
                        variants={barGrowVariants}
                        custom={index * 0.03}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        style={{ width: `${likePercent}%` }}
                      />
                    )}
                    {dislikePercent > 0 && (
                      <m.div
                        className="h-full bg-red-300 ml-auto origin-right"
                        variants={barGrowVariants}
                        custom={index * 0.03 + 0.1}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        style={{ width: `${dislikePercent}%` }}
                      />
                    )}
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-xs text-green-600">👍 {likeCount} aime</span>
                    <span className="text-xs text-gray-400">{total} votes</span>
                    <span className="text-xs text-red-500">{dislikeCount} évite 👎</span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-gray-400">Aucun vote</p>
              )}
            </m.button>
          );
        })}
      </m.div>

      {filteredDishes.length > visibleCount && (
        <button
          onClick={() => setVisibleCount((n) => n + 20)}
          className="w-full mt-3 py-2.5 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl border border-orange-200 transition-colors"
        >
          Voir plus ({filteredDishes.length - visibleCount} restants)
        </button>
      )}

      {/* Modal with AnimatePresence */}
      <AnimatePresence>
        {selectedDish && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedDish(null)}
          >
            <m.div
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl"
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
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-200 to-red-300 text-red-700 text-xs font-bold flex items-center justify-center">
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
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-200 to-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-center">
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
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
