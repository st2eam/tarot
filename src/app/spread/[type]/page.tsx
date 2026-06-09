import { spreadIds, getSpreadById } from "@/data/spreads";
import SpreadClient from "./SpreadClient";
import type { Metadata } from "next";

export function generateStaticParams() {
  return (spreadIds as string[]).map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const spread = getSpreadById(type);
  if (!spread) return { title: "未知牌阵 — AI Tarot" };
  return {
    title: `${spread.nameZh}（${spread.name}）— AI Tarot`,
    description: `${spread.description} · 共 ${spread.cardCount} 张牌`,
    openGraph: {
      title: `${spread.nameZh} 塔罗牌阵 — AI Tarot`,
      description: spread.description,
    },
  };
}

export default function SpreadPage() {
  return <SpreadClient />;
}
