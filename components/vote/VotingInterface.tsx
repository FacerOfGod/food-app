"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { submitVoteAction } from "@/actions/votes";

export const RATINGS = [
  { value: 1, label: "Éviter",     dot: "bg-red-800",     ring: "ring-red-800"     },
  { value: 2, label: "N'aime pas", dot: "bg-red-400",     ring: "ring-red-400"     },
  { value: 3, label: "Neutre",     dot: "bg-gray-400",    ring: "ring-gray-400"    },
  { value: 4, label: "J'aime",     dot: "bg-emerald-600", ring: "ring-emerald-600" },
  { value: 5, label: "J'adore",    dot: "bg-emerald-900", ring: "ring-emerald-900" },
];

interface Dish {
  id: string;
  name: string;
  category: string | null;
  imageUrl: string | null;
  proposer?: { name: string | null } | null;
}

interface UserVote {
  dishId: string;
  rating: number;
}

interface Props {
  sessionId: string;
  nextDish: Dish | null;
  dishes: Dish[];
  userVotes: UserVote[];
  votedCount: number;
  totalDishes: number;
  userName: string;
  viewMode: "vote" | "mes-choix";
}

export function VotingInterface({
  sessionId,
  nextDish,
  dishes,
  userVotes,
  votedCount,
  totalDishes,
  userName,
  viewMode,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // For review mode: which dish is being edited
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);

  const voteMap = new Map(userVotes.map((v) => [v.dishId, v.rating]));
  const progress = Math.round((votedCount / totalDishes) * 100);
  const remaining = totalDishes - votedCount;

  const normalizeSearch = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const searchNormalized = normalizeSearch(searchQuery);
  const filteredDishes = dishes.filter(d =>
    normalizeSearch(d.name).includes(searchNormalized) ||
    (d.category && normalizeSearch(d.category).includes(searchNormalized))
  );

  async function vote(dishId: string, rating: number) {
    if (isPending) return;
    setSelected(rating);

    const formData = new FormData();
    formData.set("sessionId", sessionId);
    formData.set("dishId", dishId);
    formData.set("rating", rating.toString());

    const result = await submitVoteAction(formData);
    if (result?.error) { setSelected(null); return; }

    startTransition(() => {
      router.refresh();
      setSelected(null);
      if (viewMode === "mes-choix") setEditingDish(null);
    });
  }

  const existingDishNames = dishes.map((d) => d.name);

  return (
    <div className="flex flex-col flex-1">


      {viewMode === "mes-choix" ? (
        <div className="max-w-lg mx-auto w-full px-4 py-6">
          {nextDish === null && (
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🎉</div>
              <p className="font-semibold text-gray-900">Tout noté !</p>
              <p className="text-xs text-gray-400 mt-1">
                Appuyez sur un plat pour modifier votre note.
              </p>
            </div>
          )}

          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(20); }}
              placeholder="Rechercher un plat…"
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="space-y-2">
            {filteredDishes.slice(0, visibleCount).map((dish) => {
              const rating = voteMap.get(dish.id) ?? null;
              const ratingMeta = rating ? RATINGS.find((r) => r.value === rating) : null;
              const isEditing = editingDish?.id === dish.id;

              return (
                <div
                  key={dish.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  {/* Dish row */}
                  <button
                    onClick={() =>
                      setEditingDish(isEditing ? null : dish)
                    }
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    {dish.imageUrl && (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={dish.imageUrl}
                          alt={dish.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {dish.name}
                      </p>
                      {(dish.category || dish.proposer?.name) && (
                        <p className="text-[10px] text-gray-400 truncate">
                          {[dish.category, dish.proposer?.name ? `par ${dish.proposer.name}` : ""].filter(Boolean).join(" • ")}
                        </p>
                      )}
                    </div>
                    {ratingMeta ? (
                      <span className="flex-shrink-0 flex items-center gap-1.5 text-xs text-gray-600">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ratingMeta.dot}`} />
                        {ratingMeta.label}
                      </span>
                    ) : (
                      <span className="flex-shrink-0 text-xs text-gray-300 italic">
                        Non noté
                      </span>
                    )}
                    <span className="text-gray-300 text-xs ml-1">
                      {isEditing ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Inline rating picker */}
                  {isEditing && (
                    <div className="relative flex items-start border-t border-gray-100 px-2 pt-3 pb-2">
                      <div className="absolute left-[calc(10%)] right-[calc(10%)] top-[1.65rem] h-px bg-gray-300" />
                      {RATINGS.map((r) => (
                        <button
                          key={r.value}
                          onClick={() => vote(dish.id, r.value)}
                          disabled={isPending}
                          className="flex-1 flex flex-col items-center gap-1.5 relative disabled:cursor-not-allowed group"
                        >
                          <span className={`w-3 h-3 rounded-full border-2 border-white ring-1 ring-gray-300 transition-all ${r.dot}
                            ${rating === r.value ? "scale-125 ring-0" : "opacity-50 group-hover:opacity-100"}`}
                          />
                          <span className="text-[9px] font-medium text-gray-500 leading-tight text-center">{r.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
        </div>
      ) : nextDish === null ? (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 text-center">
        <div className="text-4xl mb-2">🎉</div>
        <p className="font-semibold text-gray-900">Tout noté !</p>
        <p className="text-xs text-gray-400 mt-1">Passez en "mes choix" pour modifier vos notes.</p>
      </div>
      ) : (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
            <div className="relative w-full h-52 bg-gray-100">
              {nextDish.imageUrl ? (
                <Image
                  src={nextDish.imageUrl}
                  alt={nextDish.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 384px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-5xl">
                  🍴
                </div>
              )}
            </div>
            <div className="px-5 py-4 text-center">
              {(nextDish.category || nextDish.proposer?.name) && (
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 truncate">
                  {[nextDish.category, nextDish.proposer?.name ? `par ${nextDish.proposer.name}` : ""].filter(Boolean).join(" • ")}
                </p>
              )}
              <h2 className="text-xl font-bold text-gray-900">{nextDish.name}</h2>
            </div>
          </div>

          <div className="relative flex items-start w-full px-2 pt-2 pb-1">
            {/* horizontal connecting line */}
            <div className="absolute left-[calc(10%)] right-[calc(10%)] top-[1.15rem] h-px bg-gray-300" />
            {RATINGS.map((r) => (
              <button
                key={r.value}
                onClick={() => vote(nextDish.id, r.value)}
                disabled={isPending}
                className="flex-1 flex flex-col items-center gap-2 relative disabled:cursor-not-allowed group"
              >
                <span className={`w-4 h-4 rounded-full border-2 border-white ring-1 ring-gray-300 transition-all ${r.dot}
                  ${selected === r.value ? "scale-125 ring-0" : "opacity-50 group-hover:opacity-100"}`}
                />
                <span className="text-[9px] font-medium text-gray-500 leading-tight text-center">{r.label}</span>
              </button>
            ))}
          </div>

          <div className="text-center mt-6 space-y-1">
            <p className="text-sm font-medium text-orange-600">
              {remaining} plat{remaining > 1 ? "s" : ""} restant{remaining > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-gray-400">
              {votedCount} / {totalDishes} notés
            </p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
