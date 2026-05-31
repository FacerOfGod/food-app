"use client";

import { m } from "framer-motion";

interface BobLogoProps {
  size?: number;
  className?: string;
  compact?: boolean;
}

export function BobLogo({ size = 96, className = "", compact = false }: BobLogoProps) {
  const blur = compact ? 3 : 5;
  const matrix = compact ? "20 -10" : "20 -9";

  return (
    <m.svg
      viewBox="0 0 320 120"
      height={size}
      width={(size * 320) / 120}
      role="img"
      aria-label="Bob"
      className={`bob-logo ${compact ? "bob-logo--compact" : ""} ${className}`}
      style={{ overflow: "visible", display: "block" }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: [0.9, 1.02, 1],
      }}
      transition={{
        opacity: { duration: 0.5 },
        scale: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
      }}
    >
      <defs>
        <filter id={`bob-goo-${compact ? "c" : "h"}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${matrix}`}
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>

        <linearGradient id={`bob-gradient-${compact ? "c" : "h"}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="45%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        <linearGradient id={`bob-drop-${compact ? "c" : "h"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      <g filter={`url(#bob-goo-${compact ? "c" : "h"})`}>
        <m.circle
          cx={36}
          cy={60}
          r={compact ? 9 : 11}
          fill={`url(#bob-drop-${compact ? "c" : "h"})`}
          animate={{
            cx: [36, 60, 36, 24, 36],
            cy: [60, 32, 60, 92, 60],
            r: compact ? [9, 8, 10, 8, 9] : [11, 9, 12, 10, 11],
          }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <m.circle
          cx={284}
          cy={60}
          r={compact ? 10 : 12}
          fill={`url(#bob-drop-${compact ? "c" : "h"})`}
          animate={{
            cx: [284, 262, 284, 300, 284],
            cy: [60, 92, 60, 28, 60],
            r: compact ? [10, 8, 11, 8, 10] : [12, 10, 13, 9, 12],
          }}
          transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {!compact && (
          <>
            <m.circle
              cx={160}
              cy={18}
              r={8}
              fill={`url(#bob-drop-h)`}
              animate={{
                cx: [160, 172, 160, 148, 160],
                cy: [18, 60, 102, 60, 18],
                r: [8, 7, 9, 7, 8],
              }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <m.circle
              cx={210}
              cy={100}
              r={7}
              fill={`url(#bob-drop-h)`}
              animate={{
                cx: [210, 198, 210, 222, 210],
                cy: [100, 60, 20, 60, 100],
                r: [7, 9, 6, 8, 7],
              }}
              transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
          </>
        )}

        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={108}
          fontWeight={900}
          fontFamily="var(--font-geist-sans), system-ui, -apple-system, sans-serif"
          fill={`url(#bob-gradient-${compact ? "c" : "h"})`}
          letterSpacing={-6}
        >
          Bob
        </text>
      </g>
    </m.svg>
  );
}
