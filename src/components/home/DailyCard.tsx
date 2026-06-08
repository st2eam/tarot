"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { allCards } from "@/data/tarot-cards";
import CardImage from "@/components/card/CardImage";
import CardDetailModal from "@/components/card/CardDetailModal";
import { useChatStore } from "@/store/useChatStore";
import { Sparkles } from "lucide-react";
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
  const shortMeaning = meaning.length > 60 ? meaning.slice(0, 60) + "…" : meaning;

  useEffect(() => {
    setContext({ type: "daily-card", card, orientation });
  }, [card, orientation, setContext]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="glass-card glass-card-hover rounded-2xl p-5 sm:p-6 cursor-pointer max-w-md w-full"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4" style={{ color: "var(--theme-accent)" }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--theme-accent-secondary)" }}>
            今日一牌
          </h2>
        </div>

        <div className="flex gap-4 items-start">
          <div
            className="rounded-xl overflow-hidden shrink-0"
            style={{
              width: 72,
              height: 112,
              border: "1px solid var(--theme-border)",
              position: "relative",
            }}
          >
            <CardImage
              cardId={card.id}
              nameZh={card.nameZh}
              orientation={orientation}
              className="absolute inset-0"
              sizes="72px"
              showOverlay={false}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-serif-zh text-lg font-bold mb-1" style={{ color: "var(--theme-text)" }}>
              {card.nameZh}
            </h3>
            <p className="text-xs mb-2" style={{ color: "var(--theme-text-muted)" }}>
              {card.name} ·{" "}
              <span style={{ color: isUpright ? "var(--theme-accent-secondary)" : "var(--theme-text-muted)" }}>
                {isUpright ? "正位" : "逆位"}
              </span>
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--theme-text)", opacity: 0.85 }}>
              {shortMeaning}
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--theme-accent)", opacity: 0.7 }}>
              点击查看详情 →
            </p>
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
