"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { allCards } from "@/data/tarot-cards";
import { ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";
import CardImage from "@/components/card/CardImage";
import type { TarotCard } from "@/types";

type FilterKey = "all" | "major" | "wands" | "cups" | "swords" | "pentacles";

const FILTERS: { key: FilterKey; label: string; count: number }[] = [
  { key: "all", label: "全部", count: 78 },
  { key: "major", label: "大阿尔卡那", count: 22 },
  { key: "wands", label: "权杖", count: 14 },
  { key: "cups", label: "圣杯", count: 14 },
  { key: "swords", label: "宝剑", count: 14 },
  { key: "pentacles", label: "星币", count: 14 },
];

function filterCards(cards: TarotCard[], filter: FilterKey, query: string): TarotCard[] {
  let result = cards;
  if (filter === "major") {
    result = result.filter((c) => c.arcana === "major");
  } else if (filter !== "all") {
    result = result.filter((c) => c.suit === filter);
  }
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    result = result.filter(
      (c) =>
        c.nameZh.includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.includes(q))
    );
  }
  return result;
}

export default function CardsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const filteredCards = useMemo(
    () => filterCards(allCards, filter, query),
    [filter, query]
  );

  return (
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/")}
            aria-label="返回首页"
            className="shrink-0 p-2 rounded-xl transition-colors hover:bg-zinc-800"
            style={{ color: "var(--theme-text-muted)" }}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--theme-text)" }}>
              牌库
            </h1>
            <p className="text-sm" style={{ color: "var(--theme-text-muted)" }}>
              浏览全部 78 张塔罗牌
            </p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--theme-text-muted)" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索牌名或关键词..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "var(--theme-glass-border)",
                color: "var(--theme-text)",
              }}
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs transition-all whitespace-nowrap ${
                  filter === f.key
                    ? "bg-purple-800/50 text-purple-200 border border-purple-600/30"
                    : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/30 hover:border-purple-700/30"
                }`}
                style={
                  filter === f.key
                    ? {}
                    : { background: "rgba(255,255,255,0.04)", borderColor: "var(--theme-glass-border)" }
                }
              >
                {f.label}
                <span className="ml-1 opacity-50">{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card grid */}
        <motion.div
          key={filter + query}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3"
        >
          {filteredCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <Link
                href={`/card/${card.id}`}
                className="flex flex-col items-center p-2.5 rounded-xl border transition-all block hover:brightness-110"
                style={{
                  borderColor: "var(--theme-glass-border)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-2">
                  <CardImage
                    cardId={card.id}
                    nameZh={card.nameZh}
                    className="absolute inset-0"
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
                    showOverlay={false}
                  />
                  {card.arcana === "major" && (
                    <div
                      className="absolute top-1.5 right-1.5 text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                      style={{
                        background: "rgba(217,169,47,0.2)",
                        color: "#d4a83c",
                      }}
                    >
                      {String(card.number).padStart(2, "0")}
                    </div>
                  )}
                </div>
                <span
                  className="text-xs font-medium text-center leading-tight"
                  style={{ color: "var(--theme-text)" }}
                >
                  {card.nameZh}
                </span>
                <span
                  className="text-[10px] text-center mt-0.5"
                  style={{ color: "var(--theme-text-muted)" }}
                >
                  {card.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredCards.length === 0 && (
          <p className="text-center text-zinc-500 text-sm py-16">未找到匹配的牌</p>
        )}
      </div>
    </div>
  );
}
