"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import { useTarotStore } from "@/store/useTarotStore";
import ExportButton from "@/components/spread/ExportButton";

interface Props {
  visible: boolean;
  exportRef: React.RefObject<HTMLDivElement | null>;
}

export default function InterpretationPanel({ visible, exportRef }: Props) {
  // Subscribe to interpretation directly — isolates re-renders from the rest of the page
  const text = useTarotStore((s) => s.interpretation);
  const isStreaming = useTarotStore((s) => s.isStreaming);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll during streaming
  if (isStreaming && bottomRef.current) {
    bottomRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (!visible && !text) return null;

  const rendered = text ? renderMarkdown(text) : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-full max-w-3xl mt-8 mx-auto"
        >
          <div
            className="rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm"
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid var(--theme-border)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--theme-accent-secondary)" }}>✨ AI 解读</h3>
              {isStreaming && (
                <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--theme-accent)" }} />
              )}
            </div>

            <div className="leading-relaxed">
              {text ? (
                rendered
              ) : (
                <span className="text-sm" style={{ color: "var(--theme-text-muted)" }}>等待解读...</span>
              )}
              {isStreaming && (
                <span
                  className="inline-block w-2 h-4 ml-0.5 animate-pulse align-middle"
                  style={{ background: "var(--theme-accent)" }}
                />
              )}
            </div>

            {/* Export button at bottom, shown after streaming finishes */}
            {!isStreaming && text && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex justify-end"
              >
                <ExportButton exportRef={exportRef} />
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
