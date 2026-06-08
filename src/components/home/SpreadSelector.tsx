"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SpreadDefinition } from "@/types";
import { ArrowRight } from "lucide-react";

interface Props {
  spreads: SpreadDefinition[];
}

export default function SpreadSelector({ spreads }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl w-full">
      {spreads.map((spread, index) => (
        <motion.div
          key={spread.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
        >
          <Link
            href={`/spread/${spread.id}`}
            className="group block rounded-2xl p-6 transition-all duration-300"
            style={{
              background: "var(--theme-surface)",
              border: "1px solid var(--theme-border)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--theme-surface-hover)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--theme-border-hover)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px var(--theme-glow)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--theme-surface)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--theme-border)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold transition-colors" style={{ color: "var(--theme-text)" }}>
                {spread.nameZh}
              </h3>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-all mt-0.5" style={{ color: "var(--theme-accent)" }} />
            </div>
            <p className="text-sm mb-3" style={{ color: "var(--theme-text-muted)" }}>{spread.name}</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--theme-text)" }}>{spread.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--theme-surface-hover)",
                  color: "var(--theme-accent-secondary)",
                  border: "1px solid var(--theme-border)",
                }}
              >
                {spread.cardCount} 张牌
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
