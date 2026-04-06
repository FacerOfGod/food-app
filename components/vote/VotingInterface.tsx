"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { submitVoteAction } from "@/actions/votes";
import { GuestDishAdder } from "./GuestDishAdder";

export const RATINGS = [
  { value: 1, label: "Éviter",     emoji: "🙅", color: "bg-red-300 text-red-900 border-red-300 hover:bg-red-400 active:bg-red-500" },
  { value: 2, label: "N'aime pas", emoji: "😕", color: "bg-red-200 text-red-800 border-red-300 hover:bg-red-300 active:bg-red-400" },
  { value: 3, label: "Neutre",     emoji: "😐", color: "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 active:bg-gray-400" },
  { value: 4, label: "J'aime",     emoji: "😋", color: "bg-green-200 text-green-800 border-green-300 hover:bg-green-300 active:bg-green-400" },
  { value: 5, label: "J'adore !",  emoji: "😍", color: "bg-green-300 text-green-900 border-green-300 hover:bg-green-400 active:bg-green-500" },
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
}

export function VotingInterface({
  sessionId,
  nextDish,
  dishes,
  userVotes,
  votedCount,
  totalDishes,
  userName,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<number | null>(null);
  const [reviewMode, setReviewMode] = useState(nextDish === null);
  // For review mode: which dish is being edited
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const voteMap = new Map(userVotes.map((v) => [v.dishId, v.rating]));
  const progress = Math.round((votedCount / totalDishes) * 100);
  const remaining = totalDishes - votedCount;

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
      if (reviewMode) setEditingDish(null);
    });
  }

  const existingDishNames = dishes.map((d) => d.name);

  const header = (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-3 overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Link href={`/host/${sessionId}`} className="text-gray-400 hover:text-gray-600 text-sm flex-shrink-0" title="Retour à la session">
            ←
          </Link>
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{userName}</span>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1 flex-shrink-0">
          <button
            onClick={() => { if (nextDish) setReviewMode(false); }}
            disabled={!nextDish}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              !reviewMode ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            } ${!nextDish ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            Vote
          </button>
          <button
            onClick={() => setReviewMode(true)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              reviewMode ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Mes choix
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:inline">
          {votedCount} / {totalDishes} notés
        </span>
        <div className="flex-shrink-0">
          <GuestDishAdder sessionId={sessionId} existingDishNames={existingDishNames} />
        </div>
      </div>
    </header>
  );

  // ── Review mode ──────────────────────────────────────────────
  if (reviewMode) {
    return (
      <main className="min-h-screen bg-[#fafaf9] flex flex-col">
        {header}

        <div className="h-1.5 bg-gray-100">
          <div
            className="h-full bg-orange-400 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

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

          <div className="space-y-2">
            {dishes.map((dish) => {
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
                      <span
                        className={`flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full border ${ratingMeta.color}`}
                      >
                        {ratingMeta.emoji} {ratingMeta.label}
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
                    <div className="flex gap-1.5 px-3 pb-3 pt-1">
                      {RATINGS.map((r) => (
                        <button
                          key={r.value}
                          onClick={() => vote(dish.id, r.value)}
                          disabled={isPending}
                          className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl border-2 transition-all text-center
                            ${rating === r.value ? "ring-2 ring-offset-1 ring-gray-400 scale-95" : ""}
                            ${r.color}
                            disabled:cursor-not-allowed`}
                        >
                          <span className="text-lg">{r.emoji}</span>
                          <span className="text-[9px] font-medium leading-tight">{r.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  // ── Voting mode ──────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#fafaf9] flex flex-col">
        {header}

      <div className="h-1.5 bg-gray-100">
        <div
          className="h-full bg-orange-400 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
            <div className="relative w-full h-52 bg-gray-100">
              {nextDish!.imageUrl ? (
                <Image
                  src={nextDish!.imageUrl}
                  alt={nextDish!.name}
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
              {(nextDish!.category || nextDish!.proposer?.name) && (
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 truncate">
                  {[nextDish!.category, nextDish!.proposer?.name ? `par ${nextDish!.proposer.name}` : ""].filter(Boolean).join(" • ")}
                </p>
              )}
              <h2 className="text-xl font-bold text-gray-900">{nextDish!.name}</h2>
            </div>
          </div>

          <div className="flex gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.value}
                onClick={() => vote(nextDish!.id, r.value)}
                disabled={isPending}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all duration-150 select-none
                  ${selected === r.value ? "scale-95 opacity-60" : ""}
                  ${r.color}
                  disabled:cursor-not-allowed`}
              >
                <span className="text-2xl">{r.emoji}</span>
                <span className="text-[10px] font-medium leading-tight text-center">{r.label}</span>
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
    </main>
  );
}
