"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { VsClash } from "@/components/battle/VsClash";
import { WinnerCelebration } from "@/components/battle/WinnerCelebration";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { getAmbientColor, normalizeHexColor } from "@/lib/colorUtils";
import { useFullscreen } from "@/hooks/useFullscreen";

export const BattleStage: React.FC = () => {
  const { leftTeam, rightTeam, setScreen, resetMatch } = useStore();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const ambLeft = getAmbientColor(normalizeHexColor(leftTeam.color));
  const ambRight = getAmbientColor(normalizeHexColor(rightTeam.color));

  const [stage, setStage] = useState<"clash" | "winner">("clash");
  const [winner, setWinner] = useState<"left" | "right" | null>(null);
  const [showControls, setShowControls] = useState(false);

  // Expose controls after clash impact settles (1.2s)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSetWinner = (side: "left" | "right") => {
    setWinner(side);
    setStage("winner");
  };

  const handleNextRoundKeepPlayers = () => {
    setScreen("setup");
  };

  const handleFullReset = () => {
    resetMatch();
  };

  return (
    <div className="relative w-full min-h-screen min-h-[100dvh] h-screen h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-black select-none">
      {/* Floating Fullscreen Toggle in Battle Stage */}
      <div className="absolute top-6 right-6 z-50">
        <button
          type="button"
          onClick={toggleFullscreen}
          className="min-h-[44px] min-w-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/70 border border-white/15 backdrop-blur-md text-zinc-300 hover:text-white hover:border-white/40 transition-all active:scale-95 cursor-pointer shadow-xl"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          <span className="hidden md:inline text-xs font-black tracking-wider uppercase">
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </span>
        </button>
      </div>

      {/* Main Clash / Winner Stage Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {stage === "clash" ? (
          <VsClash
            leftImage={leftTeam.image}
            rightImage={rightTeam.image}
            leftColor={leftTeam.color}
            rightColor={rightTeam.color}
            leftName={leftTeam.name}
            rightName={rightTeam.name}
          />
        ) : (
          winner && (
            <WinnerCelebration
              winner={winner}
              leftImage={leftTeam.image}
              rightImage={rightTeam.image}
              leftColor={leftTeam.color}
              rightColor={rightTeam.color}
              leftName={leftTeam.name}
              rightName={rightTeam.name}
            />
          )
        )}
      </div>

      {/* Broadcast Controls Overlay: Fixed at viewport bottom */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35 }}
            className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50 w-full max-w-4xl px-4 pointer-events-none"
          >
            {stage === "clash" ? (
              <>
                <div className="flex w-full justify-center items-center gap-6 sm:gap-10 pointer-events-auto">
                  {/* Left Winner Button (Angled Chamfered Shape matching START BATTLE) */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSetWinner("left")}
                    className="group relative w-56 sm:w-64 h-16 flex items-center justify-center cursor-pointer p-[2px] transition-all"
                    style={{
                      clipPath: "polygon(14px 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0 50%)",
                      background: `linear-gradient(90deg, ${ambLeft}, #ffffff)`,
                      boxShadow: `0 0 28px ${ambLeft}85`,
                    }}
                  >
                    <div
                      className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center px-4 transition-colors group-hover:bg-zinc-900"
                      style={{
                        clipPath: "polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%)",
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Trophy size={14} style={{ color: ambLeft }} />
                        <span
                          className="text-base sm:text-lg font-black italic tracking-wider text-white uppercase truncate max-w-[160px]"
                          style={{ textShadow: `0 0 12px ${ambLeft}` }}
                        >
                          {leftTeam.name || "PLAYER 1"}
                        </span>
                      </div>
                      <span className="text-[9px] font-black tracking-widest uppercase text-zinc-400">
                        DECLARE WINNER
                      </span>
                    </div>
                  </motion.button>

                  {/* Right Winner Button (Angled Chamfered Shape matching START BATTLE) */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSetWinner("right")}
                    className="group relative w-56 sm:w-64 h-16 flex items-center justify-center cursor-pointer p-[2px] transition-all"
                    style={{
                      clipPath: "polygon(14px 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0 50%)",
                      background: `linear-gradient(90deg, #ffffff, ${ambRight})`,
                      boxShadow: `0 0 28px ${ambRight}85`,
                    }}
                  >
                    <div
                      className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center px-4 transition-colors group-hover:bg-zinc-900"
                      style={{
                        clipPath: "polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%)",
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-base sm:text-lg font-black italic tracking-wider text-white uppercase truncate max-w-[160px]"
                          style={{ textShadow: `0 0 12px ${ambRight}` }}
                        >
                          {rightTeam.name || "PLAYER 2"}
                        </span>
                        <Trophy size={14} style={{ color: ambRight }} />
                      </div>
                      <span className="text-[9px] font-black tracking-widest uppercase text-zinc-400">
                        DECLARE WINNER
                      </span>
                    </div>
                  </motion.button>
                </div>

                {/* FIX 20: Reset and return to setup button (Min 44px touch target) */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleFullReset}
                  className="pointer-events-auto min-h-[44px] flex items-center gap-2 px-6 py-3 bg-black/80 backdrop-blur-md border border-white/25 text-zinc-300 hover:text-white hover:border-white/50 font-mono text-xs font-bold rounded-full uppercase tracking-widest transition-all shadow-xl active:scale-95 cursor-pointer"
                  title="Clear match and return to setup"
                >
                  <RotateCcw size={14} />
                  <span>RESET & RETURN TO SETUP</span>
                </motion.button>
              </>
            ) : (
              /* FIX 20: In winner celebration state, offer both Next Round and Full Reset (Min 44px touch targets) */
              <div className="flex flex-wrap justify-center items-center gap-4 pointer-events-auto">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleNextRoundKeepPlayers}
                  className="min-h-[44px] flex items-center gap-2 px-6 py-3 bg-zinc-900/90 backdrop-blur-md border border-white/30 text-white font-mono text-xs font-bold rounded-full uppercase tracking-widest transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>KEEP PLAYERS & NEXT ROUND</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleFullReset}
                  className="min-h-[44px] flex items-center gap-2 px-6 py-3 bg-red-950/80 backdrop-blur-md border border-red-500/40 text-red-200 hover:text-white font-mono text-xs font-bold rounded-full uppercase tracking-widest transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>RESET ALL // NEW MATCH</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
