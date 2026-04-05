"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
