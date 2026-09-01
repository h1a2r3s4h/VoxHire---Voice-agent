import React from "react";
import Link from "next/link";
import { Mic, Sparkles } from "lucide-react";

export default function Logo({ size = "md", href = "/" }) {
  const isLarge = size === "lg";
  const isSmall = size === "sm";

  const content = (
    <div className="flex items-center gap-2.5 group">
      <div
        className={`flex items-center justify-center rounded-xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 group-hover:border-indigo-500/60 transition-colors shadow-sm ${
          isLarge ? "h-11 w-11" : isSmall ? "h-8 w-8" : "h-9.5 w-9.5"
        }`}
      >
        <Mic className={isLarge ? "h-6 w-6" : isSmall ? "h-4 w-4" : "h-5 w-5"} />
      </div>

      <span
        className={`font-extrabold tracking-tight text-white ${
          isLarge ? "text-2xl" : isSmall ? "text-lg" : "text-xl"
        }`}
      >
        Vox<span className="text-indigo-400">Hire</span>
      </span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
