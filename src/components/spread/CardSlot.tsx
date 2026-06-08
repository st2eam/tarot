"use client";

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DrawnCard } from "@/types";
import CardFace from "@/components/card/CardFace";
import CardDetailModal from "@/components/card/CardDetailModal";

interface Props {
  drawnCard: DrawnCard;
  index: number;
  revealed: boolean;
  onClick: () => void;
}

function CardSlot({ drawnCard, index, revealed, onClick }: Props) {
  const [showDetail, setShowDetail] = useState(false);

  const handleCardClick = () => {
    if (revealed) {
      setShowDetail(true);
    } else {
      onClick();
    }
  };

  return (
    <>
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
      </motion.div>

      <CardDetailModal
        card={drawnCard.card}
        orientation={drawnCard.orientation}
        open={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </>
  );
}

export default memo(CardSlot);
