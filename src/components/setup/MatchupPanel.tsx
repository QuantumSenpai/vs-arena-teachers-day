"use client";

import React from "react";
import { ImageUploader } from "./ImageUploader";
import { ColorPicker } from "./ColorPicker";
import { Shield, Award } from "lucide-react";
import { getAmbientColor, normalizeHexColor, getCornerLabel } from "@/lib/colorUtils";

interface MatchupPanelProps {
  side: "left" | "right";
  name: string;
  image: string;
  color: string;
  onNameChange: (name: string) => void;
  onImageChange: (image: string) => void;
  onColorChange: (color: string) => void;
}

export const MatchupPanel: React.FC<MatchupPanelProps> = ({
  side,
  name,
  image,
  color,
  onNameChange,
  onImageChange,
  onColorChange,
}) => {
  const isLeft = side === "left";
  const cleanColor = normalizeHexColor(color);
  const ambientColor = getAmbientColor(cleanColor);

  // Clip path with beveled outer corners AND dramatic inward diagonal cut pointing toward center VS
  const clipPathStyle = isLeft
    ? "polygon(28px 0, calc(100% - 44px) 0, 100% 50%, calc(100% - 44px) 100%, 28px 100%, 0 calc(100% - 28px), 0 28px)"
    : "polygon(44px 0, calc(100% - 28px) 0, 100% 28px, 100% calc(100% - 28px), calc(100% - 28px) 100%, 44px 100%, 0 50%)";

  return (
    <div className="relative w-full max-w-[540px] h-[520px] transition-all duration-300">
      {/* Outer Flat Border Shell — Solid team color fill */}
      <div
        className="absolute inset-0 p-[3px] transition-colors"
        style={{
          clipPath: clipPathStyle,
          backgroundColor: ambientColor,
        }}
      >
        {/* Inner Panel Surface — High contrast near-black background with balanced vertical padding */}
        <div
          className="w-full h-full bg-zinc-950 relative overflow-hidden flex flex-col justify-between p-7 sm:p-9"
          style={{ clipPath: clipPathStyle }}
        >
          {/* Subtle Flat Diagonal Color Accent Bar */}
          <div
            className={`absolute top-0 ${isLeft ? "left-0" : "right-0"} w-full h-2 pointer-events-none opacity-80`}
            style={{ backgroundColor: ambientColor }}
          />

          {/* TOP BAR: Player Corner Identifier (Clean and prominent, division label removed) */}
          <div className={`relative z-10 flex items-center ${isLeft ? "justify-start" : "justify-end"}`}>
            <div
              className="px-3.5 py-1.5 rounded bg-black/75 border flex items-center gap-2 shadow-md"
              style={{ borderColor: `${ambientColor}60` }}
            >
              {isLeft ? (
                <Shield size={14} style={{ color: ambientColor }} />
              ) : (
                <Award size={14} style={{ color: ambientColor }} />
              )}
              <span className="text-[11px] font-black tracking-widest text-zinc-200 uppercase">
                {`PLAYER ${isLeft ? "1" : "2"} // ${getCornerLabel(cleanColor, isLeft ? "BLUE CORNER" : "RED CORNER")}`}
              </span>
            </div>
          </div>

          {/* CENTER: Upload Dropzone & Color Swatch Trigger (Generous vertical breathing room) */}
          <div className="relative z-10 flex-1 flex items-center justify-center gap-6 sm:gap-10 my-auto py-6">
            {/* Circular Photo Dropzone */}
            <ImageUploader
              image={image}
              onChange={onImageChange}
              accentColor={ambientColor}
              variant="circle"
            />

            {/* Glowing Accent Color Swatch */}
            <ColorPicker
              color={cleanColor}
              onChange={onColorChange}
              label="TEAM COLOR"
              side={side}
            />
          </div>

          {/* BOTTOM: Editable Name Banner Plate (Clean bottom anchor, separated background to prevent clip-path cutting into text) */}
          <div className="relative z-10 flex flex-col pt-1">
            <div className="relative w-full">
              {/* Angled Parallelogram Background & Border Layer */}
              <div
                className={`absolute inset-0 bg-black/85 backdrop-blur-md ${
                  isLeft ? "border-l-4" : "border-r-4"
                }`}
                style={{
                  clipPath: isLeft
                    ? "polygon(0 0, 100% 0, 95% 100%, 0 100%)"
                    : "polygon(5% 0, 100% 0, 100% 100%, 0 100%)",
                  borderColor: ambientColor,
                  boxShadow: `0 0 24px ${ambientColor}30`,
                }}
              />
              {/* Input layer (not subject to clipPath, with generous horizontal padding for italic text slant) */}
              <div
                className={`relative z-10 py-3 ${
                  isLeft ? "pl-5 pr-8 text-left" : "pr-6 pl-8 text-right"
                }`}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder={isLeft ? "PLAYER 1" : "PLAYER 2"}
                  className={`w-full bg-transparent text-white font-black italic text-2xl sm:text-3xl tracking-tight focus:outline-none uppercase placeholder-zinc-600 ${
                    isLeft ? "text-left" : "text-right"
                  }`}
                  style={{
                    textShadow: `0 0 15px ${ambientColor}80`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
