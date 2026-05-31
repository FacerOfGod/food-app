"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { m } from "framer-motion";
import { Utensils, Clapperboard, Compass, type LucideIcon } from "lucide-react";
import { TOPICS } from "@/lib/presets";

const TOPIC_ICONS: Record<string, LucideIcon> = {
  ingredients: Utensils,
  movies: Clapperboard,
  activities: Compass,
};

interface Props {
  currentTopic: string;
}

export function TopicTabBar({ currentTopic }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function hrefFor(topicKey: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("topic", topicKey);
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="flex justify-center gap-2 mb-5 border-b border-gray-100 pb-4">
      {TOPICS.map((t) => {
        const isActive = currentTopic === t.key;
        return (
          <Link key={t.key} href={hrefFor(t.key)} className="relative">
            <m.span
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-indigo-500 text-white shadow-[0_2px_8px_rgba(99, 102, 241,0.3)]"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              }`}
              whileTap={{ scale: 0.94 }}
            >
              {(() => { const Icon = TOPIC_ICONS[t.key]; return Icon ? <Icon size={13} /> : null; })()}
              <span>{t.label}</span>
            </m.span>
          </Link>
        );
      })}
    </div>
  );
}
