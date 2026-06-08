"use client";

import { forwardRef } from "react";
import { DrawnCard, SpreadDefinition } from "@/types";
import { useTarotStore } from "@/store/useTarotStore";
import { getCardImageSrc, hasCardImage } from "@/lib/card-images";

interface Props {
  spread: SpreadDefinition;
  cards: DrawnCard[];
}

const ExportPreview = forwardRef<HTMLDivElement, Props>(
  function ExportPreview({ spread, cards }, ref) {
    const interpretation = useTarotStore((s) => s.interpretation);
    const cardStyle = useTarotStore((s) => s.cardStyle);

    const cleanText = interpretation
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .trim();

    return (
      <div
        ref={ref}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "860px",
          padding: "48px 48px 40px",
          background: "linear-gradient(160deg, #0e0020 0%, #0a0015 60%, #0d001a 100%)",
          color: "#ede6f5",
          fontFamily: "'system-ui', '-apple-system', 'PingFang SC', 'Microsoft YaHei', sans-serif",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "36px",
            paddingBottom: "28px",
            borderBottom: "1px solid rgba(147, 112, 219, 0.25)",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔮</div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#e0d0ff", margin: "0 0 6px 0" }}>
            Mystic Tarot
          </h1>
          <h2 style={{ fontSize: "17px", fontWeight: 600, color: "#b890ff", margin: "0 0 10px 0" }}>
            {spread.nameZh} · {spread.name}
          </h2>
          <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
            {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Cards */}
        <div style={{ marginBottom: "36px" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#9870d0",
              marginBottom: "20px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            ◆ 抽牌结果
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
            }}
          >
            {cards.map((dc, i) => {
              const isUpright = dc.orientation === "upright";
              const isMajor = dc.card.arcana === "major";
              const imgSrc = hasCardImage(dc.card.id)
                ? getCardImageSrc(dc.card.id, cardStyle)
                : null;

              return (
                <div
                  key={i}
                  style={{
                    width: "140px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {/* Position label */}
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9070c0",
                      fontWeight: 600,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {dc.position.name}
                  </div>

                  {/* Card image */}
                  <div
                    style={{
                      width: "110px",
                      height: "176px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: `1.5px solid ${isMajor ? "rgba(217,169,47,0.5)" : "rgba(147,112,219,0.35)"}`,
                      boxShadow: isMajor
                        ? "0 0 14px rgba(217,169,47,0.15)"
                        : "0 4px 12px rgba(0,0,0,0.5)",
                      flexShrink: 0,
                      background: "#130025",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={dc.card.nameZh}
                        crossOrigin="anonymous"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transform: isUpright ? "none" : "rotate(180deg)",
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: "28px", opacity: 0.4 }}>
                        {isMajor ? "★" : "✦"}
                      </div>
                    )}
                  </div>

                  {/* Card info */}
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#e0d0ff",
                        marginBottom: "3px",
                      }}
                    >
                      {dc.card.nameZh}
                    </div>
                    <div style={{ fontSize: "10px", color: "#666", marginBottom: "5px" }}>
                      {dc.card.name}
                    </div>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background: isUpright ? "rgba(147,112,219,0.25)" : "rgba(113,113,122,0.25)",
                        color: isUpright ? "#c4a0ff" : "#909090",
                        fontWeight: 600,
                      }}
                    >
                      {isUpright ? "正位 ↑" : "逆位 ↓"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interpretation */}
        {cleanText && (
          <div
            style={{
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid rgba(147,112,219,0.2)",
              background: "rgba(20, 10, 35, 0.7)",
              marginBottom: "32px",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#9870d0",
                marginBottom: "14px",
                paddingBottom: "10px",
                borderBottom: "1px solid rgba(147,112,219,0.2)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              ✨ AI 解读
            </h3>
            <div
              style={{
                fontSize: "13px",
                lineHeight: 1.9,
                color: "#ccc8e0",
                whiteSpace: "pre-wrap",
              }}
            >
              {cleanText}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            paddingTop: "16px",
            borderTop: "1px solid rgba(147,112,219,0.15)",
            fontSize: "11px",
            color: "#444",
          }}
        >
          Mystic Tarot · AI 塔罗解读 · github.com/st2eam/tarot
        </div>
      </div>
    );
  }
);

export default ExportPreview;
