"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { impactIn } from "@/lib/easings";

interface ScreenShakeProps {
  children: React.ReactNode;
  trigger: number; // Increment this to trigger a shake
  className?: string;
}

export const ScreenShake: React.FC<ScreenShakeProps> = ({ children, trigger, className = "" }) => {
  const controls = useAnimation();
  const [hasReducedMotion, setHasReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setHasReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setHasReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (trigger > 0 && !hasReducedMotion) {
      controls.start({
        x: [0, -6, 6, -4, 4, -2, 2, 0],
        y: [0, 6, -6, 4, -4, 2, -2, 0],
        transition: {
          duration: 0.35,
          ease: impactIn,
        },
      });
    }
  }, [trigger, controls, hasReducedMotion]);

  return (
    <motion.div animate={controls} className={`w-full h-full ${className}`}>
      {children}
    </motion.div>
  );
};
