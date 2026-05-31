"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { submitVoteAction, deleteVoteAction } from "@/actions/votes";
import {
  listContainerVariants,
  listItemVariants,
  dotPopVariants,
} from "@/components/motion/variants";

const cardVariants = {
  enter: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.16, ease: "easeIn" as const } },
};
import { TOPIC_CONFIG, type TopicKey } from "@/lib/presets";
import { RATINGS } from "@/lib/ratings";

interface Dish {
  id: string;
  name: string;
  category: string | null;
  imageUrl: string | null;
  tmdbRating?: number | null;
  proposer?: { name: string | null } | null;
}

interface UserVote {
  dishId: string;
  rating: number;
}

interface Props {
  nextDish: Dish | null;
  dishes: Dish[];
  userVotes: UserVote[];
  votedCount: number;
  totalDishes: number;
  userName: string;
  viewMode: "vote" | "mes-choix";
  topic?: TopicKey;
}

export function VotingInterface({
  nextDish,
  dishes,
  userVotes,
  votedCount,
  totalDishes,
  userName,
  viewMode,
  topic = "ingredients",
}: Props) {
  const topicCfg = TOPIC_CONFIG[topic];
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [voteHistory, setVoteHistory] = useState<string[]>([]);
  const [voteError, setVoteError] = useState<string | null>(null);

  useEffect(() => {
    setVoteHistory([]);
  }, [topic]);

  const voteMap = new Map(userVotes.map((v) => [v.dishId, v.rating]));
  const progress = totalDishes > 0 ? Math.round((votedCount / totalDishes) * 100) : 0;
  const remaining = totalDishes - votedCount;

  const normalizeSearch = (str: string) =>
    str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const searchNormalized = normalizeSearch(searchQuery);
  const filteredDishes = dishes.filter(
    (d) =>
      normalizeSearch(d.name).includes(searchNormalized) ||
      (d.category && normalizeSearch(d.category).includes(searchNormalized))
  );

  async function vote(dishId: string, rating: number) {
    if (isPending) return;
    setSelected(rating);
    setVoteError(null);

    const result = await submitVoteAction({ dishId, rating });
    if (result?.error) {
      setSelected(null);
      setVoteError(result.error);
      return;
    }

    if (viewMode === "vote") setVoteHistory((h) => [...h, dishId]);

    startTransition(() => {
      router.refresh();
      setSelected(null);
      if (viewMode === "mes-choix") setEditingDish(null);
    });
  }

  async function undoVote() {
    if (voteHistory.length === 0 || isPending) return;
    const dishId = voteHistory[voteHistory.length - 1];
    setVoteHistory((h) => h.slice(0, -1));
    await deleteVoteAction(dishId);
    startTransition(() => { router.refresh(); });
  }

  return (
    <div className="flex flex-col flex-1">
      <AnimatePresence>
        {voteError && (
          <m.div
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
          >
            <span>{voteError}</span>
            <button
              type="button"
              onClick={() => setVoteError(null)}
              className="text-red-500 hover:text-red-700 font-bold text-base leading-none"
              aria-label="Fermer"
            >
              ×
            </button>
          </m.div>
        )}
      </AnimatePresence>
      {viewMode === "mes-choix" ? (
        <div className="w-full pb-4">
          <AnimatePresence>
            {nextDish === null && (
              <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="text-center mb-6"
              >
                <div className="text-4xl mb-2">🎉</div>
                <p className="font-semibold text-gray-900">Tout noté !</p>
                <p className="text-xs text-gray-500 mt-1">
                  Appuyez sur un plat pour modifier votre note.
                </p>
              </m.div>
            )}
          </AnimatePresence>

          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(20); }}
              placeholder="Rechercher un plat…"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition-all"
            />
          </div>

          <m.div
            className="space-y-2"
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredDishes.slice(0, visibleCount).map((dish) => {
              const rating = voteMap.get(dish.id) ?? null;
              const ratingMeta = rating ? RATINGS.find((r) => r.value === rating) : null;
              const isEditing = editingDish?.id === dish.id;

              return (
                <m.div
                  key={dish.id}
                  variants={listItemVariants}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setEditingDish(isEditing ? null : dish)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    {dish.imageUrl && (
                      <div className={`relative ${topic === "movies" ? "w-8 h-12" : "w-10 h-10"} rounded-lg overflow-hidden flex-shrink-0`}>
                        <Image src={dish.imageUrl} alt={dish.name} fill sizes="40px" className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{dish.name}</p>
                      {(dish.category || dish.proposer?.name) && (
                        <p className="text-[10px] text-gray-500 truncate">
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
                      <span className="flex-shrink-0 text-xs text-gray-300 italic">Non noté</span>
                    )}
                    <m.span
                      animate={{ rotate: isEditing ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-300 ml-1 flex-shrink-0"
                    >
                      <ChevronDown size={14} />
                    </m.span>
                  </button>

                  <div className={`grid transition-all duration-200 ease-out ${isEditing ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <div className="relative flex items-start border-t border-gray-100 pt-3 pb-2">
                        {RATINGS.slice(0, -1).map((_, i) => (
                          <div key={i} className="absolute h-px bg-gray-300" style={{ left: `calc(${10 + 20 * i}% + 0.375rem)`, width: "calc(20% - 0.75rem)", top: "1.875rem" }} />
                        ))}
                        {RATINGS.map((r) => (
                          <button
                            key={r.value}
                            onClick={() => vote(dish.id, r.value)}
                            disabled={isPending}
                            aria-label={`${r.label} (${r.value} sur 5)`}
                            className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 min-h-[44px] relative z-10 rounded-md disabled:cursor-not-allowed group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                          >
                            <m.span
                              variants={dotPopVariants}
                              animate={selected === r.value ? "selected" : "rest"}
                              whileHover={{ scale: 1.15 }}
                              className={`w-3 h-3 rounded-full border-2 border-white ring-1 ring-gray-300 ${r.dot}
                                ${rating === r.value ? "ring-0 scale-125" : "opacity-50 group-hover:opacity-100"}`}
                            />
                            <span className="text-[9px] font-medium text-gray-500 leading-tight text-center">{r.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </m.div>
              );
            })}
          </m.div>

          {filteredDishes.length > visibleCount && (
            <button
              onClick={() => setVisibleCount((n) => n + 20)}
              className="w-full mt-3 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-colors"
            >
              Voir plus ({filteredDishes.length - visibleCount} restants)
            </button>
          )}
        </div>
      ) : nextDish === null ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-semibold text-gray-900">Tout noté !</p>
            <p className="text-xs text-gray-500 mt-1">Passez en &quot;mes choix&quot; pour modifier vos notes.</p>
          </m.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col px-4 pb-4 overflow-hidden">
          <div className="w-full max-w-sm mx-auto flex-1 flex flex-col">
            {/* Card — grows to fill available vertical space */}
            <div className="relative flex-1 overflow-hidden rounded-3xl mb-3">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={nextDish.id}
                  variants={cardVariants}
                  initial="enter"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <div className="h-full flex flex-col rounded-3xl border border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
                    {/* Image — fills available space */}
                    <div className="relative flex-1 overflow-hidden bg-gray-100">
                      <AnimatePresence>
                        {voteHistory.length > 0 && (
                          <m.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            onClick={undoVote}
                            disabled={isPending}
                            className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors disabled:opacity-40"
                          >
                            ↩ Annuler
                          </m.button>
                        )}
                      </AnimatePresence>
                      {nextDish.imageUrl ? (
                        <>
                          {(topic === "movies" || topic === "ingredients" || topic === "activities") && (
                            <Image
                              src={nextDish.imageUrl}
                              alt=""
                              fill
                              sizes="(max-width: 640px) 100vw, 384px"
                              className="object-cover scale-125 blur-2xl opacity-70"
                              aria-hidden
                            />
                          )}
                          <Image
                            src={nextDish.imageUrl}
                            alt={nextDish.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 384px"
                            className={(topic === "movies" || topic === "ingredients" || topic === "activities") ? "object-contain" : "object-cover"}
                            priority
                          />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-5xl">{topicCfg.emoji}</div>
                      )}
                      {nextDish.tmdbRating != null && (
                        <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-bold">
                          <span className="text-yellow-400">★</span>
                          {nextDish.tmdbRating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    {/* Description */}
                    <div className="px-5 py-4 text-center">
                      {(nextDish.category || nextDish.proposer?.name) && (
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 truncate">
                          {[nextDish.category, nextDish.proposer?.name ? `par ${nextDish.proposer.name}` : ""].filter(Boolean).join(" • ")}
                        </p>
                      )}
                      <h2 className="text-xl font-bold text-gray-900">{nextDish.name}</h2>
                    </div>
                  </div>
                </m.div>
              </AnimatePresence>
            </div>

            {/* Rating bar — outside AnimatePresence so it never disappears */}
            <div className="relative flex items-start w-full pt-2 pb-1">
              {RATINGS.slice(0, -1).map((_, i) => (
                <div key={i} className="absolute h-px bg-gray-300" style={{ left: `calc(${10 + 20 * i}% + 0.625rem)`, width: "calc(20% - 1.25rem)", top: "1.875rem" }} />
              ))}
              {RATINGS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => vote(nextDish.id, r.value)}
                  disabled={isPending}
                  aria-label={`${r.label} (${r.value} sur 5)`}
                  className="flex-1 flex flex-col items-center justify-center gap-2 py-3 min-h-[44px] relative z-10 rounded-md disabled:cursor-not-allowed group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                >
                  <m.span
                    variants={dotPopVariants}
                    animate={selected === r.value ? "selected" : "rest"}
                    whileHover={{ scale: 1.15 }}
                    className={`w-5 h-5 rounded-full border-2 border-white ring-1 ring-gray-300 ${r.dot}
                      ${selected === r.value ? "ring-0" : "opacity-50 group-hover:opacity-100"}`}
                  />
                  <span className="text-[9px] font-medium text-gray-500 leading-tight text-center">{r.label}</span>
                </button>
              ))}
            </div>

            {/* Progress */}
            <div className="text-center mt-2 space-y-1.5">
              <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                <m.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <p className="text-sm font-medium text-indigo-600">
                {remaining} {remaining > 1 ? topicCfg.itemLabelPlural : topicCfg.itemLabel} restant{remaining > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-gray-500">
                {votedCount} / {totalDishes} notés
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
