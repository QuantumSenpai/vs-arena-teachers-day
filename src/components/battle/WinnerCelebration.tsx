"use client";

import React from "react";
import { motion, TargetAndTransition } from "framer-motion";
import { overshootSettle, elasticPop } from "@/lib/easings";
import { ConfettiBurst } from "@/components/effects/ConfettiBurst";
import { Trophy, Crown, Shield } from "lucide-react";
import { getAmbientColor, normalizeHexColor, getCornerLabel } from "@/lib/colorUtils";

interface WinnerCelebrationProps {
  winner: "left" | "right";
  leftImage: string;
  rightImage: string;
  leftColor: string;
  rightColor: string;
  leftName?: string;
  rightName?: string;
}

export const WinnerCelebration: React.FC<WinnerCelebrationProps> = ({
  winner,
  leftImage,
  rightImage,
  leftColor,
  rightColor,
  leftName = "PLAYER 1",
  rightName = "PLAYER 2",
}) => {
  const isLeftWinner = winner === "left";
  const ambLeft = getAmbientColor(normalizeHexColor(leftColor));
  const ambRight = getAmbientColor(normalizeHexColor(rightColor));
  const winningColor = isLeftWinner ? ambLeft : ambRight;
  const rawWinningColor = isLeftWinner ? leftColor : rightColor;
  const winningName = isLeftWinner ? leftName : rightName;

  const getPanelAnimation = (isWinner: boolean): TargetAndTransition => {
    if (isWinner) {
      return {
        scale: 1.03,
        filter: "grayscale(0%) brightness(105%)",
        opacity: 1,
        transition: overshootSettle,
      };
    } else {
      return {
        scale: 0.96,
        filter: "grayscale(100%) brightness(35%)",
        opacity: 0.45,
        transition: { duration: 0.4, ease: "easeOut" as const },
      };
    }
  };

  const leftClipPath =
    "polygon(28px 0, calc(100% - 44px) 0, 100% 50%, calc(100% - 44px) 100%, 28px 100%, 0 calc(100% - 28px), 0 28px)";
  const rightClipPath =
    "polygon(44px 0, calc(100% - 28px) 0, 100% 28px, 100% calc(100% - 28px), calc(100% - 28px) 100%, 44px 100%, 0 50%)";

  return (
    <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 overflow-hidden bg-black select-none">
      {/* Confetti Burst for the victor */}
      <ConfettiBurst play={true} teamColor={rawWinningColor} />

      {/* FIX 13: Full-screen low-opacity shared color-grade overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: `radial-gradient(ellipse at ${isLeftWinner ? "30% 50%" : "70% 50%"}, ${winningColor} 0%, transparent 70%)`,
          opacity: 0.12,
          mixBlendMode: "screen",
        }}
      />

      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(circle at ${isLeftWinner ? "30% 50%" : "70% 50%"}, ${winningColor} 0%, transparent 65%)`,
          filter: "blur(60px)",
        }}
      />

      {/* LEFT CHARACTER PANEL */}
      <motion.div
        initial={{ scale: 1, opacity: 1, filter: "grayscale(0%) brightness(100%)" }}
        animate={getPanelAnimation(isLeftWinner)}
        className="relative w-full max-w-[560px] h-[560px] lg:h-[620px] pointer-events-auto"
        style={{
          // FIX 13: Extended drop-shadow blur radius so victory glow fills background
          filter: isLeftWinner
            ? `drop-shadow(0 0 52px ${ambLeft}95) drop-shadow(0 0 20px ${ambLeft}80) drop-shadow(0 0 10px #ffffff)`
            : "none",
        }}
      >
        {/* Double-Line Glowing Neon Outer Shell */}
        <div
          className="w-full h-full p-[3px] transition-all"
          style={{
            clipPath: leftClipPath,
            backgroundColor: isLeftWinner ? ambLeft : "rgba(255,255,255,0.15)",
          }}
        >
          <div
            className="w-full h-full bg-zinc-950 relative overflow-hidden flex flex-col justify-between"
            style={{ clipPath: leftClipPath }}
          >
            {/* Character Image */}
            <div
              className="absolute inset-0 bg-cover bg-[center_top]"
              style={{ backgroundImage: `url(${leftImage})` }}
            />

            {/* Tint Overlay */}
            {isLeftWinner && (
              <div
                className="absolute inset-0 opacity-25 mix-blend-multiply pointer-events-none"
                style={{ background: `linear-gradient(to right, black, ${ambLeft})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent pointer-events-none" />

            {/* Top Banner Tag */}
            <div className="relative z-10 p-6 flex items-center gap-2">
              <div className="px-3.5 py-1 bg-black/80 rounded border border-white/20 backdrop-blur-md flex items-center gap-1.5">
                <Shield size={14} style={{ color: ambLeft }} />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-200">
                  {`PLAYER 1 // ${getCornerLabel(ambLeft, "BLUE CORNER")}`}
                </span>
              </div>
            </div>

            {/* Bottom In-Frame Parallelogram Name Plate (Separated background from text layer) */}
            <div className="relative z-10 px-8 pb-6 w-full flex justify-start">
              <div className="relative min-w-[260px] max-w-[440px]">
                <div
                  className="absolute inset-0 bg-black/95 backdrop-blur-md border-l-4"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)",
                    borderLeftColor: ambLeft,
                    boxShadow: isLeftWinner ? `0 0 28px ${ambLeft}70` : "none",
                  }}
                />
                <div className="relative z-10 py-3 pl-6 pr-8 text-left">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block pl-1">
                    {isLeftWinner ? "VICTORIOUS" : "ELIMINATED"}
                  </span>
                  <h2
                    className="text-4xl lg:text-5xl font-black italic uppercase tracking-tight text-white drop-shadow-md pl-1 truncate"
                    style={{ textShadow: isLeftWinner ? `0 0 16px ${ambLeft}` : "none" }}
                  >
                    {leftName}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating WINNER Crown Badge for Left */}
        {isLeftWinner && (
          <motion.div
            initial={{ scale: 0, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ ...elasticPop, delay: 0.15 }}
            className="absolute -top-6 left-12 z-30 flex items-center gap-2 px-6 py-2.5 bg-yellow-400 text-black font-black italic text-xl rounded-xl border-2 border-white shadow-[0_0_30px_rgba(250,204,21,0.9)] uppercase tracking-wider"
          >
            <Crown size={22} className="text-black" />
            <span>WINNER</span>
          </motion.div>
        )}
      </motion.div>

      {/* CENTER VICTORY BANNER */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-sm pointer-events-none">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...overshootSettle, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div
            className="p-4 rounded-full bg-black/80 border-2 mb-3 shadow-2xl"
            style={{ borderColor: winningColor, boxShadow: `0 0 35px ${winningColor}85` }}
          >
            <Trophy size={48} style={{ color: winningColor }} />
          </div>

          <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-400 mb-1">
            MATCH CONCLUSION
          </span>
          <h1
            className="text-4xl lg:text-5xl font-black italic uppercase tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
            style={{ textShadow: `0 0 25px ${winningColor}` }}
          >
            {winningName}
          </h1>
          <span
            className="text-lg font-black tracking-widest uppercase mt-1"
            style={{ color: winningColor }}
          >
            CLAIMS VICTORY
          </span>
        </motion.div>
      </div>

      {/* RIGHT CHARACTER PANEL */}
      <motion.div
        initial={{ scale: 1, opacity: 1, filter: "grayscale(0%) brightness(100%)" }}
        animate={getPanelAnimation(!isLeftWinner)}
        className="relative w-full max-w-[560px] h-[560px] lg:h-[620px] pointer-events-auto"
        style={{
          // FIX 13: Extended drop-shadow blur radius so victory glow fills background
          filter: !isLeftWinner
            ? `drop-shadow(0 0 52px ${ambRight}95) drop-shadow(0 0 20px ${ambRight}80) drop-shadow(0 0 10px #ffffff)`
            : "none",
        }}
      >
        {/* Double-Line Glowing Neon Outer Shell */}
        <div
          className="w-full h-full p-[3px] transition-all"
          style={{
            clipPath: rightClipPath,
            backgroundColor: !isLeftWinner ? ambRight : "rgba(255,255,255,0.15)",
          }}
        >
          <div
            className="w-full h-full bg-zinc-950 relative overflow-hidden flex flex-col justify-between items-end text-right"
            style={{ clipPath: rightClipPath }}
          >
            {/* Character Image */}
            <div
              className="absolute inset-0 bg-cover bg-[center_top]"
              style={{ backgroundImage: `url(${rightImage})` }}
            />

            {/* Tint Overlay */}
            {!isLeftWinner && (
              <div
                className="absolute inset-0 opacity-25 mix-blend-multiply pointer-events-none"
                style={{ background: `linear-gradient(to left, black, ${ambRight})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent pointer-events-none" />

            {/* Top Banner Tag */}
            <div className="relative z-10 p-6 flex items-center gap-2">
              <div className="px-3.5 py-1 bg-black/80 rounded border border-white/20 backdrop-blur-md flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-200">
                  {`PLAYER 2 // ${getCornerLabel(ambRight, "RED CORNER")}`}
                </span>
                <Shield size={14} style={{ color: ambRight }} />
              </div>
            </div>

            {/* Bottom In-Frame Parallelogram Name Plate (Separated background from text layer to prevent letter clipping) */}
            <div className="relative z-10 px-8 pb-6 w-full flex justify-end">
              <div className="relative min-w-[260px] max-w-[440px]">
                <div
                  className="absolute inset-0 bg-black/95 backdrop-blur-md border-r-4"
                  style={{
                    clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0 100%)",
                    borderRightColor: ambRight,
                    boxShadow: !isLeftWinner ? `0 0 28px ${ambRight}70` : "none",
                  }}
                />
                <div className="relative z-10 py-3 pr-7 pl-8 text-right">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block pr-1.5">
                    {!isLeftWinner ? "VICTORIOUS" : "ELIMINATED"}
                  </span>
                  <h2
                    className="text-4xl lg:text-5xl font-black italic uppercase tracking-tight text-white drop-shadow-md pr-1.5 truncate"
                    style={{ textShadow: !isLeftWinner ? `0 0 16px ${ambRight}` : "none" }}
                  >
                    {rightName}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating WINNER Crown Badge for Right */}
        {!isLeftWinner && (
          <motion.div
            initial={{ scale: 0, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ ...elasticPop, delay: 0.15 }}
            className="absolute -top-6 right-12 z-30 flex items-center gap-2 px-6 py-2.5 bg-yellow-400 text-black font-black italic text-xl rounded-xl border-2 border-white shadow-[0_0_30px_rgba(250,204,21,0.9)] uppercase tracking-wider"
          >
            <Crown size={22} className="text-black" />
            <span>WINNER</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
