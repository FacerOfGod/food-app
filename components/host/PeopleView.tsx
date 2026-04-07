"use client";

import { useState, useMemo } from "react";

const RATINGS = [
  { value: 1, label: "Éviter",     emoji: "🙅", color: "bg-red-100 text-red-800" },
  { value: 2, label: "N'aime pas", emoji: "😕", color: "bg-orange-100 text-orange-800" },
  { value: 3, label: "Neutre",     emoji: "😐", color: "bg-gray-100 text-gray-700" },
  { value: 4, label: "J'aime",     emoji: "😋", color: "bg-green-100 text-green-800" },
  { value: 5, label: "J'adore !",  emoji: "😍", color: "bg-green-200 text-green-900" },
];

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
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedDishes(next);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
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
      let sum = 0;
      let count = 0;
      let minRating = 5;
      const individualVotes: { memberId: string; rating: number | null }[] = [];

      selectedIds.forEach((mId) => {
        const rating = dishVotes.get(mId);
        if (rating !== undefined) {
          sum += rating;
          count++;
          if (rating < minRating) minRating = rating;
          individualVotes.push({ memberId: mId, rating });
        } else {
          individualVotes.push({ memberId: mId, rating: null });
        }
      });

      const avgRating = count > 0 ? sum / count : 0;
      if (count === 0) minRating = 0; // Drop unvoted to the bottom

      return {
        ...dish,
        avgRating,
        minRating,
        count,
        individualVotes,
      };
    });

    results.sort((a, b) => {
      // 1. the dish without haters comes first (minRating desc)
      if (b.minRating !== a.minRating) return b.minRating - a.minRating;
      // 2. then highest average
      if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
      // 3. then most votes cast among selected
      return b.count - a.count;
    });

    return results;
  }, [dishes, voteMatrix, selectedIds]);

  return (
    <div className="flex flex-col gap-6">
      {/* Selector */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Qui participe ?</h2>
          <button
            onClick={toggleAll}
            className="text-xs text-orange-500 font-medium hover:text-orange-700"
          >
            {selectedIds.size === members.length
              ? "Tout désélectionner"
              : "Tous sélectionner"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => {
            const isSelected = selectedIds.has(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleSelect(m.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isSelected
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isSelected ? "bg-white/20" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {(m.user.name ?? "?")[0].toUpperCase()}
                </div>
                {m.user.name ?? "Anonyme"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {selectedIds.size === 0 ? (
        <div className="text-center py-10 opacity-60">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-sm font-medium text-gray-900">
            Sélectionnez au moins une personne
          </p>
          <p className="text-xs text-gray-500">
            Pour trouver les plats qui correspondent à tout le monde.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rankedDishes.map((dish, i) => {
            let headerColor = "bg-white border-gray-200";
            let rankColor = "bg-gray-100 text-gray-500";

            if (dish.count > 0 && dish.minRating >= 4) {
              // Unanimously loved
              headerColor = "bg-green-50 border-green-200";
              rankColor = "bg-green-500 text-white";
            } else if (dish.count > 0 && dish.minRating <= 2) {
              // Has active haters
              headerColor = "bg-red-50 border-red-200";
              rankColor = "bg-red-400 text-white";
            } else if (dish.count > 0) {
              // Mixed or neutral
              headerColor = "bg-white border-gray-200";
              rankColor = "bg-orange-400 text-white";
            }

            return (
              <div
                key={dish.id}
                className={`rounded-xl border ${headerColor} overflow-hidden shadow-sm`}
              >
                <button
                  onClick={() => toggleDish(dish.id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <div className="flex gap-3 items-center">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rankColor}`}
                    >
                      #{i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {dish.name}
                      </p>
                      {dish.category && (
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                          {dish.category}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {dish.avgRating > 0 ? dish.avgRating.toFixed(1) : "—"}{" "}
                        <span className="text-xs font-normal text-gray-400">
                          / 5
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {dish.count} vote{dish.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className={`text-gray-400 text-xs transition-transform ${expandedDishes.has(dish.id) ? "rotate-180" : ""}`}>▼</span>
                  </div>
                </button>

                {expandedDishes.has(dish.id) && (
                <div className="px-4 py-3 bg-white/50 space-y-2 border-t border-gray-100/50">
                  {dish.individualVotes.map((iv) => {
                    const m = members.find((x) => x.id === iv.memberId)!;
                    const ratingMeta = iv.rating
                      ? RATINGS.find((r) => r.value === iv.rating)
                      : null;

                    return (
                      <div
                        key={iv.memberId}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 font-medium">
                            {m.user.name ?? "Anonyme"}
                          </span>
                        </div>
                        {ratingMeta ? (
                          <span
                            className={`px-2 py-0.5 rounded-full font-medium ${ratingMeta.color}`}
                          >
                            {ratingMeta.emoji} {ratingMeta.label}
                          </span>
                        ) : (
                          <span className="text-gray-300 italic px-2">
                            Pas voté
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
