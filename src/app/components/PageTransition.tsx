"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "./ui/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Persist last index across component remounts (navigation)
let globalLastIndex: number | null = null;

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();
  const [direction, setDirection] = React.useState<number>(1);

  React.useEffect(() => {
    const currentIndex = typeof window !== "undefined" ? window.history.state?.idx ?? 0 : 0;

    if (globalLastIndex !== null) {
      const delta = currentIndex - globalLastIndex;
      if (delta !== 0) {
        setDirection(delta > 0 ? 1 : -1);
      }
    }

    globalLastIndex = currentIndex;
  }, [pathname]);

  const variants = {
    initial: (dir: number) => ({ opacity: 0, x: dir * 80 }),
    enter: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] } },
    exit: (dir: number) => ({ opacity: 0, x: -dir * 80, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }),
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={pathname}
        custom={direction}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        className={cn("h-full", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
