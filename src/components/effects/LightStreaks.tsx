"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { smoothGlide } from "@/lib/easings";

interface LightStreaksProps {
  side: "left" | "right";
  color: string;
  intensity: "idle" | "clash";
}

interface Streak {
  id: number;
  yOffset: number;
  delay: number;
  duration: number;
  angle: number;
  strokeWidth: number;
}

export const LightStreaks: React.FC<LightStreaksProps> = ({ side, color, intensity }) => {
  const isClash = intensity === "clash";
  const [streaks, setStreaks] = useState<Streak[]>([]);

  useEffect(() => {
    // 8 sleek streaks converging toward center VS
    const generated = Array.from({ length: 8 }).map((_, i) => {
      const isTop = i % 2 === 0;
      // Top streaks angle downward toward 50% center, bottom streaks angle upward toward center
      const yOffset = isTop ? 10 + i * 5 : 85 - i * 5;
      const delay = i * 0.2 + (i % 3) * 0.1;
      const duration = 1.6 + (i % 3) * 0.5;

      // Inward convergence angle toward center (y: 50%)
      const angle = isTop ? (50 - yOffset) * 0.5 : (50 - yOffset) * 0.5;
      const strokeWidth = 3 + (i % 3) * 2;

      return { id: i, yOffset, delay, duration, angle, strokeWidth };
    });
    setStreaks(generated);
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        transform: side === "right" ? "scaleX(-1)" : "scaleX(1)",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <svg
        className="w-full h-full pointer-events-none"
        style={{ pointerEvents: "none" }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`streak-grad-${side}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="50%" stopColor={color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id={`streak-glow-${side}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {streaks.map((streak) => (
          <motion.line
            key={streak.id}
            x1="-10%"
            y1={`${streak.yOffset}%`}
            x2="55%"
            y2={`${streak.yOffset + streak.angle}%`}
            stroke={`url(#streak-grad-${side})`}
            strokeWidth={streak.strokeWidth}
            strokeLinecap="round"
            initial={{ x: "-30vw", opacity: 0 }}
            animate={{
              x: ["-30vw", "70vw"],
              opacity: [0, isClash ? 0.9 : 0.45, 0],
            }}
            transition={{
              duration: isClash ? streak.duration * 0.45 : streak.duration,
              repeat: Infinity,
              repeatType: "loop",
              ease: smoothGlide,
              delay: streak.delay,
            }}
            style={{
              filter: `url(#streak-glow-${side})`,
              willChange: "transform",
            }}
          />
        ))}
      </svg>
    </div>
  );
};
