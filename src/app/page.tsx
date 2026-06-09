import { visibleSpreads } from "@/data/spreads";
import SpreadSelector from "@/components/home/SpreadSelector";
import DailyCard from "@/components/home/DailyCard";
import MoonIndicator from "@/components/home/MoonIndicator";
import Link from "next/link";
import { Sparkles, BookOpen, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="flex justify-center mb-5">
            <MoonIndicator />
          </div>
          <h1
            className="font-serif-zh text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight"
            style={{ color: "var(--theme-text)" }}
          >
            探索命运的指引
          </h1>
          <p
            className="text-sm sm:text-base max-w-md mx-auto leading-relaxed"
            style={{ color: "var(--theme-text-muted)" }}
          >
            让塔罗揭示隐藏在命运之轮中的讯息
          </p>
        </div>

        {/* Daily Card + Quick links row */}
        <div className="mb-10 sm:mb-12">
          <DailyCard />
        </div>

        {/* Spreads */}
        <section className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <Sparkles className="h-4 w-4" style={{ color: "var(--theme-accent)" }} />
            <h2 className="text-sm font-semibold tracking-wide" style={{ color: "var(--theme-accent-secondary)" }}>
              选择牌阵
            </h2>
          </div>
          <SpreadSelector spreads={visibleSpreads} />
        </section>

        {/* Bottom quick links */}
        <div className="flex flex-wrap justify-center gap-3 pb-4">
          <Link
            href="/cards"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all hover:brightness-110"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--theme-glass-border)",
              color: "var(--theme-text)",
            }}
          >
            <BookOpen className="h-4 w-4" style={{ color: "var(--theme-accent)" }} />
            浏览全部 78 张牌
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all hover:brightness-110"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--theme-glass-border)",
              color: "var(--theme-text)",
            }}
          >
            <Clock className="h-4 w-4" style={{ color: "var(--theme-accent)" }} />
            解读历史
          </Link>
        </div>
      </div>
    </div>
  );
}
