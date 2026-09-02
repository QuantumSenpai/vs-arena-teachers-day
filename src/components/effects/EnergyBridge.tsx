"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { getAmbientColor, normalizeHexColor } from "@/lib/colorUtils";

interface EnergyBridgeProps {
  side: "left" | "right";
  color: string;
  className?: string;
}

export const EnergyBridge: React.FC<EnergyBridgeProps> = ({
  side,
  color,
  className = "",
}) => {
  const uniqueId = useId().replace(/:/g, "_");
  const ambColor = getAmbientColor(normalizeHexColor(color));
  const isLeft = side === "left";

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 pointer-events-none z-10 overflow-visible ${
        isLeft ? "left-1/4 right-1/2" : "left-1/2 right-1/4"
      } ${className}`}
    >
      <motion.svg
        viewBox="0 0 400 60"
        className="w-full h-12 overflow-visible"
        preserveAspectRatio="none"
        animate={{
          opacity: [0.4, 0.75, 0.4],
          scaleY: [0.9, 1.15, 0.9],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <defs>
          <linearGradient
            id={`bridge-grad-${uniqueId}`}
            x1={isLeft ? "0%" : "100%"}
            y1="50%"
            x2={isLeft ? "100%" : "0%"}
            y2="50%"
          >
            {/* Starts near panel edge with glowing color, fades to 0 before center */}
            <stop offset="0%" stopColor={ambColor} stopOpacity="0.7" />
            <stop offset="45%" stopColor={ambColor} stopOpacity="0.45" />
            <stop offset="85%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor={ambColor} stopOpacity="0" />
          </linearGradient>

          <filter id={`bridge-glow-${uniqueId}`} x="-20%" y="-100%" width="140%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Glow Beam */}
        <line
          x1={isLeft ? "0" : "400"}
          y1="30"
          x2={isLeft ? "400" : "0"}
          y2="30"
          stroke={`url(#bridge-grad-${uniqueId})`}
          strokeWidth="3.5"
          filter={`url(#bridge-glow-${uniqueId})`}
          strokeLinecap="round"
        />

        {/* Core Laser Filament */}
        <line
          x1={isLeft ? "0" : "400"}
          y1="30"
          x2={isLeft ? "360" : "40"}
          y2="30"
          stroke={`url(#bridge-grad-${uniqueId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </motion.svg>
    </div>
  );
};
