"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCardById, allCards } from "@/data/tarot-cards";
import CardIllustration, { ElementBadge } from "@/components/card/CardIllustration";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

export default function CardDetailClient() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const card = getCardById(id);

  if (!card) {
    return notFound();
  }

  const currentIndex = allCards.findIndex((c) => c.id === id);
  const prevCard = currentIndex > 0 ? allCards[currentIndex - 1] : null;
  const nextCard = currentIndex < allCards.length - 1 ? allCards[currentIndex + 1] : null;

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto">
        {/* Top navigation bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/cards")}
            className="flex items-center gap-1.5 transition-colors text-sm"
            style={{ color: "var(--theme-text-muted)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            返回牌库
          </button>

          <div className="flex items-center gap-1">
            {prevCard ? (
              <Link
                href={`/card/${prevCard.id}`}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-all hover:brightness-110"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "var(--theme-text-muted)",
                }}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                {prevCard.nameZh}
              </Link>
            ) : (
              <div className="w-20" />
            )}
            <span className="text-xs px-2" style={{ color: "var(--theme-text-muted)" }}>
              {currentIndex + 1} / {allCards.length}
            </span>
            {nextCard ? (
              <Link
                href={`/card/${nextCard.id}`}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-all hover:brightness-110"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "var(--theme-text-muted)",
                }}
              >
                {nextCard.nameZh}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <div className="w-20" />
            )}
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <CardIllustration card={card} size="lg" />
        </div>

        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: "var(--theme-text)" }}>{card.nameZh}</h1>
          <p style={{ color: "var(--theme-text-muted)" }}>{card.name}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span
            className="text-xs px-2.5 py-1 rounded-full"
            style={{ background: "var(--theme-surface-hover)", color: "var(--theme-accent-secondary)", border: "1px solid var(--theme-border)" }}
          >
            {card.arcana === "major" ? "大阿尔卡那" : "小阿尔卡那"}
          </span>
          {card.suit && (
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: "var(--theme-surface-hover)", color: "var(--theme-accent-secondary)", border: "1px solid var(--theme-border)" }}
            >
              {card.suit === "wands" && "权杖"}
              {card.suit === "cups" && "圣杯"}
              {card.suit === "swords" && "宝剑"}
              {card.suit === "pentacles" && "星币"}
            </span>
          )}
          <ElementBadge element={card.element} />
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
          {card.keywords.map((kw) => (
            <span
              key={kw}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: "var(--theme-surface)", color: "var(--theme-accent-secondary)", border: "1px solid var(--theme-border)" }}
            >
              {kw}
            </span>
          ))}
        </div>

        <div className="space-y-4">
          <div
            className="rounded-xl p-4 sm:p-5"
            style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)" }}
          >
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--theme-accent-secondary)" }}>
              <span className="text-green-400">↑</span> 正位含义
            </h2>
            <p className="leading-relaxed" style={{ color: "var(--theme-text)" }}>{card.meaning.upright}</p>
          </div>

          <div
            className="rounded-xl p-4 sm:p-5"
            style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)" }}
          >
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--theme-accent-secondary)" }}>
              <span style={{ color: "var(--theme-text-muted)" }}>↓</span> 逆位含义
            </h2>
            <p className="leading-relaxed" style={{ color: "var(--theme-text)" }}>{card.meaning.reversed}</p>
          </div>

          <div
            className="rounded-xl p-4 sm:p-5"
            style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)" }}
          >
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--theme-accent-secondary)" }}>牌面描述</h2>
            <p className="leading-relaxed" style={{ color: "var(--theme-text-muted)" }}>{card.description}</p>
          </div>
        </div>

        {/* Bottom prev/next */}
        <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid var(--theme-glass-border)" }}>
          {prevCard ? (
            <Link
              href={`/card/${prevCard.id}`}
              className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all hover:brightness-110 text-left"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--theme-glass-border)",
              }}
            >
              <ChevronLeft className="h-5 w-5 shrink-0" style={{ color: "var(--theme-accent)" }} />
              <div>
                <div className="text-xs" style={{ color: "var(--theme-text-muted)" }}>上一张</div>
                <div className="text-sm font-medium" style={{ color: "var(--theme-text)" }}>{prevCard.nameZh}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextCard ? (
            <Link
              href={`/card/${nextCard.id}`}
              className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all hover:brightness-110 text-right"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--theme-glass-border)",
              }}
            >
              <div>
                <div className="text-xs" style={{ color: "var(--theme-text-muted)" }}>下一张</div>
                <div className="text-sm font-medium" style={{ color: "var(--theme-text)" }}>{nextCard.nameZh}</div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0" style={{ color: "var(--theme-accent)" }} />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
