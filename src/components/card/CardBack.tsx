"use client";

import { CornerOrnament, CardDivider } from "./CardOrnaments";

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const SIZES = {
  sm:  { w: 112, h: 176 },
  md:  { w: 128, h: 200 },
  lg:  { w: 160, h: 248 },
};

export default function CardBack({ className = "", size = "md", onClick }: Props) {
  const dim = SIZES[size];

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        width: dim.w,
        height: dim.h,
        position: "relative",
        cursor: "pointer",
        borderRadius: 10,
        overflow: "hidden",
        background: "linear-gradient(135deg, #0e0818 0%, #1a0e30 50%, #0e0818 100%)",
        border: "1px solid var(--theme-border)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
        flexShrink: 0,
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "var(--theme-border-hover)";
        el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.6), 0 0 16px var(--theme-glow)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "var(--theme-border)";
        el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.5)";
      }}
    >
      {/* Background geometric pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 8px,
              rgba(255,255,255,0.015) 8px,
              rgba(255,255,255,0.015) 9px
            )
          `,
        }}
      />

      {/* Inner frame line */}
      <div
        style={{
          position: "absolute",
          inset: 5,
          borderRadius: 6,
          border: "1px solid var(--theme-border)",
          pointerEvents: "none",
        }}
      />

      {/* Double inner frame */}
      <div
        style={{
          position: "absolute",
          inset: 9,
          borderRadius: 4,
          border: "0.5px solid var(--theme-border)",
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />

      {/* Corner ornaments */}
      <div style={{ position: "absolute", top: 7, left: 7, color: "var(--theme-accent)" }}>
        <CornerOrnament />
      </div>
      <div style={{ position: "absolute", top: 7, right: 7, color: "var(--theme-accent)", transform: "rotate(90deg)" }}>
        <CornerOrnament />
      </div>
      <div style={{ position: "absolute", bottom: 7, left: 7, color: "var(--theme-accent)", transform: "rotate(-90deg)" }}>
        <CornerOrnament />
      </div>
      <div style={{ position: "absolute", bottom: 7, right: 7, color: "var(--theme-accent)", transform: "rotate(180deg)" }}>
        <CornerOrnament />
      </div>

      {/* Center medallion */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        {/* Outer ring */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1px solid var(--theme-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--theme-surface)",
            boxShadow: "0 0 16px var(--theme-glow)",
          }}
        >
          <span style={{ fontSize: 22, color: "var(--theme-accent-secondary)", lineHeight: 1 }}>✦</span>
        </div>
      </div>

      {/* Bottom label */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          color: "var(--theme-accent)",
        }}
      >
        <CardDivider />
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.35em",
            fontWeight: 600,
            color: "var(--theme-accent-secondary)",
            opacity: 0.7,
            textTransform: "uppercase",
          }}
        >
          Tarot
        </span>
      </div>
    </div>
  );
}
