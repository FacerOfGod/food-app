"use client";

import { useState, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown, Users } from "lucide-react";
import { RATINGS } from "@/lib/ratings";

interface Vote {
  rating: number;
  dish: { id: string; name: string; category: string | null };
}

interface Member {
  id: string;
  user: {
    id: string;
    name: string | null;
    votes: Vote[];
  };
}

interface Dish {
  id: string;
  name: string;
  category: string | null;
}

interface Props {
  members: Member[];
  dishes: Dish[];
}

export function PeopleView({ members, dishes }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedDishes, setExpandedDishes] = useState<Set<string>>(new Set());

  const toggleDish = (id: string) => {
    const next = new Set(expandedDishes);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedDishes(next);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === members.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(members.map((m) => m.id)));
  };

  const voteMatrix = useMemo(() => {
    const matrix = new Map<string, Map<string, number>>();
    dishes.forEach((d) => matrix.set(d.id, new Map()));
    members.forEach((m) => {
      m.user.votes.forEach((v) => {
        const dishVotes = matrix.get(v.dish.id);
        if (dishVotes) dishVotes.set(m.id, v.rating);
      });
    });
    return matrix;
  }, [members, dishes]);

  const rankedDishes = useMemo(() => {
    if (selectedIds.size === 0) return [];

    const results = dishes.map((dish) => {
      const dishVotes = voteMatrix.get(dish.id)!;
      let sum = 0, count = 0, minRating = 5;
      const individualVotes: { memberId: string; rating: number | null }[] = [];

      selectedIds.forEach((mId) => {
        const rating = dishVotes.get(mId);
        if (rating !== undefined) {
          sum += rating; count++;
          if (rating < minRating) minRating = rating;
          individualVotes.push({ memberId: mId, rating });
        } else {
          individualVotes.push({ memberId: mId, rating: null });
        }
      });

      const avgRating = count > 0 ? sum / count : 0;
      if (count === 0) minRating = 0;

      return { ...dish, avgRating, minRating, count, individualVotes };
    });

    results.sort((a, b) => {
      if (b.minRating !== a.minRating) return b.minRating - a.minRating;
      if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
      return b.count - a.count;
    });

    return results;
  }, [dishes, voteMatrix, selectedIds]);

  return (
    <div className="flex flex-col gap-6">
      {/* Selector */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Qui participe ?</h2>
          <button
            onClick={toggleAll}
            className="text-xs text-emerald-500 font-medium hover:text-emerald-700 transition-colors"
          >
            {selectedIds.size === members.length ? "Tout désélectionner" : "Tous sélectionner"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {members.map((member) => {
            const isSelected = selectedIds.has(member.id);
            return (
              <m.button
                key={member.id}
                onClick={() => toggleSelect(member.id)}
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.03 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isSelected
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isSelected ? "bg-white/20" : "bg-gray-200 text-gray-500"
                }`}>
                  {(member.user.name ?? "?")[0].toUpperCase()}
                </div>
                {member.user.name ?? "Anonyme"}
              </m.button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {selectedIds.size === 0 ? (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center py-10 opacity-60"
        >
          <Users size={36} strokeWidth={1.5} className="mx-auto mb-3 text-gray-500" />
          <p className="text-sm font-medium text-gray-900">Sélectionnez au moins une personne</p>
          <p className="text-xs text-gray-500">Pour trouver les plats qui correspondent à tout le monde.</p>
        </m.div>
      ) : (
        <div className="space-y-3">
          {rankedDishes.map((dish, i) => {
            let headerColor = "bg-white border-gray-100";
            let rankGradient = "from-gray-400 to-gray-500";

            if (dish.count > 0 && dish.minRating >= 4) {
              headerColor = "bg-green-50 border-green-200";
              rankGradient = "from-green-400 to-emerald-500";
            } else if (dish.count > 0 && dish.minRating <= 2) {
              headerColor = "bg-red-50 border-red-200";
              rankGradient = "from-red-400 to-red-500";
            } else if (dish.count > 0) {
              headerColor = "bg-white border-gray-100";
              rankGradient = "from-emerald-400 to-emerald-500";
            }

            const isExpanded = expandedDishes.has(dish.id);

            return (
              <m.div
                key={dish.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.4) }}
                className={`rounded-2xl border ${headerColor} overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]`}
              >
                <button
                  onClick={() => toggleDish(dish.id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <div className="flex gap-3 items-center">
                    <m.span
                      initial={{ scale: 0, rotate: -12 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20, delay: i * 0.04 }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${rankGradient} shadow-sm`}
                    >
                      #{i + 1}
                    </m.span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{dish.name}</p>
                      {dish.category && (
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{dish.category}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {dish.avgRating > 0 ? dish.avgRating.toFixed(1) : "—"}{" "}
                        <span className="text-xs font-normal text-gray-500">/ 5</span>
                      </p>
                      <p className="text-[10px] text-gray-500">{dish.count} vote{dish.count !== 1 ? "s" : ""}</p>
                    </div>
                    <m.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-500"
                    >
                      <ChevronDown size={14} />
                    </m.span>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-white/50 space-y-2 border-t border-gray-100/50">
                        {dish.individualVotes.map((iv) => {
                          const member = members.find((x) => x.id === iv.memberId)!;
                          const ratingMeta = iv.rating ? RATINGS.find((r) => r.value === iv.rating) : null;

                          return (
                            <div key={iv.memberId} className="flex items-center justify-between text-xs">
                              <span className="text-gray-700 font-medium">{member.user.name ?? "Anonyme"}</span>
                              {ratingMeta ? (
                                <span className={`px-2 py-0.5 rounded-full font-medium ${ratingMeta.badge}`}>
                                  {ratingMeta.emoji} {ratingMeta.label}
                                </span>
                              ) : (
                                <span className="text-gray-300 italic px-2">Pas voté</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
