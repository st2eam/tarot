"use client";

import { getMoonPhase } from "@/lib/moon";

export default function MoonIndicator() {
  const moon = getMoonPhase();

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <svg width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="var(--theme-border)" strokeWidth="0.5" />
          <circle
            cx="18" cy="18" r="14"
            fill="var(--theme-accent)"
            opacity={0.08 + moon.illumination * 0.25}
          />
          <text
            x="18" y="18"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="18"
          >
            {moon.emoji}
          </text>
        </svg>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 ${12 + moon.illumination * 20}px var(--theme-glow)`,
            opacity: 0.3 + moon.illumination * 0.4,
          }}
        />
      </div>
      <div>
        <p className="text-xs font-medium" style={{ color: "var(--theme-accent-secondary)" }}>
          {moon.name}
        </p>
        <p className="text-[10px]" style={{ color: "var(--theme-text-muted)", opacity: 0.7 }}>
          {Math.round(moon.illumination * 100)}% 照明
        </p>
      </div>
    </div>
  );
}
