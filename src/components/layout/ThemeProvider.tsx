"use client";

import { useEffect } from "react";
import { useTarotStore } from "@/store/useTarotStore";
import { getCardStyle } from "@/lib/themes";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { cardStyle, loadCardStyle } = useTarotStore();

  useEffect(() => {
    loadCardStyle();
  }, [loadCardStyle]);

  useEffect(() => {
    const style = getCardStyle(cardStyle);
    const t = style.theme;
    const root = document.documentElement;

    root.setAttribute("data-theme", cardStyle);
    root.style.setProperty("--theme-bg", t.bgPrimary);
    root.style.setProperty("--theme-bg-via", t.bgGradientVia);
    root.style.setProperty("--theme-bg-to", t.bgGradientTo);
    root.style.setProperty("--theme-surface", t.surface);
    root.style.setProperty("--theme-surface-hover", t.surfaceHover);
    root.style.setProperty("--theme-border", t.border);
    root.style.setProperty("--theme-border-hover", t.borderHover);
    root.style.setProperty("--theme-accent", t.accentPrimary);
    root.style.setProperty("--theme-accent-secondary", t.accentSecondary);
    root.style.setProperty("--theme-glow", t.accentGlow);
    root.style.setProperty("--theme-text", t.textPrimary);
    root.style.setProperty("--theme-text-muted", t.textMuted);
    root.style.setProperty("--theme-scrollbar", t.scrollbarThumb);
    root.style.setProperty("--theme-scrollbar-hover", t.scrollbarThumbHover);
    root.style.setProperty("--theme-star", t.starColor);
    root.style.setProperty("--theme-star-alt", t.starColorAlt);
    root.style.setProperty("--theme-glass-bg", t.glassBackground);
    root.style.setProperty("--theme-glass-border", t.glassBorder);
    root.style.setProperty("--theme-glow-soft", t.glowSoft);

    document.body.style.background = t.bgPrimary;
    document.body.style.color = t.textPrimary;
  }, [cardStyle]);

  return <>{children}</>;
}
