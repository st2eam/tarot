"use client";

import { useParams, useRouter } from "next/navigation";
import { getCardById } from "@/data/tarot-cards";
import CardIllustration, { ElementBadge } from "@/components/card/CardIllustration";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default function CardDetailClient() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const card = getCardById(id);

  if (!card) {
    return notFound();
  }

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 transition-colors text-sm mb-6"
          style={{ color: "var(--theme-text-muted)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>

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
      </div>
    </div>
  );
}
