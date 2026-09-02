"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { getAmbientColor, normalizeHexColor } from "@/lib/colorUtils";
import { anton } from "@/lib/fonts";

interface BroadcastVsBadgeProps {
  leftColor: string;
  rightColor: string;
  size?: "setup" | "battle";
  triggerImpact?: boolean;
}

export const BroadcastVsBadge: React.FC<BroadcastVsBadgeProps> = ({
  leftColor,
  rightColor,
  size = "setup",
  triggerImpact = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const ambLeft = getAmbientColor(normalizeHexColor(leftColor));
  const ambRight = getAmbientColor(normalizeHexColor(rightColor));

  const [hasCollided, setHasCollided] = useState(false);
  const [showSpeedLines, setShowSpeedLines] = useState(false);

  useEffect(() => {
    if (triggerImpact) {
      setHasCollided(true);
      if (!shouldReduceMotion) {
        setShowSpeedLines(true);
        const timer = setTimeout(() => {
          setShowSpeedLines(false);
        }, 160);
        return () => clearTimeout(timer);
      }
    }
  }, [triggerImpact, shouldReduceMotion]);

  // Aggressive, chunky, condensed sports-editorial sizing
  const letterSizeClass =
    size === "battle"
      ? "text-9xl sm:text-[11rem] lg:text-[12.5rem]"
      : "text-8xl sm:text-9xl lg:text-[10.5rem]";

  const slashSizeClass =
    size === "battle"
      ? "h-28 sm:h-36 lg:h-44 w-2 sm:w-2.5"
      : "h-20 sm:h-24 lg:h-32 w-1.5 sm:w-2";

  const hardEase = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="relative flex items-center justify-center pointer-events-none select-none my-1">
      {/* 2-3 Thin White Speed-Lines radiating out on impact for ~150ms */}
      <AnimatePresence>
        {showSpeedLines && !shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 1, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: "easeOut" as const }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="absolute w-44 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent -translate-x-32" />
            <div className="absolute w-44 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent translate-x-32" />
            <div className="absolute w-52 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent rotate-45" />
            <div className="absolute w-52 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent -rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main VS Container with Impact Scale-Punch (1 -> 1.08 -> 1, ~150ms) */}
      <motion.div
        animate={
          hasCollided && !shouldReduceMotion
            ? { scale: [1, 1.08, 1] }
            : { scale: 1 }
        }
        transition={{ duration: 0.15, ease: "easeOut" as const }}
        className="relative z-20 flex items-center justify-center gap-0.5 sm:gap-1.5"
        style={{ willChange: "transform" }}
      >
        {/* "V" Letter — Heavy condensed Anton font, forward slant -8deg, subtle soft color glow */}
        <motion.span
          initial={shouldReduceMotion ? { opacity: 0 } : { x: "-50vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.2 }
              : {
                  duration: 0.22,
                  delay: 0.25,
                  ease: hardEase,
                }
          }
          className={`${anton.className} ${letterSizeClass} uppercase leading-none tracking-tight -skew-x-[8deg] select-none`}
          style={{
            color: ambLeft,
            filter: `drop-shadow(0 0 16px ${ambLeft}55) drop-shadow(0 4px 10px rgba(0,0,0,0.85))`,
            willChange: "transform, opacity",
          }}
        >
          V
        </motion.span>

        {/* Italic White Diagonal Slash Divider — Fast draw-on with gentle white glow */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            hasCollided || shouldReduceMotion
              ? { scaleX: 1, opacity: 1 }
              : { scaleX: 0, opacity: 0 }
          }
          transition={{
            duration: shouldReduceMotion ? 0.1 : 0.08,
            ease: "easeOut" as const,
          }}
          className={`${slashSizeClass} bg-white rounded-full -skew-x-[18deg] origin-center shrink-0 mx-0.5`}
          style={{
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.75), 0 0 20px rgba(255, 255, 255, 0.35)",
            willChange: "transform, opacity",
          }}
        />

        {/* "S" Letter — Heavy condensed Anton font, forward slant -8deg, subtle soft color glow */}
        <motion.span
          initial={shouldReduceMotion ? { opacity: 0 } : { x: "50vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.2 }
              : {
                  duration: 0.22,
                  delay: 0.25,
                  ease: hardEase,
                }
          }
          className={`${anton.className} ${letterSizeClass} uppercase leading-none tracking-tight -skew-x-[8deg] select-none`}
          style={{
            color: ambRight,
            filter: `drop-shadow(0 0 16px ${ambRight}55) drop-shadow(0 4px 10px rgba(0,0,0,0.85))`,
            willChange: "transform, opacity",
          }}
        >
          S
        </motion.span>
      </motion.div>
    </div>
  );
};
