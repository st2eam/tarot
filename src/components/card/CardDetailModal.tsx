"use client";

import { TarotCard, Orientation } from "@/types";
import CardIllustration, { ElementBadge } from "./CardIllustration";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  card: TarotCard | null;
  orientation: Orientation;
  open: boolean;
  onClose: () => void;
}

export default function CardDetailModal({ card, orientation, open, onClose }: Props) {
  if (!card) return null;

  const isUpright = orientation === "upright";
  const meaning = isUpright ? card.meaning.upright : card.meaning.reversed;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-zinc-800 border border-purple-700/30 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="sticky top-0 flex justify-end p-3 bg-gradient-to-b from-zinc-800 to-transparent z-10">
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 pb-6 pt-0">
              {/* Illustration */}
              <div className="flex justify-center -mt-2 mb-4">
                <CardIllustration card={card} size="lg" />
              </div>

              {/* Title */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-purple-50 mb-1">
                  {card.nameZh}
                </h2>
                <p className="text-zinc-400 text-sm">{card.name}</p>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <span className="text-xs px-2 py-1 rounded-full bg-purple-800/40 text-purple-200 border border-purple-600/20">
                  {card.arcana === "major" ? "大阿尔卡那" : "小阿尔卡那"}
                </span>
                {card.suit && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-800/40 text-purple-200 border border-purple-600/20 capitalize">
                    {card.suit === "wands" && "权杖"}
                    {card.suit === "cups" && "圣杯"}
                    {card.suit === "swords" && "宝剑"}
                    {card.suit === "pentacles" && "星币"}
                  </span>
                )}
                <ElementBadge element={card.element} />
                <span
                  className={`text-xs px-2 py-1 rounded-full border font-medium ${
                    isUpright
                      ? "bg-purple-800/40 text-purple-200 border-purple-600/20"
                      : "bg-zinc-700/60 text-zinc-200 border-zinc-600/30"
                  }`}
                >
                  {isUpright ? "正位 ↑" : "逆位 ↓"}
                </span>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {card.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs px-2 py-0.5 rounded-full bg-purple-800/30 text-purple-200 border border-purple-700/20"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {/* Meaning */}
              <div className="bg-zinc-900/70 rounded-xl p-4 border border-purple-700/15 mb-3">
                <h3 className="text-sm font-semibold text-purple-200 mb-2">
                  {isUpright ? "正位含义" : "逆位含义"}
                </h3>
                <p className="text-zinc-200 text-sm leading-relaxed">{meaning}</p>
              </div>

              {/* Description */}
              <div className="bg-zinc-900/70 rounded-xl p-4 border border-purple-700/15">
                <h3 className="text-sm font-semibold text-purple-200 mb-2">
                  牌面描述
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
