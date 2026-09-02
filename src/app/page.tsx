"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useStore } from "@/lib/store";
import { MatchupPanel } from "@/components/setup/MatchupPanel";
import { BattleStage } from "@/components/battle/BattleStage";
import { BroadcastVsBadge } from "@/components/effects/BroadcastVsBadge";
import { BoomFlash } from "@/components/effects/BoomFlash";
import { ScreenShake } from "@/components/effects/ScreenShake";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useIdleCursor } from "@/hooks/useIdleCursor";
import { Maximize2, Minimize2, Zap, Radio, RotateCcw } from "lucide-react";
import { getAmbientColor, normalizeHexColor } from "@/lib/colorUtils";
import { playWhoosh, playImpact } from "@/lib/sounds";

const hardEase = [0.16, 1, 0.3, 1] as const;

export default function Home() {
  const { screen, setScreen, leftTeam, rightTeam, updateLeftTeam, updateRightTeam, resetMatch } = useStore();

  // Smartboard accessibility & hardware hooks
  const shouldReduceMotion = useReducedMotion();
  useWakeLock();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { isIdle } = useIdleCursor(3000);

  // Derive flat ambient color tones per team (FIX 14)
  const ambLeft = getAmbientColor(normalizeHexColor(leftTeam.color));
  const ambRight = getAmbientColor(normalizeHexColor(rightTeam.color));

  // Sequence state management (~500ms total to impact)
  const [hasImpactFired, setHasImpactFired] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [showBadges, setShowBadges] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (screen !== "setup") return;

    setHasImpactFired(false);
    setShowBadges(false);
    setShowCta(false);

    if (shouldReduceMotion) {
      // Instant graceful setup for reduced motion
      setHasImpactFired(true);
      setShowBadges(true);
      setShowCta(true);
      return;
    }

    // STEP 1: Whoosh sound on panel slam-in
    playWhoosh();

    // STEP 3: Impact boom at 470ms (V and S collide)
    const impactTimer = setTimeout(() => {
      setHasImpactFired(true);
      setShakeTrigger((prev) => prev + 1);
      playImpact();
    }, 470);

    // STEP 4: Settle & stagger UI controls
    const badgeTimer = setTimeout(() => {
      setShowBadges(true);
    }, 580);

    const ctaTimer = setTimeout(() => {
      setShowCta(true);
    }, 680);

    return () => {
      clearTimeout(impactTimer);
      clearTimeout(badgeTimer);
      clearTimeout(ctaTimer);
    };
  }, [screen, animKey, shouldReduceMotion]);

  const handleReset = () => {
    resetMatch();
    setAnimKey((prev) => prev + 1);
  };

  return (
    <main
      className={`relative w-full h-screen h-[100dvh] overflow-hidden bg-black text-white font-sans select-none ${
        isIdle ? "cursor-none" : ""
      }`}
    >
      {/* STEP 3: Brief single sharp white radial flash on impact (gone in 270ms, no lingering glow) */}
      <BoomFlash trigger={hasImpactFired} />

      <AnimatePresence mode="wait">
        {screen === "setup" ? (
          <motion.div
            key="setup-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative w-full h-full h-[100dvh] overflow-y-auto flex flex-col justify-between p-6 md:p-8 lg:p-10"
          >
            {/* FULL-BLEED BROADCAST BACKGROUND — Clean flat diagonal color blocks, high contrast against near-black */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {/* Left & Right Diagonal Seam Background */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(115deg, ${ambLeft}22 0%, rgba(0,0,0,0.96) 46%, rgba(0,0,0,0.96) 54%, ${ambRight}22 100%)`,
                }}
              />

              {/* Scanline Grid Overlay */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
                  backgroundSize: "100% 4px",
                }}
              />

              {/* Subtle Ghost Background Numbers ("01" / "02") */}
              <div className="absolute left-6 top-1/3 -translate-y-1/2 text-[26vw] font-black italic tracking-tighter text-white opacity-[0.035] leading-none pointer-events-none select-none">
                01
              </div>
              <div className="absolute right-6 top-1/3 -translate-y-1/2 text-[26vw] font-black italic tracking-tighter text-white opacity-[0.035] leading-none pointer-events-none select-none">
                02
              </div>
            </div>

            {/* TOP HEADER: Clean App Wordmark & Navigation */}
            <header className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto mb-4">
              {/* Live Broadcast Indicator */}
              <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/70 border border-white/15 backdrop-blur-md">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300 flex items-center gap-1">
                  <Radio size={12} className="text-red-400" /> LIVE BROADCAST
                </span>
              </div>

              {/* Center App Wordmark: Split Two-Tone Metallic Font */}
              <div className="flex flex-col items-center mx-auto text-center">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="h-[2px] w-8 rounded-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${ambLeft})` }}
                  />
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <div
                    className="h-[2px] w-8 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${ambRight}, transparent)` }}
                  />
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: "linear-gradient(180deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)",
                    }}
                  >
                    VS&nbsp;
                  </span>
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(180deg, #ffffff 0%, ${ambRight} 55%, #ffffff 100%)`,
                    }}
                  >
                    ARENA
                  </span>
                </h1>

                <span className="text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase text-zinc-400 mt-1">
                  TEACHER&apos;S DAY CHAMPIONSHIP 2026 // OFFICIAL 1V1
                </span>
              </div>

              {/* Actions: Reset & Fullscreen (Min 44x44px touch targets for smartboards) */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="min-h-[44px] min-w-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/70 border border-white/15 backdrop-blur-md text-zinc-300 hover:text-red-400 hover:border-red-500/30 transition-all active:scale-95 cursor-pointer"
                  title="Reset Match & Clear Players"
                  aria-label="Reset match"
                >
                  <RotateCcw size={16} />
                  <span className="hidden md:inline text-xs font-mono font-bold uppercase tracking-wider">
                    Reset
                  </span>
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="min-h-[44px] min-w-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/70 border border-white/15 backdrop-blur-md text-zinc-300 hover:text-white hover:border-white/40 transition-all active:scale-95 cursor-pointer"
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  <span className="hidden md:inline text-xs font-black tracking-wider uppercase">
                    {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  </span>
                </button>
              </div>
            </header>

            {/* ScreenShake on physical impact */}
            <ScreenShake trigger={shakeTrigger} className="relative z-20 flex-1 flex flex-col justify-center">
              {/* CENTER HUB: Matchup Cards & Hero "VS" Battle Trigger */}
              <section className="relative z-20 flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8 max-w-7xl mx-auto w-full my-auto">
                {/* STEP 1: Player 1 Panel Slam-in from Left (0 -> ~400ms, hard ease-out, 2-3% settle bounce) */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 0 } : { x: "-120vw", opacity: 0 }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    scale: hasImpactFired && !shouldReduceMotion ? [1, 1.03, 1] : 1,
                  }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.2 }
                      : {
                          x: { duration: 0.4, ease: hardEase },
                          opacity: { duration: 0.15 },
                          scale: { duration: 0.12, ease: "easeOut" as const },
                        }
                  }
                  className="flex-1 w-full flex justify-center md:justify-end relative"
                  style={{ willChange: "transform, opacity" }}
                >
                  <MatchupPanel
                    side="left"
                    name={leftTeam.name}
                    image={leftTeam.image}
                    color={leftTeam.color}
                    onNameChange={(name) => updateLeftTeam({ name })}
                    onImageChange={(image) => updateLeftTeam({ image })}
                    onColorChange={(color) => updateLeftTeam({ color })}
                  />
                </motion.div>

                {/* CENTER HUB: Clean Broadcast VS Badge & Staggered Controls */}
                <div className="relative flex flex-col items-center justify-center shrink-0 w-64 sm:w-72 my-4 md:my-0 z-20">
                  {/* STEP 2 & 3: High-Velocity Slam Letters (V from left, S from right, white slash draw-on, scale punch) */}
                  <BroadcastVsBadge
                    leftColor={ambLeft}
                    rightColor={ambRight}
                    size="setup"
                    triggerImpact={hasImpactFired}
                  />

                  {/* Subtitle Accent with subtle glowing lightning bolts */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showBadges ? 1 : 0 }}
                    transition={{ duration: 0.22 }}
                    className="relative z-10 flex items-center gap-2 text-[11px] font-black tracking-widest text-zinc-300 uppercase mt-1 mb-5"
                  >
                    <Zap
                      size={13}
                      style={{
                        color: ambLeft,
                        filter: `drop-shadow(0 0 6px ${ambLeft}99)`,
                      }}
                    />
                    <span>ARE YOU READY?</span>
                    <Zap
                      size={13}
                      style={{
                        color: ambRight,
                        filter: `drop-shadow(0 0 6px ${ambRight}99)`,
                      }}
                    />
                  </motion.div>

                  {/* STEP 4: HERO CTA BUTTON (fades/slides in ~100ms after badge) */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{
                      opacity: showCta ? 1 : 0,
                      y: showCta ? 0 : 15,
                    }}
                    transition={{ duration: 0.25 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-20"
                  >
                    <button
                      type="button"
                      onClick={() => setScreen("battle")}
                      className="group relative w-64 sm:w-72 h-20 flex items-center justify-center cursor-pointer transition-all duration-300 select-none p-[2px]"
                      style={{
                        clipPath: "polygon(18px 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 18px 100%, 0 50%)",
                        background: `linear-gradient(90deg, ${ambLeft} 0%, rgba(255,255,255,0.9) 50%, ${ambRight} 100%)`,
                        boxShadow: `0 0 25px ${ambLeft}70, 0 0 25px ${ambRight}70`,
                      }}
                      aria-label="Start battle match"
                    >
                      {/* Inner Dark Surface for Double-Border Neon Effect */}
                      <div
                        className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center px-6 transition-colors group-hover:bg-zinc-900"
                        style={{
                          clipPath: "polygon(16px 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0 50%)",
                        }}
                      >
                        <span className="text-[10px] font-black tracking-[0.25em] text-yellow-400 uppercase leading-none mb-1">
                          MATCH READY
                        </span>

                        <span
                          className="text-2xl font-black italic tracking-wider text-white uppercase whitespace-nowrap group-hover:scale-105 transition-transform"
                          style={{
                            textShadow: "0 0 16px rgba(255,255,255,0.85)",
                          }}
                        >
                          START BATTLE
                        </span>

                        <span className="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase leading-none mt-1">
                          GLORY AWAITS
                        </span>
                      </div>
                    </button>
                  </motion.div>
                </div>

                {/* STEP 1: Player 2 Panel Slam-in from Right (0 -> ~400ms, hard ease-out, 2-3% settle bounce) */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 0 } : { x: "120vw", opacity: 0 }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    scale: hasImpactFired && !shouldReduceMotion ? [1, 1.03, 1] : 1,
                  }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.2 }
                      : {
                          x: { duration: 0.4, ease: hardEase },
                          opacity: { duration: 0.15 },
                          scale: { duration: 0.12, ease: "easeOut" as const },
                        }
                  }
                  className="flex-1 w-full flex justify-center md:justify-start relative"
                  style={{ willChange: "transform, opacity" }}
                >
                  <MatchupPanel
                    side="right"
                    name={rightTeam.name}
                    image={rightTeam.image}
                    color={rightTeam.color}
                    onNameChange={(name) => updateRightTeam({ name })}
                    onImageChange={(image) => updateRightTeam({ image })}
                    onColorChange={(color) => updateRightTeam({ color })}
                  />
                </motion.div>
              </section>
            </ScreenShake>

            {/* BOTTOM BAR: Event Meta Details */}
            <footer className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto text-zinc-400 text-xs font-mono font-medium pt-3 mt-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ARENA READY
                </span>
                <span className="hidden sm:inline text-zinc-600">|</span>
                <span className="hidden sm:inline uppercase">RULES: 60S CLOCK // INSTANT KNOCKOUT</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <span className="uppercase text-[11px] tracking-wider">SMARTBOARD EDITION 2026</span>
              </div>
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="battle-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full h-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
          >
            <BattleStage />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
