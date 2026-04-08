"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";

interface Tab {
  key: string;
  label: string;
  accent?: boolean;
}

const TABS: Tab[] = [
  { key: "sessions", label: "Mes sessions" },
  { key: "mes-choix", label: "Mes choix" },
  { key: "proposer", label: "Proposer" },
  { key: "vote", label: "Voter", accent: true },
];

export function DashboardTabBar() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "sessions";

  const activeView = TABS.some((t) => t.key === view) ? view : "sessions";

  function hrefFor(key: string) {
    if (key === "sessions") return "/dashboard";
    return `/dashboard?view=${key}`;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const activeIndex = TABS.findIndex((t) => t.key === activeView);
    const el = tabRefs.current[activeIndex];
    const container = containerRef.current;
    if (!el || !container) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPill({ left: elRect.left - containerRect.left, width: elRect.width });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView]);

  const activeTab = TABS.find((t) => t.key === activeView);

  return (
    <div className="bg-white border-b border-gray-200 py-3">
      <div className="max-w-2xl mx-auto px-4">
        <div ref={containerRef} className="relative flex bg-gray-100 rounded-lg p-1 w-full">
          {pill && (
            <span
              className={`absolute top-1 bottom-1 rounded-md shadow-sm transition-all duration-200 ease-out ${
                activeTab?.accent ? "bg-orange-500" : "bg-white"
              }`}
              style={{ left: pill.left, width: pill.width }}
            />
          )}

          {TABS.map((tab, i) => (
            <Link
              key={tab.key}
              href={hrefFor(tab.key)}
              ref={(el) => { tabRefs.current[i] = el; }}
              className={`relative z-10 flex-1 text-center px-1 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                tab.accent ? "ml-2 ring-1 ring-orange-500" : ""
              } ${
                tab.key === activeView
                  ? tab.accent
                    ? "text-white"
                    : "text-gray-900"
                  : tab.accent
                    ? "text-orange-500 hover:text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
