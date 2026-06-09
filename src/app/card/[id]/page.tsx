import { allCards, getCardById } from "@/data/tarot-cards";
import CardDetailClient from "./CardDetailClient";
import type { Metadata } from "next";

export function generateStaticParams() {
  return allCards.map((card) => ({ id: card.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const card = getCardById(id);
  if (!card) return { title: "未知卡牌 — AI Tarot" };
  const orient = card.arcana === "major" ? "大阿尔卡纳" : `${card.suit} 小阿尔卡纳`;
  return {
    title: `${card.nameZh}（${card.name}）— AI Tarot`,
    description: `${orient} · ${card.keywords.join("、")} · ${card.description.slice(0, 80)}…`,
    openGraph: {
      title: `${card.nameZh} — AI Tarot 塔罗牌解读`,
      description: card.description.slice(0, 160),
    },
  };
}

export default function CardDetailPage() {
  return <CardDetailClient />;
}
