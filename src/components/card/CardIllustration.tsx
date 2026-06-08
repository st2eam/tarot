"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, X, Loader2, Flame, Droplets, Wind, Mountain } from "lucide-react";
import { TarotCard } from "@/types";
import CardImage from "./CardImage";
import { getCardImageSrc, hasCardImage } from "@/lib/card-images";
import { useTarotStore } from "@/store/useTarotStore";

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
  const { cardStyle } = useTarotStore();
  const isMajor = card.arcana === "major";
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [fullResLoaded, setFullResLoaded] = useState(false);
  const [fullResLoading, setFullResLoading] = useState(false);
  const hasImg = hasCardImage(card.id);

  const handleExpand = () => {
    setLightboxOpen(true);
    setFullResLoading(true);
  };

  return (
    <>
      <div
        className={`${sizeClasses[size]} rounded-2xl border ${
          isMajor ? "border-amber-700/40" : "border-purple-700/30"
        } overflow-hidden shadow-2xl relative group`}
      >
        {/* Thumbnail */}
        <CardImage
          cardId={card.id}
          nameZh={card.nameZh}
          className="absolute inset-0"
          sizes={size === "lg" ? "192px" : size === "md" ? "144px" : "96px"}
          priority
        />

        {/* Expand button — shows on hover */}
        {hasImg && (
          <button
            onClick={handleExpand}
            className="absolute bottom-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
            }}
            title="查看原图"
          >
            <Expand className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-300 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative flex flex-col items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute -top-3 -right-3 z-10 p-1.5 rounded-full"
                style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
              >
                <X className="h-4 w-4" />
              </button>

              {/* Full-res image container */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  width: "min(85vw, 400px)",
                  aspectRatio: "9 / 16",
                  border: `2px solid ${isMajor ? "rgba(217,169,47,0.4)" : "rgba(147,112,219,0.4)"}`,
                  boxShadow: `0 0 60px ${isMajor ? "rgba(217,169,47,0.2)" : "rgba(147,112,219,0.2)"}`,
                  background: "#0a0012",
                }}
              >
                {/* Thumbnail as placeholder while full-res loads */}
                <CardImage
                  cardId={card.id}
                  nameZh={card.nameZh}
                  className="absolute inset-0"
                  sizes="400px"
                  showOverlay={false}
                />

                {/* Full-res image fades in on top */}
                {(fullResLoading || fullResLoaded) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getCardImageSrc(card.id, cardStyle)}
                    alt={card.nameZh}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      opacity: fullResLoaded ? 1 : 0,
                      transition: "opacity 0.4s ease",
                    }}
                    onLoad={() => {
                      setFullResLoaded(true);
                      setFullResLoading(false);
                    }}
                  />
                )}

                {/* Loading indicator */}
                {fullResLoading && !fullResLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                      style={{ background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.7)" }}
                    >
                      <Loader2 className="h-3 w-3 animate-spin" />
                      加载原图...
                    </div>
                  </div>
                )}
              </div>

              {/* Card name */}
              <div className="text-center">
                <p className="text-white font-semibold">{card.nameZh}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{card.name}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
