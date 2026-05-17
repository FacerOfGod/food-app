"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { m } from "framer-motion";
import { TOPICS } from "@/lib/presets";

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
    <div className="flex gap-2 mb-5 border-b border-gray-100 pb-4">
      {TOPICS.map((t) => {
        const isActive = currentTopic === t.key;
        return (
          <Link key={t.key} href={hrefFor(t.key)} className="relative">
            <m.span
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-orange-500 text-white shadow-[0_2px_8px_rgba(232,93,4,0.3)]"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              }`}
              whileTap={{ scale: 0.94 }}
            >
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </m.span>
          </Link>
        );
      })}
    </div>
  );
}
