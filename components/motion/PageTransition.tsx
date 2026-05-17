"use client";

import { m } from "framer-motion";
import { fadeUpVariants } from "./variants";

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <m.div
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      className={className}
    >
      {children}
    </m.div>
  );
}
