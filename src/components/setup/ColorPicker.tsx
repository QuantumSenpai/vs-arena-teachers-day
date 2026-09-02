"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HexColorPicker } from "react-colorful";
import { motion, AnimatePresence } from "framer-motion";
import { Pipette, X, Check } from "lucide-react";
import { normalizeHexColor } from "@/lib/colorUtils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  side?: "left" | "right";
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  label = "ACCENT COLOR",
  side = "left",
}) => {
  const cleanColor = normalizeHexColor(color);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const presetSwatches = [
    "#00b4ff", // Electric Cyan-Blue
    "#ff0044", // Electric Neon Crimson
    "#00ff88", // Electric Emerald
    "#ffbb00", // Tournament Gold
    "#b026ff", // Electric Neon Violet
    "#06b6d4", // Sky Teal
    "#f43f5e", // Hot Rose
    "#ffffff", // Core White
  ];

  const handleBackdropDismiss = (e: React.SyntheticEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-3">
      {label && (
        <span className="text-xs font-black tracking-widest uppercase text-zinc-400">
          {label}
        </span>
      )}

      {/* Smartboard-Friendly Circular Swatch Trigger (80px - 96px, well over 44px touch min) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none cursor-pointer"
        style={{
          backgroundColor: "#09090b",
          border: `3px solid ${cleanColor}`,
          boxShadow: `0 0 20px ${cleanColor}60, inset 0 0 15px ${cleanColor}40`,
        }}
        aria-label="Select accent color"
      >
        {/* Inner Solid Swatch */}
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/80 shadow-md flex items-center justify-center transition-transform group-hover:scale-105"
          style={{ backgroundColor: cleanColor }}
        >
          <Pipette size={18} className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
        </div>

        {/* Outer glowing pulsing ring */}
        <div
          className="absolute -inset-1 rounded-full opacity-40 pointer-events-none group-hover:opacity-80 transition-opacity"
          style={{
            border: `1px solid ${cleanColor}`,
            filter: "blur(4px)",
          }}
        />
      </button>

      {/* Hex value pill: Clean 6-digit hex */}
      <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-300 bg-zinc-900/80 px-2.5 py-1 rounded-full border border-white/10">
        {cleanColor.toUpperCase()}
      </span>

      {/* FIX B: Portal Modal — rendered into document.body to avoid card overflow:hidden clipping */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={handleBackdropDismiss}
                onPointerDown={handleBackdropDismiss}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none touch-none"
              >
                <motion.div
                  initial={{ scale: 0.92, y: 15, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.92, y: 15, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="relative w-full max-w-sm bg-zinc-950 border-2 rounded-2xl p-6 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col items-center gap-4 touch-auto"
                  style={{
                    borderColor: cleanColor,
                    boxShadow: `0 0 35px ${cleanColor}40`,
                  }}
                >
                  {/* Header Bar */}
                  <div className="flex items-center justify-between w-full pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full border border-white/60 shadow-sm"
                        style={{ backgroundColor: cleanColor }}
                      />
                      <span className="text-xs font-black uppercase tracking-wider text-white">
                        {side === "left" ? "PLAYER 1 ACCENT COLOR" : "PLAYER 2 ACCENT COLOR"}
                      </span>
                    </div>

                    {/* Touch-Friendly Close Button: Minimum 44x44px */}
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                      aria-label="Close color picker"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* react-colorful HexColorPicker with touch-action: none for smooth dragging */}
                  <div className="w-full flex justify-center py-1 touch-none">
                    <HexColorPicker
                      color={cleanColor}
                      onChange={(c) => onChange(normalizeHexColor(c))}
                      className="!w-full !max-w-[280px] !h-52 cursor-crosshair touch-none"
                    />
                  </div>

                  {/* Preset Quick Swatches: 44x44px touch targets for fingers */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10 w-full justify-center">
                    {presetSwatches.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => onChange(preset)}
                        className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:bg-white/10 active:scale-90 cursor-pointer"
                        aria-label={`Select preset color ${preset}`}
                      >
                        <div
                          className="w-7 h-7 rounded-full border-2 transition-transform"
                          style={{
                            backgroundColor: preset,
                            borderColor:
                              cleanColor.toLowerCase() === preset.toLowerCase()
                                ? "#ffffff"
                                : "rgba(255,255,255,0.3)",
                            boxShadow:
                              cleanColor.toLowerCase() === preset.toLowerCase()
                                ? `0 0 10px ${preset}`
                                : "none",
                            transform:
                              cleanColor.toLowerCase() === preset.toLowerCase()
                                ? "scale(1.2)"
                                : "scale(1)",
                          }}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Current Hex Display & Done Button (Min 44px height) */}
                  <div className="flex items-center justify-between w-full pt-1 gap-3">
                    <span className="font-mono text-xs font-bold text-zinc-300 bg-zinc-900 px-3.5 py-3 rounded-xl border border-white/10">
                      {cleanColor.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 min-h-[44px] py-3 rounded-xl bg-white text-black font-black uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check size={16} />
                      <span>Done</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
