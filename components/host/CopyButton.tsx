"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text, compact }: { text: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (compact) {
    return (
      <button
        onClick={handleCopy}
        className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center gap-1.5 flex-shrink-0"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? "Copié !" : "Lien"}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className="mt-2 text-xs text-orange-600 font-medium hover:text-orange-800 transition-colors"
    >
      {copied ? "✓ Copié !" : "Copier le lien"}
    </button>
  );
}
