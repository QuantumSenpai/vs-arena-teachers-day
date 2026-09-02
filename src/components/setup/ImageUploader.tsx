"use client";

import React, { useCallback, useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, X, RefreshCw } from "lucide-react";
import { compressAndResizeImage } from "@/lib/imageUtils";

interface ImageUploaderProps {
  image: string;
  onChange: (imageUrl: string) => void;
  accentColor: string;
  variant?: "circle" | "card";
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  image,
  onChange,
  accentColor,
  variant = "circle",
  label,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      try {
        setIsCompressing(true);
        const compressedUrl = await compressAndResizeImage(file, 1200, 0.85);
        onChange(compressedUrl);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  if (variant === "circle") {
    return (
      <div className="flex flex-col items-center gap-3">
        {label && (
          <span className="text-xs font-black tracking-widest uppercase text-zinc-400">
            {label}
          </span>
        )}

        <div
          className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden select-none active:scale-95 group focus:outline-none ${
            image
              ? "border-2 border-solid" // FIX: Clean solid glowing ring when image is uploaded (NO dashed border)
              : "border-2 border-dashed bg-black/60 hover:bg-zinc-900/80"
          } ${isDragging ? "bg-zinc-800 scale-105" : ""}`}
          style={{
            borderColor: image ? accentColor : isDragging ? accentColor : `${accentColor}80`,
            boxShadow: image
              ? `0 0 25px ${accentColor}50, inset 0 0 15px rgba(0,0,0,0.5)`
              : `0 0 20px ${accentColor}25`,
          }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={onFileChange}
          />

          {image ? (
            <>
              {/* Full Bleed Circular Image Preview (Object position center-top so faces are clear) */}
              <div
                className="absolute inset-0 bg-cover bg-[center_top] rounded-full"
                style={{ backgroundImage: `url(${image})` }}
              />

              {/* Tint overlay matching team color */}
              <div
                className="absolute inset-0 rounded-full opacity-15 pointer-events-none"
                style={{ backgroundColor: accentColor }}
              />

              {/* Interactive Tap to Replace Overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center rounded-full backdrop-blur-[2px]">
                <RefreshCw size={24} className="text-white mb-1" />
                <span className="text-white text-xs font-black uppercase tracking-wider">
                  Replace Photo
                </span>
              </div>

              {/* Quick Remove Button: 44x44px touch target for smartboard touch screens */}
              <button
                type="button"
                className="absolute top-2 right-2 z-10 min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center bg-black/85 rounded-full text-white hover:bg-red-600 active:scale-90 transition-all border border-white/20 shadow-md cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                title="Remove image"
                aria-label="Remove photo"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              {isCompressing ? (
                <div className="flex flex-col items-center">
                  <RefreshCw size={28} className="text-white animate-spin mb-2" />
                  <span className="text-xs font-bold text-zinc-300">Processing...</span>
                </div>
              ) : (
                <>
                  <div
                    className="p-3 rounded-full mb-2 bg-zinc-900/90 border border-white/10 group-hover:scale-110 transition-transform"
                    style={{ color: accentColor }}
                  >
                    <ImageIcon size={28} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-zinc-200 leading-tight">
                    DRAG & DROP IMAGE HERE
                  </span>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 mt-1">
                    or click to browse
                  </span>
                </>
              )}
            </div>
          )}

          {/* Subtle Outer Interactive Pulse Ring */}
          <div
            className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none"
            style={{
              border: `1px solid ${accentColor}`,
              filter: "blur(3px)",
            }}
          />
        </div>
      </div>
    );
  }

  // Fallback card variant
  return (
    <div className="flex flex-col gap-2 w-full">
      <div
        className={`relative w-full h-44 rounded-xl flex flex-col items-center justify-center overflow-hidden transition-all duration-300 cursor-pointer ${
          image ? "border-2 border-solid" : "border-2 border-dashed bg-black/50 hover:bg-zinc-900"
        } ${isDragging ? "bg-zinc-800 scale-[1.02]" : ""}`}
        style={{ borderColor: isDragging ? accentColor : image ? accentColor : "#3f3f46" }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileChange}
        />

        {image ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-[center_top]"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
              <UploadCloud size={32} className="text-white mb-2" />
              <span className="text-white font-bold">Replace Image</span>
            </div>
            <button
              type="button"
              className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-zinc-400">
            <div className="p-4 rounded-full bg-zinc-800 mb-3" style={{ color: accentColor }}>
              <ImageIcon size={32} />
            </div>
            <span className="font-semibold text-sm">Drag & Drop Image Here</span>
            <span className="text-xs mt-1 text-zinc-500">or click to browse</span>
          </div>
        )}
      </div>
    </div>
  );
};
