"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface BoomFlashProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const BoomFlash: React.FC<BoomFlashProps> = ({ trigger, onComplete }) => {
  const [active, setActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (trigger) {
      setActive(true);
      const timer = setTimeout(() => {
        setActive(false);
        onComplete?.();
      }, shouldReduceMotion ? 180 : 270);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete, shouldReduceMotion]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="boom-flash-overlay"
          initial={{ opacity: shouldReduceMotion ? 0.35 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden"
          style={{ willChange: "opacity" }}
        >
          {/* Sharp radial burst (or gentle subtle fade if reduced motion is preferred) */}
          <motion.div
            initial={shouldReduceMotion ? { scale: 1, opacity: 0.35 } : { scale: 0, opacity: 1 }}
            animate={
              shouldReduceMotion
                ? { opacity: 0 }
                : { scale: 1.5, opacity: [1, 0.9, 0] }
            }
            transition={{
              duration: shouldReduceMotion ? 0.18 : 0.27,
              times: shouldReduceMotion ? undefined : [0, 0.45, 1],
              ease: "easeOut",
            }}
            className="w-[180vw] h-[180vw] rounded-full shrink-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #ffffff 0%, rgba(255,255,255,0.95) 15%, rgba(255,255,255,0.4) 40%, transparent 65%)",
              willChange: "transform, opacity",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
