"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SpreadDefinition } from "@/types";
import { ArrowRight } from "lucide-react";

interface Props {
  spreads: SpreadDefinition[];
}

const SPREAD_GROUPS = [
  { label: "入门", ids: ["single"] },
  { label: "经典", ids: ["three-card", "relationship"] },
  { label: "进阶", ids: ["celtic-cross", "horseshoe"] },
];

export default function SpreadSelector({ spreads }: Props) {
  return (
    <div className="w-full max-w-4xl space-y-8">
      {SPREAD_GROUPS.map((group) => {
        const groupSpreads = group.ids
          .map((id) => spreads.find((s) => s.id === id))
          .filter(Boolean) as SpreadDefinition[];
        if (groupSpreads.length === 0) return null;

        return (
          <div key={group.label}>
            <h3
              className="text-xs font-semibold tracking-widest uppercase mb-3 ml-1"
              style={{ color: "var(--theme-text-muted)", opacity: 0.6 }}
            >
              {group.label}
            </h3>
            <div className="flex flex-wrap gap-4">
              {groupSpreads.map((spread, index) => (
                <motion.div
                  key={spread.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                  className="w-full sm:w-[calc(50%-8px)]"
                >
                  <Link
                    href={`/spread/${spread.id}`}
                    className="group block rounded-2xl p-5 transition-all duration-300 glass-card glass-card-hover"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-serif-zh text-base font-semibold" style={{ color: "var(--theme-text)" }}>
                        {spread.nameZh}
                      </h4>
                      <ArrowRight
                        className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                        style={{ color: "var(--theme-accent)" }}
                      />
                    </div>
                    <p className="text-xs mb-2" style={{ color: "var(--theme-text-muted)" }}>{spread.name}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--theme-text)", opacity: 0.8 }}>
                      {spread.description}
                    </p>
                    <div className="mt-3">
                      <span
                        className="text-[11px] px-2.5 py-1 rounded-full glass-card"
                        style={{ color: "var(--theme-accent-secondary)" }}
                      >
                        {spread.cardCount} 张牌
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
