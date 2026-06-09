"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { DrawnCard } from "@/types";
import CardFace from "@/components/card/CardFace";

interface Props {
  drawnCard: DrawnCard;
  index: number;
  revealed: boolean;
  onClick: () => void;
  onDetailClick?: () => void;
}

function CardSlot({ drawnCard, index, revealed, onClick, onDetailClick }: Props) {
  const handleCardClick = () => {
    if (revealed) {
      onDetailClick?.();
    } else {
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      className="flex flex-col items-center gap-2"
    >
      {/* Position label */}
      <div className="text-center mb-1">
        <span className="text-xs text-purple-400/80 font-medium">
          {drawnCard.position.name}
        </span>
        <p className="text-[10px] text-zinc-600">{drawnCard.position.description}</p>
      </div>

      {/* Card with flip */}
      <div className="card-flip" style={{ perspective: "1000px" }}>
        <div
          className={`card-flip-inner ${revealed ? "flipped" : ""}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Card back (face down) */}
          <div className="card-front" onClick={handleCardClick}>
            <CardFace card={drawnCard.card} flipped={false} />
          </div>

          {/* Card front (face up) */}
          <div className="card-back absolute inset-0" onClick={handleCardClick}>
            <CardFace
              card={drawnCard.card}
              orientation={drawnCard.orientation}
              flipped
            />
          </div>
        </div>
      </div>

      {/* Revealed state hint */}
      {revealed && (
        <div className="text-center">
          <span
            className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background:
                drawnCard.orientation === "upright"
                  ? "rgba(147,112,219,0.25)"
                  : "rgba(113,113,122,0.25)",
              color:
                drawnCard.orientation === "upright"
                  ? "var(--theme-accent-secondary)"
                  : "var(--theme-text-muted)",
            }}
          >
            {drawnCard.orientation === "upright" ? "正位 ↑" : "逆位 ↓"}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default memo(CardSlot);
