"use client";

import React from "react";
import { motion, useAnimationControls } from "framer-motion";
import { getAmbientColor, normalizeHexColor } from "@/lib/colorUtils";
import { VsEnergyShards } from "@/components/effects/VsEnergyShards";

type ControlsType = ReturnType<typeof useAnimationControls>;

interface CinematicVsBadgeProps {
  leftColor: string;
  rightColor: string;
  size?: "setup" | "battle";
  controls?: ControlsType;
}

export const CinematicVsBadge: React.FC<CinematicVsBadgeProps> = ({
  leftColor,
  rightColor,
  size = "setup",
  controls,
}) => {
  const ambLeft = getAmbientColor(normalizeHexColor(leftColor));
  const ambRight = getAmbientColor(normalizeHexColor(rightColor));

  // FIX A (1): Single continuous linear-gradient across full width of "VS"
  // 0%: player 1 (ambient), 42%: soft transition, 50%: warm-white/gold #FFF8E7, 58%: soft transition, 100%: player 2 (ambient)
  const vsGradient = `linear-gradient(100deg, ${ambLeft} 0%, ${ambLeft} 42%, #FFF8E7 50%, ${ambRight} 58%, ${ambRight} 100%)`;

  const textSizeClass =
    size === "battle"
      ? "text-8xl sm:text-9xl lg:text-[10rem]"
      : "text-7xl sm:text-8xl lg:text-9xl";

  return (
    <div className="relative flex flex-col items-center justify-center pointer-events-none select-none">
      {/* Volumetric Soft Rays & Convergence Bloom */}
      <VsEnergyShards leftColor={ambLeft} rightColor={ambRight} />

      {/* FIX A (4): Dedicated center radial bloom directly behind the VS text */}
      <div
        className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full pointer-events-none z-10 opacity-70"
        style={{
          background: `radial-gradient(circle at 50% 50%, #FFF8E7 0%, rgba(254, 240, 138, 0.45) 30%, ${ambLeft}22 55%, ${ambRight}22 75%, transparent 90%)`,
          filter: "blur(24px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Animated / Scaled Text Container */}
      <motion.div
        animate={
          controls
            ? controls
            : {
                scale: [1, 1.04, 1],
              }
        }
        transition={
          controls
            ? undefined
            : {
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        className="relative z-20 flex items-center justify-center my-1"
      >
        {/* FIX A (5): Duplicate soft-blurred text glow layer behind for luminous bloom */}
        <span
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center ${textSizeClass} font-black italic tracking-tighter pointer-events-none select-none`}
          style={{
            background: vsGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: `blur(12px) drop-shadow(0 0 30px #FFF8E7) drop-shadow(0 0 45px ${ambLeft}) drop-shadow(0 0 45px ${ambRight})`,
            opacity: 0.85,
          }}
        >
          VS
        </span>

        {/* FIX A (1 & 5): Razor-sharp single continuous gradient text element on top */}
        <span
          className={`relative z-10 ${textSizeClass} font-black italic tracking-tighter select-none`}
          style={{
            background: vsGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.85)) drop-shadow(0 0 14px rgba(255, 248, 231, 0.6))",
          }}
        >
          VS
        </span>
      </motion.div>
    </div>
  );
};
