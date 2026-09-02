"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ClashImpactRef {
  playImpact: () => Promise<void>;
}

interface ClashImpactProps {
  color?: string; // e.g. "rgba(255, 255, 255, 0.8)"
}

export const ClashImpact = forwardRef<ClashImpactRef, ClashImpactProps>(({ color = "#ffffff" }, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    playImpact: () => {
      return new Promise<void>((resolve) => {
        setIsVisible(true);
        // The flash lasts ~200ms
        setTimeout(() => {
          setIsVisible(false);
          // Allow the rest of the orchestration (220ms remaining for t=1000)
          setTimeout(() => {
            resolve();
          }, 220); // Resolves at t=1000 roughly if called at t=780
        }, 200);
      });
    }
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.8, scale: 1.2 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

ClashImpact.displayName = "ClashImpact";
