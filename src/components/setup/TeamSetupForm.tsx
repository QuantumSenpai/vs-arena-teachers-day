"use client";

import React from "react";
import { useStore } from "@/lib/store";
import { ImageUploader } from "./ImageUploader";
import { ColorPicker } from "./ColorPicker";

export const TeamSetupForm: React.FC = () => {
  const { leftTeam, rightTeam, updateLeftTeam, updateRightTeam } = useStore();

  return (
    <div className="flex w-full max-w-5xl gap-4 h-[400px]">
      {/* Left Team Card */}
      <div 
        className="flex-1 flex flex-col p-8 bg-black/60 backdrop-blur-md relative"
        style={{ 
          clipPath: "polygon(0 0, 100% 0, 90% 100%, 0% 100%)",
          borderLeft: `4px solid ${leftTeam.color}` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent pointer-events-none" />
        
        <div className="relative z-10 w-4/5 h-full flex flex-col gap-6">
          <input
            type="text"
            value={leftTeam.name}
            onChange={(e) => updateLeftTeam({ name: e.target.value })}
            className="w-full bg-transparent border-b-2 font-black italic uppercase text-3xl outline-none py-2"
            style={{ borderBottomColor: leftTeam.color, color: leftTeam.color }}
            placeholder="TEAM 1 NAME"
          />

          <div className="flex items-start gap-6">
            <div className="flex-1">
              <ImageUploader 
                image={leftTeam.image} 
                onChange={(url) => updateLeftTeam({ image: url })} 
                accentColor={leftTeam.color}
              />
            </div>
            <ColorPicker 
              color={leftTeam.color} 
              onChange={(color) => updateLeftTeam({ color })} 
            />
          </div>
        </div>
      </div>

      {/* Right Team Card */}
      <div 
        className="flex-1 flex flex-col p-8 bg-black/60 backdrop-blur-md relative items-end text-right"
        style={{ 
          clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
          borderRight: `4px solid ${rightTeam.color}`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-black/80 to-transparent pointer-events-none" />

        <div className="relative z-10 w-4/5 h-full flex flex-col gap-6 items-end">
          <input
            type="text"
            value={rightTeam.name}
            onChange={(e) => updateRightTeam({ name: e.target.value })}
            className="w-full bg-transparent border-b-2 font-black italic uppercase text-3xl outline-none py-2 text-right"
            style={{ borderBottomColor: rightTeam.color, color: rightTeam.color }}
            placeholder="TEAM 2 NAME"
          />

          <div className="flex flex-row-reverse items-start gap-6 w-full">
            <div className="flex-1">
              <ImageUploader 
                image={rightTeam.image} 
                onChange={(url) => updateRightTeam({ image: url })} 
                accentColor={rightTeam.color}
              />
            </div>
            <ColorPicker 
              color={rightTeam.color} 
              onChange={(color) => updateRightTeam({ color })} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
