"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import {
  Lock,
  Loader2,
  UtensilsCrossed,
  Film,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";
import { TOPIC_CONFIG, type TopicKey } from "@/lib/presets";
import {
  setSessionAllowedTopicsAction,
  setMemberSharedTopicsAction,
} from "@/actions/sessions";

const TOPIC_ORDER: TopicKey[] = ["ingredients", "movies", "activities"];

const TOPIC_ICONS: Record<TopicKey, LucideIcon> = {
  ingredients: UtensilsCrossed,
  movies: Film,
  activities: PartyPopper,
};

export interface PartageSession {
  id: string;
  name: string;
  role: "host" | "member";
  allowedTopics: TopicKey[];
  sharedTopics: TopicKey[];
}

interface Props {
  session: PartageSession;
}

export function PartageView({ session }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggleAllowed = (topic: TopicKey) => {
    if (session.role !== "host" || isPending) return;
    const next = session.allowedTopics.includes(topic)
      ? session.allowedTopics.filter((t) => t !== topic)
      : [...session.allowedTopics, topic];
    if (next.length === 0) {
      setError("Au moins un thème doit rester actif.");
      setTimeout(() => setError(null), 2500);
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await setSessionAllowedTopicsAction(session.id, next);
      if (res?.error) {
        setError(res.error);
        setTimeout(() => setError(null), 2500);
      }
      router.refresh();
    });
  };

  const toggleShared = (topic: TopicKey) => {
    if (isPending) return;
    if (!session.allowedTopics.includes(topic)) return;
    const next = session.sharedTopics.includes(topic)
      ? session.sharedTopics.filter((t) => t !== topic)
      : [...session.sharedTopics, topic];
    setError(null);
    startTransition(async () => {
      const res = await setMemberSharedTopicsAction(session.id, next);
      if (res?.error) {
        setError(res.error);
        setTimeout(() => setError(null), 2500);
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-5">
      {error && (
        <m.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700"
        >
          {error}
        </m.div>
      )}

      {session.role === "host" && (
        <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-baseline justify-between mb-1">
            <h2 className="text-sm font-bold text-gray-900">Thèmes du groupe</h2>
            {isPending && <Loader2 size={12} className="text-gray-500 animate-spin" />}
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Choisis ce que les membres peuvent partager dans ce groupe.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TOPIC_ORDER.map((topic) => {
              const cfg = TOPIC_CONFIG[topic];
              const Icon = TOPIC_ICONS[topic];
              const active = session.allowedTopics.includes(topic);
              return (
                <m.button
                  key={topic}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toggleAllowed(topic)}
                  disabled={isPending}
                  className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all ${
                    active
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                >
                  <Icon size={22} strokeWidth={1.75} />
                  <span className="text-xs font-medium">{cfg.label}</span>
                </m.button>
              );
            })}
          </div>
        </section>
      )}

      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-sm font-bold text-gray-900">Ce que je partage</h2>
          {isPending && session.role === "member" && (
            <Loader2 size={12} className="text-gray-500 animate-spin" />
          )}
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Tes votes pour ces thèmes seront visibles dans ce groupe.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {TOPIC_ORDER.map((topic) => {
            const cfg = TOPIC_CONFIG[topic];
            const Icon = TOPIC_ICONS[topic];
            const allowed = session.allowedTopics.includes(topic);
            const shared = session.sharedTopics.includes(topic);
            return (
              <m.button
                key={topic}
                whileTap={{ scale: allowed ? 0.96 : 1 }}
                onClick={() => toggleShared(topic)}
                disabled={!allowed || isPending}
                className={`relative flex flex-col items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all ${
                  !allowed
                    ? "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed"
                    : shared
                      ? "bg-green-50 border-green-300 text-green-900"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                }`}
              >
                {!allowed && (
                  <Lock size={10} className="absolute top-1.5 right-1.5 text-gray-300" />
                )}
                <Icon size={22} strokeWidth={1.75} />
                <span className="text-xs font-medium">{cfg.label}</span>
              </m.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
