"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

export function CopyButton({ text, compact }: { text: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (compact) {
    return (
      <m.button
        onClick={handleCopy}
        whileTap={{ scale: 0.93 }}
        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-gray-800 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] transition-all flex items-center gap-1.5 flex-shrink-0 shadow-sm"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <m.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
              <Check size={12} className="text-green-500" />
            </m.span>
          ) : (
            <m.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
              <Copy size={12} />
            </m.span>
          )}
        </AnimatePresence>
        {copied ? "Copié !" : "Lien"}
      </m.button>
    );
  }

  return (
    <m.button
      onClick={handleCopy}
      whileTap={{ scale: 0.97 }}
      className="mt-2 text-xs text-orange-600 font-medium hover:text-orange-800 transition-colors"
    >
      {copied ? "✓ Copié !" : "Copier le lien"}
    </m.button>
  );
}
