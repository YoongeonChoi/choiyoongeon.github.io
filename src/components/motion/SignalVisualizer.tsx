"use client";

import { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

interface SignalVisualizerProps {
  energy?: number;
}

const WAVE_COUNT = 4;
const BASE_SPEED = 0.0008;
const PARTICLE_COUNT = 18;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
}

function createParticles(w: number, h: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.15,
    radius: Math.random() * 1.8 + 0.6,
    alpha: Math.random() * 0.4 + 0.1,
    phase: Math.random() * Math.PI * 2,
  }));
}

export function SignalVisualizer({ energy = 0 }: SignalVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const energyRef = useRef(energy);
  const particlesRef = useRef<Particle[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    energyRef.current = energy;
  }, [energy]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
      const dpr = window.devicePixelRatio || 1;
      const cssW = w / dpr;
      const cssH = h / dpr;
      const e = energyRef.current;

      ctx.clearRect(0, 0, w, h);

      const midY = h / 2;
      const amplitude = cssH * (0.22 + e * 0.28);

      for (let i = 0; i < WAVE_COUNT; i++) {
        const freq = 0.003 + i * 0.0012;
        const speed = BASE_SPEED * (1 + i * 0.3 + e * 2);
        const offset = time * speed * 1000;
        const waveAlpha = 0.12 + (WAVE_COUNT - i) * 0.06 - e * 0.02;

        ctx.beginPath();
        ctx.moveTo(0, midY);

        for (let x = 0; x <= w; x += 2) {
          const cssX = x / dpr;
          const envelope =
            Math.sin((cssX / cssW) * Math.PI) *
            (0.7 + 0.3 * Math.sin(cssX * 0.002 + offset * 0.5));
          const y =
            midY +
            Math.sin(cssX * freq + offset + i * 1.2) *
              amplitude *
              envelope *
              dpr;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, midY - amplitude * dpr, 0, h);
        const isAccent = i < 2;
        if (isAccent) {
          grad.addColorStop(
            0,
            `rgba(212, 85, 45, ${waveAlpha * (0.6 + e * 0.4)})`
          );
          grad.addColorStop(0.5, `rgba(212, 85, 45, ${waveAlpha * 0.3})`);
          grad.addColorStop(1, "rgba(212, 85, 45, 0)");
        } else {
          grad.addColorStop(
            0,
            `rgba(17, 97, 73, ${waveAlpha * (0.5 + e * 0.3)})`
          );
          grad.addColorStop(0.5, `rgba(17, 97, 73, ${waveAlpha * 0.2})`);
          grad.addColorStop(1, "rgba(17, 97, 73, 0)");
        }
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const cssX = x / dpr;
          const envelope =
            Math.sin((cssX / cssW) * Math.PI) *
            (0.7 + 0.3 * Math.sin(cssX * 0.002 + offset * 0.5));
          const y =
            midY +
            Math.sin(cssX * freq + offset + i * 1.2) *
              amplitude *
              envelope *
              dpr;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = isAccent
          ? `rgba(212, 85, 45, ${0.25 + e * 0.35})`
          : `rgba(17, 97, 73, ${0.15 + e * 0.25})`;
        ctx.lineWidth = (1 + e * 1.5) * dpr;
        ctx.stroke();
      }

      const particles = particlesRef.current;
      for (const p of particles) {
        p.x += p.vx * (1 + e * 3);
        p.y += p.vy + Math.sin(time * 0.001 + p.phase) * 0.2;

        if (p.x < 0) p.x = w / dpr;
        if (p.x > w / dpr) p.x = 0;
        if (p.y < 0) p.y = h / dpr;
        if (p.y > h / dpr) p.y = 0;

        const px = p.x * dpr;
        const py = p.y * dpr;
        const pr = p.radius * dpr * (1 + e * 0.5);
        const pa = p.alpha * (0.6 + e * 0.8);

        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 85, 45, ${pa})`;
        ctx.fill();
      }

      const scanX = ((time * 0.00015 * (1 + e * 2)) % 1) * w;
      const scanGrad = ctx.createLinearGradient(
        scanX - 30 * dpr,
        0,
        scanX + 30 * dpr,
        0
      );
      scanGrad.addColorStop(0, "rgba(212, 85, 45, 0)");
      scanGrad.addColorStop(0.5, `rgba(212, 85, 45, ${0.06 + e * 0.1})`);
      scanGrad.addColorStop(1, "rgba(212, 85, 45, 0)");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(scanX - 30 * dpr, 0, 60 * dpr, h);
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      particlesRef.current = createParticles(rect.width, rect.height);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reducedMotion) {
      draw(ctx, canvas.width, canvas.height, 4000);
      return () => window.removeEventListener("resize", resize);
    }

    let running = true;
    const loop = (time: number) => {
      if (!running) return;
      draw(ctx, canvas.width, canvas.height, time);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion, draw]);

  return (
    <div className="signal-visualizer">
      <canvas
        ref={canvasRef}
        className="signal-canvas"
        aria-hidden="true"
      />
      <div className="signal-overlay">
        <div className="signal-label">
          <span className="signal-dot" />
          <span>LIVE SIGNAL</span>
        </div>
        <span className="signal-freq">
          {(60 + energy * 180).toFixed(0)} Hz
        </span>
      </div>
    </div>
  );
}
