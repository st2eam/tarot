"use client";

import { TarotCard } from "@/types";
import CardImage from "./CardImage";
import { Flame, Droplets, Wind, Mountain } from "lucide-react";

interface Props {
  card: TarotCard;
  size?: "sm" | "md" | "lg";
}

const elementIcons: Record<string, React.ReactNode> = {
  fire: <Flame className="h-4 w-4" />,
  water: <Droplets className="h-4 w-4" />,
  air: <Wind className="h-4 w-4" />,
  earth: <Mountain className="h-4 w-4" />,
};

const elementColors: Record<string, string> = {
  fire: "from-red-500/25 to-orange-500/15 border-red-600/30 text-red-300",
  water: "from-blue-500/25 to-cyan-500/15 border-blue-600/30 text-blue-300",
  air: "from-yellow-500/25 to-amber-500/15 border-yellow-600/30 text-yellow-300",
  earth: "from-green-500/25 to-emerald-500/15 border-green-600/30 text-green-300",
};

const sizeClasses = {
  sm: "w-24 h-40",
  md: "w-36 h-60",
  lg: "w-48 h-80",
};

export default function CardIllustration({ card, size = "lg" }: Props) {
  const isMajor = card.arcana === "major";

  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl border ${
        isMajor ? "border-amber-700/40" : "border-purple-700/30"
      } overflow-hidden shadow-2xl relative`}
    >
      <CardImage
        cardId={card.id}
        nameZh={card.nameZh}
        className="absolute inset-0"
        sizes={size === "lg" ? "192px" : size === "md" ? "144px" : "96px"}
        priority
      />
    </div>
  );
}

export function ElementBadge({ element }: { element: string | null }) {
  if (!element) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs border bg-opacity-10 ${elementColors[element]}`}
    >
      {elementIcons[element]}
      {element === "fire" && "火"}
      {element === "water" && "水"}
      {element === "air" && "风"}
      {element === "earth" && "土"}
    </span>
  );
}
