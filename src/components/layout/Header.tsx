"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import StyleSwitcher from "./StyleSwitcher";

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{
        background: "var(--theme-glass-bg)",
        borderBottom: "1px solid var(--theme-glass-border)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 transition-colors"
          style={{ color: "var(--theme-accent)" }}
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-lg font-semibold tracking-wide" style={{ color: "var(--theme-accent-secondary)" }}>
            AI Tarot
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm transition-colors"
            style={{ color: pathname === "/" ? "var(--theme-accent)" : "var(--theme-text-muted)" }}
          >
            牌阵
          </Link>
          <Link
            href="/cards"
            className="text-sm transition-colors"
            style={{ color: pathname.startsWith("/card") ? "var(--theme-accent)" : "var(--theme-text-muted)" }}
          >
            牌库
          </Link>
          <Link
            href="/history"
            className="text-sm transition-colors"
            style={{ color: pathname === "/history" ? "var(--theme-accent)" : "var(--theme-text-muted)" }}
          >
            历史
          </Link>
          <Link
            href="/settings"
            className="text-sm transition-colors"
            style={{ color: pathname === "/settings" ? "var(--theme-accent)" : "var(--theme-text-muted)" }}
          >
            设置
          </Link>
          <StyleSwitcher />
        </nav>
      </div>
    </header>
  );
}
