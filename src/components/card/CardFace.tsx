"use client";

import { TarotCard, Orientation } from "@/types";
import CardImage from "./CardImage";
import CardBack from "./CardBack";
import {
  CornerOrnament,
  CardDivider,
  getCardRomanNumeral,
  getSuitSymbol,
} from "./CardOrnaments";

interface Props {
  card: TarotCard;
  orientation?: Orientation;
  flipped?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

/* Card dimensions — width × height in px */
const SIZES = {
  sm: { w: 112, h: 176, art: 120, nameSize: 10, numSize: 9 },
  md: { w: 128, h: 200, art: 140, nameSize: 11, numSize: 10 },
  lg: { w: 160, h: 248, art: 176, nameSize: 13, numSize: 11 },
} as const;

export default function CardFace({
  card,
  orientation,
  flipped = true,
  onClick,
  size = "md",
}: Props) {
  if (!flipped) {
    return <CardBack size={size} onClick={onClick} />;
  }

  const dim = SIZES[size];
  const isUpright = orientation !== "reversed";
  const isMajor = card.arcana === "major";
  const numeral = getCardRomanNumeral(card.number, card.arcana);
  const suitSymbol = getSuitSymbol(card.suit);
  const isReversed = orientation === "reversed";

  /* Theme-adaptive colors via CSS variables */
  const accentColor = "var(--theme-accent)";
  const accentSecondary = "var(--theme-accent-secondary)";
  const borderColor = "var(--theme-border)";
  const borderHover = "var(--theme-border-hover)";
  const surfaceColor = "var(--theme-surface)";
  const textColor = "var(--theme-text)";
  const glowColor = "var(--theme-glow)";

  return (
    <div
      onClick={onClick}
      style={{
        width: dim.w,
        height: dim.h,
        position: "relative",
        cursor: onClick ? "pointer" : "default",
        borderRadius: 10,
        overflow: "hidden",
        background: "#0a0a0a",
        border: `1px solid ${borderColor}`,
        boxShadow: `0 2px 12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.04)`,
        flexShrink: 0,
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = borderHover;
        el.style.boxShadow = `0 4px 20px rgba(0,0,0,0.6), 0 0 16px ${glowColor}, inset 0 0 0 1px rgba(255,255,255,0.06)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = borderColor;
        el.style.boxShadow = `0 2px 12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.04)`;
      }}
    >
      {/* ── ARTWORK AREA ────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 5,
          left: 5,
          right: 5,
          height: dim.art,
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {/* CardImage needs a relatively-positioned parent with explicit height for fill */}
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <CardImage
            cardId={card.id}
            nameZh={card.nameZh}
            orientation={orientation}
            className="absolute inset-0"
            sizes={`${dim.w}px`}
            showOverlay={false}
          />
        </div>
        {/* Vignette on artwork */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.3) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── INNER FRAME LINE (inset border on artwork) ── */}
      <div
        style={{
          position: "absolute",
          inset: "5px 5px auto 5px",
          height: dim.art,
          borderRadius: 6,
          border: `1px solid ${borderColor}`,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* ── CORNER ORNAMENTS ─────────────────────────── */}
      <div
        style={{ position: "absolute", top: 7, left: 7, color: accentColor, zIndex: 3 }}
      >
        <CornerOrnament />
      </div>
      <div
        style={{
          position: "absolute", top: 7, right: 7,
          color: accentColor, zIndex: 3,
          transform: "rotate(90deg)",
        }}
      >
        <CornerOrnament />
      </div>
      <div
        style={{
          position: "absolute", bottom: dim.h - dim.art - 5 + 2, left: 7,
          color: accentColor, zIndex: 3,
          transform: "rotate(-90deg)",
        }}
      >
        <CornerOrnament />
      </div>
      <div
        style={{
          position: "absolute", bottom: dim.h - dim.art - 5 + 2, right: 7,
          color: accentColor, zIndex: 3,
          transform: "rotate(180deg)",
        }}
      >
        <CornerOrnament />
      </div>

      {/* ── TOP BADGE (number + arcana/suit) ─────────── */}
      <div
        style={{
          position: "absolute",
          top: 9,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          gap: 3,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          borderRadius: 20,
          padding: "1px 6px",
          border: `0.5px solid ${borderColor}`,
        }}
      >
        <span
          style={{
            fontSize: dim.numSize,
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: accentSecondary,
            fontFamily: "serif",
            lineHeight: 1.4,
          }}
        >
          {numeral}
        </span>
        {!isMajor && suitSymbol && (
          <span style={{ fontSize: dim.numSize - 1, lineHeight: 1 }}>{suitSymbol}</span>
        )}
      </div>

      {/* ── REVERSED INDICATOR (top right) ───────────── */}
      {isReversed && (
        <div
          style={{
            position: "absolute",
            top: 9,
            right: 24,
            zIndex: 4,
            background: "rgba(0,0,0,0.55)",
            borderRadius: "50%",
            width: 14,
            height: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 8, lineHeight: 1, transform: "rotate(180deg)", display: "block" }}>↑</span>
        </div>
      )}

      {/* ── BOTTOM NAME AREA ──────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: dim.h - dim.art - 10,
          background: surfaceColor,
          backdropFilter: "blur(8px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          paddingBottom: 4,
          paddingTop: 2,
        }}
      >
        {/* Divider */}
        <div style={{ color: accentColor }}>
          <CardDivider />
        </div>

        {/* Card name */}
        <span
          style={{
            fontSize: dim.nameSize,
            fontWeight: 600,
            color: textColor,
            letterSpacing: "0.06em",
            lineHeight: 1.2,
            textAlign: "center",
            maxWidth: dim.w - 16,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {card.nameZh}
        </span>

        {/* Orientation badge */}
        {orientation && (
          <span
            style={{
              fontSize: dim.nameSize - 2,
              padding: "1px 5px",
              borderRadius: 8,
              background: isUpright ? "var(--theme-surface-hover)" : "rgba(60,60,60,0.5)",
              color: isUpright ? accentSecondary : "var(--theme-text-muted)",
              border: `0.5px solid ${isUpright ? borderColor : "rgba(100,100,100,0.3)"}`,
              letterSpacing: "0.03em",
            }}
          >
            {isUpright ? "正位" : "逆位"}
          </span>
        )}
      </div>

      {/* ── OUTER GLOW FRAME (decorative double border) ─ */}
      <div
        style={{
          position: "absolute",
          inset: 2,
          borderRadius: 8,
          border: `0.5px solid rgba(255,255,255,0.06)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </div>
  );
}
