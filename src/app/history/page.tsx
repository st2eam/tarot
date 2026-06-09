"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTarotStore, type ReadingRecord } from "@/store/useTarotStore";
import { ArrowLeft, Clock, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { renderMarkdown } from "@/lib/markdown";

export default function HistoryPage() {
  const router = useRouter();
  const readingHistory = useTarotStore((s) => s.readingHistory);
  const loadReadingHistory = useTarotStore((s) => s.loadReadingHistory);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    loadReadingHistory();
  }, [loadReadingHistory]);

  const records = readingHistory.slice().reverse();

  return (
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 overflow-x-hidden">
      <div className="w-full max-w-2xl min-w-0">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/")}
            aria-label="返回首页"
            className="shrink-0 p-2 rounded-xl transition-colors hover:bg-zinc-800"
            style={{ color: "var(--theme-text-muted)" }}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--theme-text)" }}>
              解读历史
            </h1>
            <p className="text-sm" style={{ color: "var(--theme-text-muted)" }}>
              {readingHistory.length > 0 ? `最近 ${readingHistory.length} 次解读` : "暂无记录"}
            </p>
          </div>
        </div>

        {/* Records */}
        {records.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="h-10 w-10 mx-auto mb-4 opacity-30" style={{ color: "var(--theme-accent)" }} />
            <p className="text-sm" style={{ color: "var(--theme-text-muted)" }}>
              暂无解读历史
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 text-sm px-4 py-2 rounded-xl transition-all hover:brightness-110"
              style={{ background: "var(--theme-accent)", color: "#fff" }}
            >
              开始第一次解读
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record, i) => (
              <HistoryCard
                key={i}
                record={record}
                index={i}
                expanded={expandedId === i}
                onToggle={() => setExpandedId(expandedId === i ? null : i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryCard({
  record,
  index,
  expanded,
  onToggle,
}: {
  record: ReadingRecord;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const date = new Date(record.date);
  const dateStr = date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const hasContent = record.interpretation || record.question;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <button
        onClick={hasContent ? onToggle : undefined}
        className={`w-full text-left glass-card rounded-xl transition-all ${
          hasContent ? "cursor-pointer hover:brightness-105" : "cursor-default"
        }`}
        style={{ border: "1px solid var(--theme-glass-border)" }}
      >
        {/* Summary row — always visible */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm" style={{ color: "var(--theme-accent-secondary)" }}>
              {record.spreadName}
            </h3>
            <div className="flex items-center gap-1 text-xs shrink-0 ml-2" style={{ color: "var(--theme-text-muted)" }}>
              <Clock className="h-3 w-3" />
              {dateStr}
            </div>
          </div>

          {record.question && (
            <p className="text-xs mb-2 italic" style={{ color: "var(--theme-text-muted)", opacity: 0.8 }}>
              「{record.question}」
            </p>
          )}

          <div className="flex flex-wrap gap-1.5">
            {record.cards.map((c, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--theme-glass-border)",
                  color: c.orientation === "upright" ? "var(--theme-text)" : "var(--theme-text-muted)",
                }}
              >
                {c.position}: {c.name}
                {c.orientation === "reversed" ? " (逆)" : ""}
              </span>
            ))}
          </div>

          {hasContent && (
            <div className="flex items-center justify-center mt-2">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                style={{ color: "var(--theme-text-muted)", opacity: 0.5 }}
              />
            </div>
          )}
        </div>

        {/* Expandable interpretation */}
        <AnimatePresence initial={false}>
          {expanded && hasContent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className="px-4 pb-4 mx-4 mb-4 rounded-xl"
                style={{
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid var(--theme-glass-border)",
                }}
              >
                {record.question && (
                  <div className="pt-3 mb-3">
                    <p className="text-[10px] font-semibold mb-1" style={{ color: "var(--theme-accent-secondary)" }}>
                      你的问题
                    </p>
                    <p className="text-sm" style={{ color: "var(--theme-text)" }}>
                      {record.question}
                    </p>
                  </div>
                )}
                {record.interpretation && (
                  <div className={`${record.question ? "" : "pt-3"}`}>
                    <p className="text-[10px] font-semibold mb-2" style={{ color: "var(--theme-accent-secondary)" }}>
                      AI 解读
                    </p>
                    <div className="interpretation-text text-sm leading-relaxed" style={{ color: "var(--theme-text)" }}>
                      {renderMarkdown(record.interpretation)}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
