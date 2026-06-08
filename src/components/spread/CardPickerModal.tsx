"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check, ArrowUp, ArrowDown } from "lucide-react";
import { SpreadDefinition, Orientation, TarotCard } from "@/types";
import { allCards } from "@/data/tarot-cards";
import { CustomCardSelection } from "@/lib/deck";
import CardImage from "@/components/card/CardImage";

interface Props {
  spread: SpreadDefinition;
  open: boolean;
  onClose: () => void;
  onConfirm: (selections: CustomCardSelection[]) => void;
}

type FilterKey = "all" | "major" | "wands" | "cups" | "swords" | "pentacles";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "major", label: "大阿尔卡那" },
  { key: "wands", label: "权杖" },
  { key: "cups", label: "圣杯" },
  { key: "swords", label: "宝剑" },
  { key: "pentacles", label: "星币" },
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

export default function CardPickerModal({ spread, open, onClose, onConfirm }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [orientation, setOrientation] = useState<Orientation>("upright");
  const [selections, setSelections] = useState<(CustomCardSelection | null)[]>(
    () => spread.positions.map(() => null)
  );

  const filteredCards = useMemo(
    () => filterCards(allCards, filter, query),
    [filter, query]
  );

  const usedCardIds = useMemo(
    () =>
      new Set(
        selections
          .map((s, i) => (i !== activeIndex && s ? s.cardId : null))
          .filter(Boolean) as string[]
      ),
    [selections, activeIndex]
  );

  const allFilled = selections.every((s) => s !== null);

  const handleSelectCard = (cardId: string) => {
    setSelections((prev) => {
      const next = [...prev];
      next[activeIndex] = { cardId, orientation };
      return next;
    });
    if (activeIndex < spread.positions.length - 1) {
      setActiveIndex((i) => i + 1);
    }
  };

  const handleConfirm = () => {
    if (!allFilled) return;
    onConfirm(selections as CustomCardSelection[]);
    onClose();
  };

  const handleClose = () => {
    setActiveIndex(0);
    setFilter("all");
    setQuery("");
    setOrientation("upright");
    setSelections(spread.positions.map(() => null));
    onClose();
  };

  const activePosition = spread.positions[activeIndex];
  const activeSelection = selections[activeIndex];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="bg-zinc-900 border border-purple-700/30 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-purple-800/20 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-purple-100">自定义选牌</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  为每个牌位选择塔罗牌及正逆位
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Position tabs */}
            <div className="flex gap-2 px-5 py-3 overflow-x-auto shrink-0 border-b border-purple-800/15">
              {spread.positions.map((pos, i) => {
                const sel = selections[i];
                const card = sel ? allCards.find((c) => c.id === sel.cardId) : null;
                const isActive = i === activeIndex;
                return (
                  <button
                    key={pos.id}
                    onClick={() => setActiveIndex(i)}
                    className={`shrink-0 flex flex-col items-start px-3 py-2 rounded-xl border transition-all text-left min-w-[100px] ${
                      isActive
                        ? "border-purple-500/60 bg-purple-900/30"
                        : sel
                          ? "border-purple-700/30 bg-zinc-800/50"
                          : "border-zinc-700/40 bg-zinc-800/30 hover:border-purple-700/40"
                    }`}
                  >
                    <span className="text-[10px] text-purple-400/70">{pos.name}</span>
                    {card ? (
                      <span className="text-xs font-medium text-zinc-200 mt-0.5 flex items-center gap-1">
                        {card.nameZh}
                        {sel?.orientation === "reversed" && (
                          <ArrowDown className="h-3 w-3 text-zinc-400" />
                        )}
                        <Check className="h-3 w-3 text-emerald-400" />
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-500 mt-0.5">待选择</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active position + orientation */}
            <div className="flex items-center justify-between px-5 py-3 shrink-0 bg-zinc-800/30">
              <div>
                <span className="text-sm font-medium text-purple-200">
                  {activePosition.name}
                </span>
                <span className="text-xs text-zinc-500 ml-2">
                  {activeIndex + 1} / {spread.positions.length}
                </span>
                <p className="text-xs text-zinc-500 mt-0.5">{activePosition.description}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    setOrientation("upright");
                    if (activeSelection) {
                      setSelections((prev) => {
                        const next = [...prev];
                        next[activeIndex] = { ...activeSelection, orientation: "upright" };
                        return next;
                      });
                    }
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    (activeSelection?.orientation ?? orientation) === "upright"
                      ? "bg-purple-700/50 text-purple-100 border border-purple-500/40"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700/50 hover:border-purple-700/40"
                  }`}
                >
                  <ArrowUp className="h-3 w-3" />
                  正位
                </button>
                <button
                  onClick={() => {
                    setOrientation("reversed");
                    if (activeSelection) {
                      setSelections((prev) => {
                        const next = [...prev];
                        next[activeIndex] = { ...activeSelection, orientation: "reversed" };
                        return next;
                      });
                    }
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    (activeSelection?.orientation ?? orientation) === "reversed"
                      ? "bg-zinc-700/60 text-zinc-200 border border-zinc-500/40"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700/50 hover:border-zinc-600/40"
                  }`}
                >
                  <ArrowDown className="h-3 w-3" />
                  逆位
                </button>
              </div>
            </div>

            {/* Search + filters */}
            <div className="px-5 py-3 flex flex-col sm:flex-row gap-3 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索牌名或关键词..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700/50 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-purple-600/50"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      filter === f.key
                        ? "bg-purple-800/50 text-purple-200 border border-purple-600/30"
                        : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/30 hover:border-purple-700/30"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card grid */}
            <div className="flex-1 overflow-y-auto px-5 pb-3">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {filteredCards.map((card) => {
                  const isUsed = usedCardIds.has(card.id);
                  const isSelected = activeSelection?.cardId === card.id;
                  const isMajor = card.arcana === "major";

                  return (
                    <button
                      key={card.id}
                      disabled={isUsed}
                      onClick={() => handleSelectCard(card.id)}
                      className={`relative flex flex-col items-center p-2 rounded-xl border transition-all text-center ${
                        isSelected
                          ? "border-purple-500 bg-purple-900/40 shadow-lg shadow-purple-900/20"
                          : isUsed
                            ? "border-zinc-800 bg-zinc-900/50 opacity-40 cursor-not-allowed"
                            : "border-zinc-700/40 bg-zinc-800/40 hover:border-purple-600/50 hover:bg-purple-900/20"
                      }`}
                    >
                      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-1.5 border border-zinc-700/30">
                        <CardImage
                          cardId={card.id}
                          nameZh={card.nameZh}
                          className="absolute inset-0"
                          sizes="80px"
                          showOverlay={false}
                        />
                      </div>
                      <span className="text-xs font-medium text-zinc-200 leading-tight">
                        {card.nameZh}
                      </span>
                      <span className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                        {card.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {filteredCards.length === 0 && (
                <p className="text-center text-zinc-500 text-sm py-8">未找到匹配的牌</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-purple-800/20 shrink-0 bg-zinc-900/80">
              <span className="text-xs text-zinc-500">
                已选 {selections.filter(Boolean).length} / {spread.positions.length} 张
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!allFilled}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    allFilled
                      ? "bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-lg shadow-purple-900/30 hover:shadow-purple-800/40"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  确认选牌
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
