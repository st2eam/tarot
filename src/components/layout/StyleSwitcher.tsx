"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, X } from "lucide-react";
import { useTarotStore } from "@/store/useTarotStore";
import { CARD_STYLES } from "@/lib/themes";

export default function StyleSwitcher() {
  const [open, setOpen] = useState(false);
  const { cardStyle, setCardStyle } = useTarotStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const current = CARD_STYLES.find((s) => s.id === cardStyle)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm transition-all duration-200"
        style={{
          background: open ? "var(--theme-surface-hover)" : "var(--theme-surface)",
          border: "1px solid var(--theme-border)",
          color: "var(--theme-accent)",
        }}
        title="切换风格"
      >
        <span className="text-base leading-none">{current.emoji}</span>
        <Palette className="h-3.5 w-3.5 opacity-70" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 z-[200] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: "min(340px, calc(100vw - 24px))",
              background: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--theme-border)",
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--theme-border), 0 0 40px var(--theme-glow)`,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid var(--theme-border)" }}
            >
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" style={{ color: "var(--theme-accent)" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--theme-text)" }}>
                  牌面风格
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: "var(--theme-text-muted)" }}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Style Grid */}
            <div className="p-3 grid grid-cols-2 gap-2">
              {CARD_STYLES.map((style) => {
                const isActive = cardStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => {
                      setCardStyle(style.id);
                      setOpen(false);
                    }}
                    className="group relative flex items-start gap-2.5 p-3 rounded-xl text-left transition-all duration-200"
                    style={{
                      background: isActive ? style.theme.surface : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isActive ? style.theme.border : "rgba(255,255,255,0.06)"}`,
                      boxShadow: isActive ? `0 0 12px ${style.theme.accentGlow}` : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.background = style.theme.surface;
                        (e.currentTarget as HTMLButtonElement).style.borderColor = style.theme.border;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.06)";
                      }
                    }}
                  >
                    {/* Color palette dots */}
                    <div className="flex gap-0.5 mt-0.5 shrink-0">
                      {style.palette.slice(0, 3).map((color, i) => (
                        <div
                          key={i}
                          className="rounded-full"
                          style={{
                            width: i === 0 ? 10 : 7,
                            height: i === 0 ? 10 : 7,
                            backgroundColor: color,
                            marginTop: i === 0 ? 0 : 1.5,
                            boxShadow: i === 0 ? `0 0 6px ${color}80` : "none",
                          }}
                        />
                      ))}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-semibold leading-tight" style={{ color: style.theme.textPrimary }}>
                          {style.emoji} {style.nameZh}
                        </span>
                        {isActive && (
                          <Check className="h-3 w-3 ml-auto shrink-0" style={{ color: style.theme.accentPrimary }} />
                        )}
                      </div>
                      <p className="text-[10px] mt-0.5 leading-snug line-clamp-2" style={{ color: style.theme.textMuted }}>
                        {style.descriptionZh}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer hint */}
            <div
              className="px-4 py-2.5 text-center"
              style={{ borderTop: "1px solid var(--theme-border)" }}
            >
              <p className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>
                风格切换同步影响主题配色与卡牌图像
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
