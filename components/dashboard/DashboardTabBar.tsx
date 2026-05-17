"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { m } from "framer-motion";

interface Tab {
  key: string;
  label: string;
  accent?: boolean;
}

const TABS: Tab[] = [
  { key: "sessions", label: "Mes groupes" },
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

  const activeTab = TABS.find((t) => t.key === activeView);

  return (
    <div className="sticky top-0 z-30 backdrop-blur-md bg-white/90 border-b border-gray-200/60 py-3">
      <div className="max-w-2xl mx-auto px-4">
        <div className="relative flex bg-gray-100/80 backdrop-blur-sm rounded-lg p-1 w-full">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={hrefFor(tab.key)}
              className={`relative z-10 flex-1 text-center px-1 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 ${
                tab.accent ? "ml-2" : ""
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
              {tab.key === activeView && (
                <m.span
                  layoutId="dashboard-tab-pill"
                  className={`absolute inset-0 rounded-md shadow-sm ${
                    activeTab?.accent
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-[0_1px_6px_rgba(232,93,4,0.4)]"
                      : "bg-white"
                  }`}
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
