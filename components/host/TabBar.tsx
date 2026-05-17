"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { m } from "framer-motion";

interface Props {
  sessionId: string;
}

const TABS = [
  { key: "people", label: "Par personne" },
  { key: "dishes", label: "Par thème" },
];

export function TabBar({ sessionId }: Props) {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const activeView = view === "dishes" ? "dishes" : "people";

  return (
    <div className="sticky top-0 z-30 backdrop-blur-md bg-white/90 border-b border-gray-200/60 py-3">
      <div className="max-w-3xl mx-auto px-4">
        <div className="relative flex bg-gray-100/80 backdrop-blur-sm rounded-lg p-1 w-full">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={`/host/${sessionId}?view=${tab.key}`}
              className={`relative z-10 flex-1 text-center px-1 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 ${
                tab.key === activeView
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.key === activeView && (
                <m.span
                  layoutId="host-tab-pill"
                  className="absolute inset-0 rounded-md shadow-sm bg-white"
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
