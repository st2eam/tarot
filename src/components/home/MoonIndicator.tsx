"use client";

import { getMoonPhase } from "@/lib/moon";

const PHASE_LABELS: Record<string, string> = {
  "新月": "新生 · 播种",
  "蛾眉月": "萌芽 · 意图",
  "上弦月": "行动 · 突破",
  "盈凸月": "调整 · 完善",
  "满月": "圆满 · 显化",
  "亏凸月": "感恩 · 分享",
  "下弦月": "释放 · 放下",
  "残月": "休息 · 内省",
};

export default function MoonIndicator() {
  const moon = getMoonPhase();
  const subtitle = PHASE_LABELS[moon.name] ?? "";

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid var(--theme-glass-border)",
      }}
    >
      <div className="relative">
        <svg width="28" height="28" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="var(--theme-border)" strokeWidth="0.5" opacity="0.6" />
          <circle
            cx="18" cy="18" r="14"
            fill="var(--theme-accent)"
            opacity={0.06 + moon.illumination * 0.22}
          />
          <text
            x="18" y="18"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="17"
          >
            {moon.emoji}
          </text>
        </svg>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 ${12 + moon.illumination * 18}px var(--theme-glow)`,
            opacity: 0.25 + moon.illumination * 0.35,
          }}
        />
      </div>
      <div className="text-left">
        <p className="text-xs font-semibold leading-tight" style={{ color: "var(--theme-accent-secondary)" }}>
          {moon.name}
        </p>
        {subtitle && (
          <p className="text-[10px] leading-tight" style={{ color: "var(--theme-text-muted)", opacity: 0.7 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
