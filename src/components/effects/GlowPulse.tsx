"use client";

import React from "react";
import { motion } from "framer-motion";
import { smoothGlide } from "@/lib/easings";

interface GlowPulseProps {
  children: React.ReactNode;
  color: string;
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export const GlowPulse: React.FC<GlowPulseProps> = ({ 
  children, 
  color, 
  intensity = "low",
  className = "" 
}) => {
  const getPulseConfig = () => {
    switch (intensity) {
      case "high":
        return {
          scale: [0.95, 1.05, 0.95],
          opacity: [0.6, 1, 0.6],
          duration: 1.2,
          blur: "60px",
        };
      case "medium":
        return {
          scale: [0.9, 1.0, 0.9],
          opacity: [0.4, 0.8, 0.4],
          duration: 2.0,
          blur: "40px",
        };
      case "low":
      default:
        return {
          scale: [0.85, 1.0, 0.85],
          opacity: [0.2, 0.5, 0.2],
          duration: 3.0,
          blur: "30px",
        };
    }
  };

  const config = getPulseConfig();

  return (
    <div className={`relative ${className}`}>
      {/* The Glow */}
      <motion.div
        className="absolute inset-0 z-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: `blur(${config.blur})`,
        }}
        animate={{
          scale: config.scale,
          opacity: config.opacity,
        }}
        transition={{
          duration: config.duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: smoothGlide,
        }}
      />
      {/* The Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
