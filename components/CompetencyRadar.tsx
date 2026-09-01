"use client";

import React from "react";

interface CompetencyScores {
  technicalDepth: number;
  problemSolving: number;
  communicationClarity: number;
  confidenceVelocity: number;
  roleFit: number;
}

interface CompetencyRadarProps {
  scores: CompetencyScores;
  size?: number;
}

export default function CompetencyRadar({
  scores,
  size = 280,
}: CompetencyRadarProps) {
  const center = size / 2;
  const radius = size * 0.35;

  const axes = [
    { label: "Technical Depth", key: "technicalDepth" as const },
    { label: "Problem Solving", key: "problemSolving" as const },
    { label: "Clarity", key: "communicationClarity" as const },
    { label: "Confidence", key: "confidenceVelocity" as const },
    { label: "Role Fit", key: "roleFit" as const },
  ];

  const totalAxes = axes.length;
  const angleStep = (Math.PI * 2) / totalAxes;

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (valueNormalized: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * valueNormalized;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points string for scores
  const polygonPoints = axes
    .map((axis, i) => {
      const score = Math.min(Math.max(scores[axis.key] || 0, 0), 10);
      const norm = score / 10;
      const { x, y } = getCoordinates(norm, i);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md">
          360° Competency Radar
        </span>
      </div>

      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid Pentagons */}
        {levels.map((level, lvlIdx) => {
          const points = axes
            .map((_, i) => {
              const { x, y } = getCoordinates(level, i);
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <polygon
              key={lvlIdx}
              points={points}
              className="fill-none stroke-zinc-800/80 stroke-1"
              strokeDasharray={lvlIdx < levels.length - 1 ? "2,2" : undefined}
            />
          );
        })}

        {/* Radial Axis Lines */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(1.0, i);
          const labelCoords = getCoordinates(1.22, i);
          const val = Math.min(Math.max(scores[axis.key] || 0, 0), 10);

          return (
            <g key={i}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                className="stroke-zinc-800 stroke-1"
              />
              <text
                x={labelCoords.x}
                y={labelCoords.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-zinc-400 text-[10px] font-semibold tracking-tight"
              >
                {axis.label} ({val})
              </text>
            </g>
          );
        })}

        {/* Data Radar Polygon */}
        <polygon
          points={polygonPoints}
          className="fill-indigo-500/25 stroke-indigo-400 stroke-2"
        />

        {/* Data Dots */}
        {axes.map((axis, i) => {
          const score = Math.min(Math.max(scores[axis.key] || 0, 0), 10);
          const norm = score / 10;
          const { x, y } = getCoordinates(norm, i);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={4}
              className="fill-indigo-400 stroke-white stroke-1"
            />
          );
        })}
      </svg>
    </div>
  );
}
