"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ConfettiBurstProps {
  play: boolean;
  teamColor: string;
}

interface ConfettiParticle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  color: string;
  isTriangle: boolean;
}

const GRAVITY = 0.2;
const DRAG = 0.98;

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ play, teamColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<ConfettiParticle[]>([]);
  const startTime = useRef<number>(0);

  useEffect(() => {
    if (!play) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle resizing
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const colors = [teamColor, "#ffffff", "#ffd700"];
    
    // Initialize particles originating from top-center
    particles.current = Array.from({ length: 50 }).map(() => {
      const angle = Math.random() * Math.PI + Math.PI; // Upwards hemisphere
      const speed = Math.random() * 8 + 4;
      return {
        x: canvas.width / 2 + (Math.random() - 0.5) * 50,
        y: canvas.height * 0.2, // 20% down from top
        w: Math.random() * 8 + 6,
        h: Math.random() * 12 + 8,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        isTriangle: Math.random() > 0.5,
      };
    });

    startTime.current = performance.now();
    let animationId: number;

    const render = () => {
      const now = performance.now();
      const elapsed = now - startTime.current;
      
      // Total duration 2.5s (2500ms). Fade out in last 500ms
      const duration = 2500;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return; // Done
      }

      let opacity = 1;
      if (elapsed > duration - 500) {
        opacity = 1 - (elapsed - (duration - 500)) / 500;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = Math.max(0, opacity);

      particles.current.forEach(p => {
        // Physics
        p.vy += GRAVITY;
        p.vx *= DRAG;
        p.vy *= DRAG;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.isTriangle) {
          ctx.beginPath();
          ctx.moveTo(-p.w / 2, p.h / 2);
          ctx.lineTo(p.w / 2, p.h / 2);
          ctx.lineTo(0, -p.h / 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        
        ctx.restore();
      });

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [play, teamColor]);

  return (
    <AnimatePresence>
      {play && (
        <motion.canvas
          ref={canvasRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 w-full h-full pointer-events-none z-50"
        />
      )}
    </AnimatePresence>
  );
};
