"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { allCards } from "@/data/tarot-cards";
import CardImage from "@/components/card/CardImage";
import CardDetailModal from "@/components/card/CardDetailModal";
import { useChatStore } from "@/store/useChatStore";
import { Sparkles, ArrowUpRight } from "lucide-react";
import type { Orientation } from "@/types";

function hashDate(dateStr: string): number {
  let hash = 0;
  const seed = dateStr + "mystic-tarot";
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getDailyCard() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const hash = hashDate(dateStr);
  const cardIndex = hash % allCards.length;
  const orientation: Orientation = (hash >> 8) % 3 === 0 ? "reversed" : "upright";
  return { card: allCards[cardIndex], orientation };
}

export default function DailyCard() {
  const { card, orientation } = getDailyCard();
  const [modalOpen, setModalOpen] = useState(false);
  const setContext = useChatStore((s) => s.setContext);
  const isUpright = orientation === "upright";
  const meaning = isUpright ? card.meaning.upright : card.meaning.reversed;
  const shortMeaning = meaning.length > 80 ? meaning.slice(0, 80) + "…" : meaning;

  useEffect(() => {
    setContext({ type: "daily-card", card, orientation });
  }, [card, orientation, setContext]);

  const today = new Date();
  const dateLabel = `${today.getMonth() + 1}月${today.getDate()}日`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.01]"
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(20,10,50,0.3))",
          border: "1px solid var(--theme-glass-border)",
        }}
        onClick={() => setModalOpen(true)}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Card image */}
          <div
            className="shrink-0 flex items-center justify-center py-5 sm:py-0 sm:pl-5 sm:w-[140px]"
          >
            <div
              className="rounded-xl overflow-hidden relative"
              style={{
                width: 80,
                height: 128,
                border: "1px solid var(--theme-border)",
                boxShadow: "0 4px 20px rgba(139,92,246,0.15)",
              }}
            >
              <CardImage
                cardId={card.id}
                nameZh={card.nameZh}
                orientation={orientation}
                className="absolute inset-0"
                sizes="80px"
                showOverlay={false}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 p-5 sm:py-5 sm:pr-5 sm:pl-0">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--theme-accent)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--theme-accent-secondary)" }}>
                今日一牌 · {dateLabel}
              </span>
            </div>
            <h3 className="font-serif-zh text-xl font-bold mb-1" style={{ color: "var(--theme-text)" }}>
              {card.nameZh}
              {!isUpright && (
                <span className="text-sm font-normal ml-2" style={{ color: "var(--theme-text-muted)" }}>
                  逆位
                </span>
              )}
            </h3>
            <p className="text-xs mb-3" style={{ color: "var(--theme-text-muted)" }}>
              {card.name}
              {card.arcana === "major" ? " · 大阿尔卡那" : ` · ${card.element === "water" ? "水" : card.element === "fire" ? "火" : card.element === "air" ? "风" : card.element === "earth" ? "土" : ""}元素`}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--theme-text)", opacity: 0.8 }}>
              {shortMeaning}
            </p>
            <div className="flex items-center gap-1 mt-3 text-xs" style={{ color: "var(--theme-accent)", opacity: 0.7 }}>
              查看详情 <ArrowUpRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </motion.div>

      <CardDetailModal
        card={card}
        orientation={orientation}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
