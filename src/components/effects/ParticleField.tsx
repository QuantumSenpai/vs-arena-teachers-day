"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export interface ParticleFieldRef {
  triggerBurst: () => void;
}

interface ParticleFieldProps {
  color: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  life: number;
  maxLife: number;
  isBurst: boolean;
  burstVx: number;
  burstVy: number;
}

const MAX_PARTICLES = 32; // Strictly capped at 30-40 for classroom hardware performance

export const ParticleField = forwardRef<ParticleFieldRef, ParticleFieldProps>(({ color }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const isBursting = useRef(false);
  const burstEndTime = useRef(0);

  const initParticle = (canvas: HTMLCanvasElement, forceBurst = false): Particle => {
    const isBurst = forceBurst || (isBursting.current && performance.now() < burstEndTime.current);

    if (isBurst) {
      // Radial burst radiating from center
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 3;
      return {
        x: canvas.width / 2 + (Math.random() - 0.5) * 40,
        y: canvas.height / 2 + (Math.random() - 0.5) * 40,
        size: Math.random() * 5 + 2.5,
        speedY: 0,
        speedX: 0,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 35 + 35,
        isBurst: true,
        burstVx: Math.cos(angle) * speed,
        burstVy: Math.sin(angle) * speed,
      };
    } else {
      // Controlled idle particle: upward drift gently converging toward center seam
      const startX = Math.random() * canvas.width;
      const targetCenter = canvas.width / 2;
      const convergeSpeed = (targetCenter - startX) * 0.0006;

      return {
        x: startX,
        y: canvas.height + Math.random() * 80,
        size: Math.random() * 3.5 + 2,
        speedY: -(Math.random() * 0.7 + 0.35),
        speedX: convergeSpeed + (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.3,
        life: 0,
        maxLife: Math.random() * 260 + 140,
        isBurst: false,
        burstVx: 0,
        burstVy: 0,
      };
    }
  };

  useImperativeHandle(ref, () => ({
    triggerBurst: () => {
      isBursting.current = true;
      burstEndTime.current = performance.now() + 500;

      const canvas = canvasRef.current;
      if (!canvas) return;

      particles.current = Array.from({ length: MAX_PARTICLES }).map(() => initParticle(canvas, true));
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (particles.current.length === 0) {
        particles.current = Array.from({ length: MAX_PARTICLES }).map(() => initParticle(canvas));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isBursting.current && performance.now() > burstEndTime.current) {
        isBursting.current = false;
      }

      particles.current.forEach((p, index) => {
        p.life += 1;

        if (p.isBurst) {
          p.x += p.burstVx;
          p.y += p.burstVy;
          p.burstVx *= 0.94;
          p.burstVy *= 0.94;
          p.opacity = Math.max(0, 1 - p.life / p.maxLife);
        } else {
          p.y += p.speedY;
          p.x += p.speedX;
          const progress = p.life / p.maxLife;
          if (progress < 0.2) {
            p.opacity = (progress / 0.2) * 0.7;
          } else if (progress > 0.8) {
            p.opacity = ((1 - progress) / 0.2) * 0.7;
          }
        }

        // Fast hardware-accelerated 2-pass drawing (no expensive software shadowBlur rasterization)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.opacity * 0.75;
        ctx.fill();

        // Subtle outer halo without software blur overhead
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
        ctx.globalAlpha = p.opacity * 0.2;
        ctx.fill();

        ctx.globalAlpha = 1.0;

        if (p.life >= p.maxLife || p.y < -30 || p.x < -30 || p.x > canvas.width + 30) {
          particles.current[index] = initParticle(canvas);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      style={{ mixBlendMode: "screen", pointerEvents: "none" }}
    />
  );
});

ParticleField.displayName = "ParticleField";
