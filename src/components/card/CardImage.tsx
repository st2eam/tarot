"use client";

import Image from "next/image";
import { useState } from "react";
import { Orientation } from "@/types";
import {
  getCardImageSrc,
  getCardImageFallbackSrc,
  getCardThumbSrc,
  getCardThumbFallbackSrc,
  hasCardImage,
} from "@/lib/card-images";
import { useTarotStore } from "@/store/useTarotStore";

interface Props {
  cardId: string;
  nameZh: string;
  orientation?: Orientation;
  className?: string;
  priority?: boolean;
  sizes?: string;
  showOverlay?: boolean;
  /** Use full-resolution image instead of thumbnail (default: false) */
  fullRes?: boolean;
}

export default function CardImage({
  cardId,
  nameZh,
  orientation = "upright",
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 120px, 160px",
  showOverlay = true,
  fullRes = false,
}: Props) {
  const { cardStyle } = useTarotStore();

  const primarySrc = fullRes
    ? getCardImageSrc(cardId, cardStyle)
    : getCardThumbSrc(cardId, cardStyle);
  const fallbackSrc = fullRes
    ? getCardImageFallbackSrc(cardId)
    : getCardThumbFallbackSrc(cardId);
  // Final fallback to original if thumbs aren't generated yet
  const originFallback = getCardImageSrc(cardId, cardStyle);

  const [src, setSrc] = useState<string | null>(
    hasCardImage(cardId) ? primarySrc : null
  );
  const [failCount, setFailCount] = useState(0);
  const isReversed = orientation === "reversed";

  const handleError = () => {
    setFailCount((c) => {
      const next = c + 1;
      if (next === 1 && src !== fallbackSrc) {
        setSrc(fallbackSrc);
      } else if (next === 2 && !fullRes) {
        // thumbs not generated yet → fall back to original
        setSrc(originFallback);
      } else {
        setSrc(null);
      }
      return next;
    });
  };

  if (src === null) {
    return <CardPlaceholder nameZh={nameZh} className={className} />;
  }

  return (
    <div
      className={className}
      style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}
    >
      <Image
        src={src}
        alt={nameZh}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover transition-transform duration-300 ${isReversed ? "rotate-180" : ""}`}
        onError={handleError}
      />
      {showOverlay && (
        <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-black/5 pointer-events-none" />
      )}
    </div>
  );
}

function CardPlaceholder({ nameZh, className }: { nameZh: string; className?: string }) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        background: "linear-gradient(135deg, rgba(20,10,40,0.9), rgba(10,5,20,0.95))",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(var(--theme-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--theme-border) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: "relative",
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid var(--theme-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 18, color: "var(--theme-accent)", opacity: 0.5 }}>✦</span>
      </div>
      <span
        style={{
          fontSize: 10,
          color: "var(--theme-text-muted)",
          opacity: 0.6,
          letterSpacing: "0.08em",
          textAlign: "center",
          padding: "0 8px",
        }}
      >
        {nameZh}
      </span>
      <span
        style={{
          fontSize: 9,
          color: "var(--theme-text-muted)",
          opacity: 0.35,
          letterSpacing: "0.06em",
        }}
      >
        待生成
      </span>
    </div>
  );
}
