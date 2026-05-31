import type { Variants } from "framer-motion";

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export const listContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] },
  },
  exit: { opacity: 0, scale: 0.94, transition: { duration: 0.15 } },
};

export const voteCardExit = {
  opacity: 0,
  y: -24,
  scale: 0.93,
  transition: { duration: 0.22, ease: "easeIn" as const },
};

export const voteCardEnter = {
  opacity: 0,
  y: 20,
  scale: 0.97,
};

export const voteCardVisible = {
  opacity: 1,
  y: 0,
  scale: 1,
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export const dotPopVariants: Variants = {
  rest: { scale: 1 },
  selected: { scale: 1.4, transition: { type: "spring", stiffness: 600, damping: 20 } },
};

export const barGrowVariants: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: (delay = 0) => ({
    scaleX: 1,
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};
