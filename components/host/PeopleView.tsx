"use client";

import { useState } from "react";

const RATING_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Éviter", color: "bg-red-100 text-red-700" },
  2: { label: "N'aime pas", color: "bg-orange-100 text-orange-700" },
  3: { label: "Neutre", color: "bg-gray-100 text-gray-600" },
  4: { label: "J'aime", color: "bg-lime-100 text-lime-700" },
  5: { label: "J'adore", color: "bg-green-100 text-green-700" },
};

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
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredDishes = dishes.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un plat…"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
        />
      </div>

      {members.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-8">
          Aucun membre pour l&apos;instant.
        </p>
      )}

      <div className="space-y-3">
        {members.map((m) => {
          const voteMap = new Map(m.user.votes.map((v) => [v.dish.id, v.rating]));
          const isExpanded = expanded === m.id;

          return (
            <div
              key={m.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : m.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
                    {(m.user.name ?? "?")[0].toUpperCase()}
                  </div>
                  <span className="font-medium text-sm text-gray-900">
                    {m.user.name ?? "Anonyme"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {m.user.votes.length} / {dishes.length} notés
                  </span>
                  <span className="text-gray-300 text-sm">{isExpanded ? "▲" : "▼"}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 px-4 py-3">
                  {filteredDishes.length === 0 ? (
                    <p className="text-xs text-gray-400">Aucun plat trouvé.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {filteredDishes.map((dish) => {
                        const rating = voteMap.get(dish.id);
                        const meta = rating ? RATING_LABELS[rating] : null;
                        return (
                          <div
                            key={dish.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-700">{dish.name}</span>
                            {meta ? (
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.color}`}
                              >
                                {meta.label}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-300">—</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
