"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { getAmbientColor, normalizeHexColor } from "@/lib/colorUtils";

interface VsEnergyShardsProps {
  leftColor: string;
  rightColor: string;
  className?: string;
}

export const VsEnergyShards: React.FC<VsEnergyShardsProps> = ({
  leftColor,
  rightColor,
  className = "",
}) => {
  const uniqueId = useId().replace(/:/g, "_");
  const ambLeft = getAmbientColor(normalizeHexColor(leftColor));
  const ambRight = getAmbientColor(normalizeHexColor(rightColor));

  return (
    <div
      className={`absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible select-none ${className}`}
    >
      {/* FIX A (4): Subtle radial bloom / convergence aura behind the VS text center */}
      <motion.div
        animate={{
          scale: [0.92, 1.08, 0.92],
          opacity: [0.55, 0.8, 0.55],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, #FFF8E7 0%, rgba(254, 240, 138, 0.55) 25%, ${ambLeft}33 55%, ${ambRight}33 75%, transparent 90%)`,
          filter: "blur(32px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Secondary wider atmospheric color haze */}
      <div
        className="absolute w-[520px] h-[520px] rounded-full pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(circle, transparent 25%, ${ambLeft}28 45%, ${ambRight}28 70%, transparent 95%)`,
          filter: "blur(48px)",
          mixBlendMode: "screen",
        }}
      />

      {/* FIX A (2 & 3): Fewer, thicker, softer volumetric light rays with mix-blend-mode: screen */}
      <motion.svg
        viewBox="0 0 800 800"
        className="w-[520px] h-[520px] sm:w-[580px] sm:h-[580px] overflow-visible pointer-events-none"
        style={{ mixBlendMode: "screen" }}
        animate={{
          rotate: [-3, 3, -3],
          scale: [0.98, 1.03, 0.98],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <defs>
          {/* Left Volumetric Rays: Fading from warm-white center to ambient left color */}
          <radialGradient id={`vol-left-${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="60%" stopColor={ambLeft} stopOpacity="0.65" />
            <stop offset="100%" stopColor={ambLeft} stopOpacity="0" />
          </radialGradient>

          {/* Right Volumetric Rays: Fading from warm-white center to ambient right color */}
          <radialGradient id={`vol-right-${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="60%" stopColor={ambRight} stopOpacity="0.65" />
            <stop offset="100%" stopColor={ambRight} stopOpacity="0" />
          </radialGradient>

          {/* Center Overlap Blended Shaft Gradient */}
          <linearGradient id={`vol-blend-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={ambLeft} stopOpacity="0.6" />
            <stop offset="35%" stopColor={ambLeft} stopOpacity="0.75" />
            <stop offset="50%" stopColor="#FFF8E7" stopOpacity="0.95" />
            <stop offset="65%" stopColor={ambRight} stopOpacity="0.75" />
            <stop offset="100%" stopColor={ambRight} stopOpacity="0.6" />
          </linearGradient>

          {/* Volumetric Soft Blur Filter (softens edges, removes polygon sharpness) */}
          <filter id={`vol-soft-glow-${uniqueId}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="9" result="softBlur" />
            <feMerge>
              <feMergeNode in="softBlur" />
              <feMergeNode in="softBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#vol-soft-glow-${uniqueId})`}>
          {/* LEFT THICK VOLUMETRIC LIGHT SHAFTS (Reduced to 4 broad, soft beams) */}
          <polygon
            points="400,400 130,160 260,110"
            fill={`url(#vol-left-${uniqueId})`}
            opacity="0.85"
          />
          <polygon
            points="400,400 70,300 150,220"
            fill={`url(#vol-left-${uniqueId})`}
            opacity="0.9"
          />
          <polygon
            points="400,400 80,500 70,390"
            fill={`url(#vol-left-${uniqueId})`}
            opacity="0.9"
          />
          <polygon
            points="400,400 230,690 140,610"
            fill={`url(#vol-left-${uniqueId})`}
            opacity="0.85"
          />

          {/* RIGHT THICK VOLUMETRIC LIGHT SHAFTS (Reduced to 4 broad, soft beams) */}
          <polygon
            points="400,400 540,110 670,160"
            fill={`url(#vol-right-${uniqueId})`}
            opacity="0.85"
          />
          <polygon
            points="400,400 650,220 730,300"
            fill={`url(#vol-right-${uniqueId})`}
            opacity="0.9"
          />
          <polygon
            points="400,400 730,390 720,500"
            fill={`url(#vol-right-${uniqueId})`}
            opacity="0.9"
          />
          <polygon
            points="400,400 660,610 570,690"
            fill={`url(#vol-right-${uniqueId})`}
            opacity="0.85"
          />

          {/* OVERLAPPING CENTER BEAMS (Cross over center x=340 to x=460; Screen blend fuses them) */}
          <polygon
            points="350,170 450,170 440,630 360,630"
            fill={`url(#vol-blend-${uniqueId})`}
            opacity="0.75"
          />
          <polygon
            points="330,250 470,550 440,590 300,290"
            fill={`url(#vol-blend-${uniqueId})`}
            opacity="0.7"
          />

          {/* Hot Core Center Bloom */}
          <circle cx="400" cy="400" r="48" fill="#FFF8E7" opacity="0.95" />
          <circle cx="400" cy="400" r="76" fill="#fef08a" opacity="0.6" />
        </g>
      </motion.svg>
    </div>
  );
};
