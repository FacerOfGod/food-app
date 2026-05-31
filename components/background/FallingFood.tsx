"use client";
import { useEffect, useState } from "react";

const EMOJIS = [
  "🍕", "🍔", "🥗", "🍣", "🌮", "🍦", "🍩",
  "🥐", "🍎", "🥑", "🍇", "🍉", "🧀", "🥨", "🍜",
];

interface Icon {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  drift: number;
}

export function FallingFood() {
  const [icons, setIcons] = useState<Icon[]>([]);

  useEffect(() => {
    setIcons(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        emoji: EMOJIS[i % EMOJIS.length],
        left: (i * 4.7 + Math.random() * 4) % 100,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 10,
        size: 1.2 + Math.random() * 1.4,
        opacity: 0.18 + Math.random() * 0.14,
        drift: (Math.random() - 0.5) * 60,
      }))
    );
  }, []);

  if (icons.length === 0) return null;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {icons.map((icon) => (
        <span
          key={icon.id}
          className="absolute select-none will-change-transform"
          style={{
            left: `${icon.left}%`,
            top: `-${icon.size * 2}rem`,
            fontSize: `${icon.size}rem`,
            opacity: icon.opacity,
            animation: `falling-food ${icon.duration}s ${icon.delay}s linear infinite`,
            "--drift": `${icon.drift}px`,
          } as React.CSSProperties}
        >
          {icon.emoji}
        </span>
      ))}
    </div>
  );
}
