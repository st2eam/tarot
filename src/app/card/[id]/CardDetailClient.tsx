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
    <div className="flex-1 px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>

        <div className="flex justify-center mb-6">
          <CardIllustration card={card} size="lg" />
        </div>

        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-purple-50 mb-1">{card.nameZh}</h1>
          <p className="text-zinc-400">{card.name}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-800/40 text-purple-200 border border-purple-600/20">
            {card.arcana === "major" ? "大阿尔卡那" : "小阿尔卡那"}
          </span>
          {card.suit && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-800/40 text-purple-200 border border-purple-600/20">
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
              className="text-xs px-2.5 py-1 rounded-full bg-purple-800/30 text-purple-200 border border-purple-700/20"
            >
              {kw}
            </span>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-zinc-800/80 rounded-xl p-5 border border-purple-700/15">
            <h2 className="text-base font-semibold text-purple-200 mb-2 flex items-center gap-2">
              <span className="text-green-400">↑</span> 正位含义
            </h2>
            <p className="text-zinc-200 leading-relaxed">{card.meaning.upright}</p>
          </div>

          <div className="bg-zinc-800/80 rounded-xl p-5 border border-purple-700/15">
            <h2 className="text-base font-semibold text-purple-200 mb-2 flex items-center gap-2">
              <span className="text-zinc-300">↓</span> 逆位含义
            </h2>
            <p className="text-zinc-200 leading-relaxed">{card.meaning.reversed}</p>
          </div>

          <div className="bg-zinc-800/80 rounded-xl p-5 border border-purple-700/15">
            <h2 className="text-base font-semibold text-purple-200 mb-2">牌面描述</h2>
            <p className="text-zinc-300 leading-relaxed">{card.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
