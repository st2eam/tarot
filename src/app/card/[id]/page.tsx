import { allCards } from "@/data/tarot-cards";
import CardDetailClient from "./CardDetailClient";

export function generateStaticParams() {
  return allCards.map((card) => ({ id: card.id }));
}

export default function CardDetailPage() {
  return <CardDetailClient />;
}
