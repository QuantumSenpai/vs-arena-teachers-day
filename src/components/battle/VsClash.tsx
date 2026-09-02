"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { playWhoosh, playImpact } from "@/lib/sounds";
import { ScreenShake } from "@/components/effects/ScreenShake";
import { ParticleField, ParticleFieldRef } from "@/components/effects/ParticleField";
import { LightStreaks } from "@/components/effects/LightStreaks";
import { BroadcastVsBadge } from "@/components/effects/BroadcastVsBadge";
import { BoomFlash } from "@/components/effects/BoomFlash";
import { Shield, Award } from "lucide-react";
import { getAmbientColor, normalizeHexColor, getCornerLabel } from "@/lib/colorUtils";

type SequenceState = "offscreen" | "enter" | "impact" | "idle" | "exit";

export interface VsClashProps {
  leftImage: string;
  rightImage: string;
  leftColor: string;
  rightColor: string;
  leftName?: string;
  rightName?: string;
  isNextRoundTriggered?: boolean;
  onNextRoundComplete?: () => void;
}

export const VsClash: React.FC<VsClashProps> = ({
  leftImage,
  rightImage,
  leftColor,
  rightColor,
  leftName = "PLAYER 1",
  rightName = "PLAYER 2",
  isNextRoundTriggered = false,
  onNextRoundComplete,
}) => {
  const [seqState, setSeqState] = useState<SequenceState>("offscreen");
  const [clashIntensity, setClashIntensity] = useState<"idle" | "clash">("idle");
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [showBoom, setShowBoom] = useState(false);

  const leftParticles = useRef<ParticleFieldRef>(null);
  const rightParticles = useRef<ParticleFieldRef>(null);

  const ambLeft = getAmbientColor(normalizeHexColor(leftColor));
  const ambRight = getAmbientColor(normalizeHexColor(rightColor));

  useEffect(() => {
    let isMounted = true;

    const runIntro = async () => {
      // STEP 1: Slam in fast (0 -> 400ms)
      setSeqState("offscreen");
      await new Promise((r) => setTimeout(r, 40));
      if (!isMounted) return;

      playWhoosh();
      setSeqState("enter");

      // STEP 3: Impact at ~470ms
      await new Promise((r) => setTimeout(r, 430));
      if (!isMounted) return;

      setSeqState("impact");
      setShowBoom(true);
      setClashIntensity("clash");
      setShakeTrigger((prev) => prev + 1);
      leftParticles.current?.triggerBurst();
      rightParticles.current?.triggerBurst();
      playImpact();

      await new Promise((r) => setTimeout(r, 140));
      if (!isMounted) return;

      setSeqState("idle");
      setTimeout(() => {
        if (isMounted) setClashIntensity("idle");
      }, 300);
    };

    if (!isNextRoundTriggered) {
      runIntro();
    } else {
      const runExit = async () => {
        setSeqState("exit");
        await new Promise((r) => setTimeout(r, 350));
        if (!isMounted) return;
        onNextRoundComplete?.();
      };
      runExit();
    }

    return () => {
      isMounted = false;
    };
  }, [isNextRoundTriggered, onNextRoundComplete]);

  const hardEase = [0.16, 1, 0.3, 1] as const;

  // High-velocity hard ease-out panel slam-in
  const leftPanelVariants = {
    offscreen: { x: "-120vw", opacity: 0 },
    enter: {
      x: "0%",
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: hardEase },
    },
    impact: {
      scale: [1, 1.03, 1],
      transition: { duration: 0.12, ease: "easeOut" as const },
    },
    idle: { x: "0%", opacity: 1, scale: 1 },
    exit: {
      x: "-120vw",
      opacity: 0,
      transition: { duration: 0.35, ease: hardEase },
    },
  };

  const rightPanelVariants = {
    offscreen: { x: "120vw", opacity: 0 },
    enter: {
      x: "0%",
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: hardEase },
    },
    impact: {
      scale: [1, 1.03, 1],
      transition: { duration: 0.12, ease: "easeOut" as const },
    },
    idle: { x: "0%", opacity: 1, scale: 1 },
    exit: {
      x: "120vw",
      opacity: 0,
      transition: { duration: 0.35, ease: hardEase },
    },
  };

  const leftClipPath =
    "polygon(28px 0, calc(100% - 44px) 0, 100% 50%, calc(100% - 44px) 100%, 28px 100%, 0 calc(100% - 28px), 0 28px)";
  const rightClipPath =
    "polygon(44px 0, calc(100% - 28px) 0, 100% 28px, 100% calc(100% - 28px), calc(100% - 28px) 100%, 44px 100%, 0 50%)";

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black select-none">
      {/* Single sharp white radial boom flash on collision */}
      <BoomFlash trigger={showBoom} />

      {/* Background Ambience & Scanline Texture */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(115deg, ${ambLeft}22 0%, rgba(0,0,0,0.96) 46%, rgba(0,0,0,0.96) 54%, ${ambRight}22 100%)`,
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "100% 4px",
          }}
        />

        {/* Minimal Convergent Accents */}
        <LightStreaks side="left" color={ambLeft} intensity={clashIntensity} />
        <LightStreaks side="right" color={ambRight} intensity={clashIntensity} />
        <ParticleField ref={leftParticles} color={ambLeft} />
        <ParticleField ref={rightParticles} color={ambRight} />
      </div>

      <ScreenShake trigger={shakeTrigger} className="relative z-10 w-full h-full max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 pointer-events-none">
        {/* LEFT CHARACTER PANEL: Flat solid color block border, high contrast against black */}
        <motion.div
          variants={leftPanelVariants}
          initial="offscreen"
          animate={seqState}
          className="relative w-full max-w-[560px] h-[560px] lg:h-[620px] pointer-events-auto"
        >
          <div
            className="w-full h-full p-[3px] transition-colors"
            style={{
              clipPath: leftClipPath,
              backgroundColor: ambLeft,
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

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* Top Banner Tag: Safely inset from chamfer */}
              <div className="relative z-10 px-8 pt-6 flex items-center gap-2">
                <div className="px-3 py-1 bg-black/80 rounded border border-white/20 backdrop-blur-md flex items-center gap-1.5">
                  <Shield size={14} style={{ color: ambLeft }} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-200">
                    {`PLAYER 1 // ${getCornerLabel(ambLeft, "BLUE CORNER")}`}
                  </span>
                </div>
              </div>

              {/* Bottom In-Frame Parallelogram Name Plate (Separated background from text layer) */}
              <div className="relative z-10 px-8 pb-6 w-full flex justify-start">
                <div className="relative min-w-[260px] max-w-[440px]">
                  {/* Background chamfer layer */}
                  <div
                    className="absolute inset-0 bg-black/95 backdrop-blur-md border-l-4"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)",
                      borderLeftColor: ambLeft,
                      boxShadow: `0 0 20px ${ambLeft}30`,
                    }}
                  />
                  {/* Text layer: not subject to clip-path, generous horizontal padding */}
                  <div className="relative z-10 py-3 pl-6 pr-8 text-left">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block pl-1">
                      DEFENDING CHAMPION
                    </span>
                    <h2
                      className="text-4xl lg:text-5xl font-black italic uppercase tracking-tight text-white drop-shadow-md pl-1 truncate"
                      style={{ textShadow: `0 0 12px ${ambLeft}80` }}
                    >
                      {leftName}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CENTER VS HUB: Sports Broadcast Flat VS Badge */}
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          {seqState !== "offscreen" && (
            <BroadcastVsBadge
              leftColor={ambLeft}
              rightColor={ambRight}
              size="battle"
              triggerImpact={seqState === "impact" || seqState === "idle"}
            />
          )}
        </div>

        {/* RIGHT CHARACTER PANEL: Flat solid color block border, high contrast against black */}
        <motion.div
          variants={rightPanelVariants}
          initial="offscreen"
          animate={seqState}
          className="relative w-full max-w-[560px] h-[560px] lg:h-[620px] pointer-events-auto"
        >
          <div
            className="w-full h-full p-[3px] transition-colors"
            style={{
              clipPath: rightClipPath,
              backgroundColor: ambRight,
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

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* Top Banner Tag: Safely inset from chamfer */}
              <div className="relative z-10 px-8 pt-6 flex items-center gap-2">
                <div className="px-3 py-1 bg-black/80 rounded border border-white/20 backdrop-blur-md flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-200">
                    {`PLAYER 2 // ${getCornerLabel(ambRight, "RED CORNER")}`}
                  </span>
                  <Award size={14} style={{ color: ambRight }} />
                </div>
              </div>

              {/* Bottom In-Frame Parallelogram Name Plate (Separated background from text layer to prevent letter clipping) */}
              <div className="relative z-10 px-8 pb-6 w-full flex justify-end">
                <div className="relative min-w-[260px] max-w-[440px]">
                  {/* Background chamfer layer */}
                  <div
                    className="absolute inset-0 bg-black/95 backdrop-blur-md border-r-4"
                    style={{
                      clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0 100%)",
                      borderRightColor: ambRight,
                      boxShadow: `0 0 20px ${ambRight}30`,
                    }}
                  />
                  {/* Text layer: not subject to clip-path, generous right padding for italic text slant */}
                  <div className="relative z-10 py-3 pr-7 pl-8 text-right">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block pr-1.5">
                      CHALLENGER
                    </span>
                    <h2
                      className="text-4xl lg:text-5xl font-black italic uppercase tracking-tight text-white drop-shadow-md pr-1.5 truncate"
                      style={{ textShadow: `0 0 12px ${ambRight}80` }}
                    >
                      {rightName}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </ScreenShake>
    </div>
  );
};
