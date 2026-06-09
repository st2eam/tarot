"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SpreadDefinition } from "@/types";
import { ArrowRight, Sparkles, Heart, Grid3X3 } from "lucide-react";

interface Props {
  spreads: SpreadDefinition[];
}

const spreadMeta: Record<string, { icon: React.ReactNode; gradient: string }> = {
  single: {
    icon: <Sparkles className="h-5 w-5" />,
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))",
  },
  "three-card": {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="1" y="2" width="5" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
        <rect x="7.5" y="2" width="5" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
        <rect x="14" y="2" width="5" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1" y="11" width="5" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
        <rect x="7.5" y="11" width="5" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
        <rect x="14" y="11" width="5" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(147,112,219,0.2), rgba(147,112,219,0.05))",
  },
  relationship: {
    icon: <Heart className="h-5 w-5" />,
    gradient: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.03))",
  },
  "celtic-cross": {
    icon: <Grid3X3 className="h-5 w-5" />,
    gradient: "linear-gradient(135deg, rgba(217,169,47,0.18), rgba(217,169,47,0.04))",
  },
};

export default function SpreadSelector({ spreads }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {spreads.map((spread, index) => {
        const meta = spreadMeta[spread.id];
        return (
          <motion.div
            key={spread.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.35 }}
          >
            <Link
              href={`/spread/${spread.id}`}
              className="group block rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: meta?.gradient ?? "rgba(255,255,255,0.03)",
                border: "1px solid var(--theme-glass-border)",
              }}
            >
              {/* Icon + name row */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "var(--theme-accent-secondary)",
                  }}
                >
                  {meta?.icon ?? <Sparkles className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-serif-zh text-base font-semibold leading-tight"
                    style={{ color: "var(--theme-text)" }}
                  >
                    {spread.nameZh}
                  </h3>
                  <p className="text-xs" style={{ color: "var(--theme-text-muted)" }}>
                    {spread.name}
                  </p>
                </div>
                <ArrowRight
                  className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                  style={{ color: "var(--theme-accent)" }}
                />
              </div>

              {/* Description */}
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "var(--theme-text)", opacity: 0.75 }}
              >
                {spread.description}
              </p>

              {/* Card count + position preview */}
              <div className="flex items-center gap-3">
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "var(--theme-accent-secondary)",
                    border: "1px solid var(--theme-glass-border)",
                  }}
                >
                  {spread.cardCount} 张牌
                </span>
                <div className="flex gap-1">
                  {spread.positions.slice(0, 5).map((pos) => (
                    <span
                      key={pos.id}
                      className="text-[10px] opacity-50"
                      style={{ color: "var(--theme-text-muted)" }}
                    >
                      {pos.name}
                    </span>
                  ))}
                  {spread.positions.length > 5 && (
                    <span className="text-[10px] opacity-30" style={{ color: "var(--theme-text-muted)" }}>
                      +{spread.positions.length - 5}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
