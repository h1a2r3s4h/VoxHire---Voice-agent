"use client";

import React, { useEffect, useRef } from "react";

interface AudioWaveVisualizerProps {
  isActive: boolean;
  color?: string;
}

export default function AudioWaveVisualizer({
  isActive,
  color = "#6366f1",
}: AudioWaveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phases = [0, 0.5, 1, 1.5, 2];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 16;
      const barWidth = 4;
      const gap = 3;
      const totalWidth = barCount * (barWidth + gap);
      const startX = (canvas.width - totalWidth) / 2;

      ctx.fillStyle = isActive ? color : "#3f3f46";

      for (let i = 0; i < barCount; i++) {
        const x = startX + i * (barWidth + gap);
        let barHeight = 4;

        if (isActive) {
          // Dynamic wave oscillation
          const time = Date.now() * 0.005;
          const sine = Math.sin(time + i * 0.4);
          barHeight = Math.max(6, (sine + 1) * 12 + Math.random() * 4);
        }

        const y = (canvas.height - barHeight) / 2;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive, color]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={32}
      className="inline-block"
      data-testid="audio-wave-visualizer"
    />
  );
}
