"use client";

import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Moving Ambient Glow Orb 1 */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] bg-indigo-600/15 rounded-full blur-[140px] animate-orb-1 opacity-80" />

      {/* Moving Ambient Glow Orb 2 */}
      <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] sm:w-[700px] sm:h-[700px] bg-indigo-900/20 rounded-full blur-[150px] animate-orb-2 opacity-70" />

      {/* Center Subtle Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-indigo-500/5 rounded-full blur-[160px]" />
    </div>
  );
}
