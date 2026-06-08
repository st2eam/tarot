"use client";

import { forwardRef } from "react";
import { DrawnCard, SpreadDefinition } from "@/types";
import { Sparkles, Star } from "lucide-react";

interface Props {
  spread: SpreadDefinition;
  cards: DrawnCard[];
  interpretation: string;
}

const ExportPreview = forwardRef<HTMLDivElement, Props>(
  function ExportPreview({ spread, cards, interpretation }, ref) {
    // Strip markdown headings from interpretation for clean display
    const cleanText = interpretation
      .replace(/^#{1,3}\s/gm, "")
      .trim();

    return (
      <div
        ref={ref}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "800px",
          padding: "40px",
          background: "#0a0012",
          color: "#ede6f5",
          fontFamily: "system-ui, -apple-system, sans-serif",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
            paddingBottom: "24px",
            borderBottom: "1px solid rgba(147, 112, 219, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "24px" }}>✨</span>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#e0d0ff",
                margin: 0,
              }}
            >
              Mystic Tarot
            </h1>
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#c4a0ff",
              margin: "0 0 8px 0",
            }}
          >
            {spread.nameZh} · {spread.name}
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "#888",
              margin: 0,
            }}
          >
            {new Date().toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Cards */}
        <div style={{ marginBottom: "32px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#c4a0ff",
              marginBottom: "16px",
              paddingBottom: "8px",
              borderBottom: "1px solid rgba(147, 112, 219, 0.2)",
            }}
          >
            📜 抽牌结果
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
              const isMajor = dc.card.arcana === "major";
              const isUpright = dc.orientation === "upright";
              return (
                <div
                  key={i}
                  style={{
                    width: "170px",
                    padding: "16px",
                    borderRadius: "16px",
                    border: `1px solid ${
                      isMajor
                        ? "rgba(217, 169, 47, 0.3)"
                        : "rgba(147, 112, 219, 0.25)"
                    }`,
                    background: "rgba(24, 24, 27, 0.8)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isMajor
                          ? "rgba(217, 169, 47, 0.2)"
                          : "rgba(147, 112, 219, 0.2)",
                      }}
                    >
                      {isMajor ? (
                        <span style={{ fontSize: "20px", color: "#e0b040" }}>
                          ★
                        </span>
                      ) : (
                        <span style={{ fontSize: "20px", color: "#a080d0" }}>
                          ✦
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9070c0",
                      marginBottom: "4px",
                      fontWeight: 500,
                    }}
                  >
                    {dc.position.name}
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#e0d0ff",
                      marginBottom: "4px",
                    }}
                  >
                    {dc.card.nameZh}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#888",
                      marginBottom: "6px",
                    }}
                  >
                    {dc.card.name}
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "10px",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      background: isUpright
                        ? "rgba(147, 112, 219, 0.25)"
                        : "rgba(113, 113, 122, 0.25)",
                      color: isUpright ? "#c4a0ff" : "#a0a0b0",
                      fontWeight: 600,
                    }}
                  >
                    {isUpright ? "正位 ↑" : "逆位 ↓"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interpretation */}
        {cleanText && (
          <div
            style={{
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid rgba(147, 112, 219, 0.2)",
              background: "rgba(24, 24, 27, 0.6)",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#c4a0ff",
                marginBottom: "12px",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(147, 112, 219, 0.2)",
              }}
            >
              ✨ AI 解读
            </h3>
            <div
              style={{
                fontSize: "13px",
                lineHeight: 1.8,
                color: "#d0d0e0",
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
            marginTop: "32px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(147, 112, 219, 0.2)",
            fontSize: "11px",
            color: "#666",
          }}
        >
          Mystic Tarot · AI 塔罗解读
        </div>
      </div>
    );
  }
);

export default ExportPreview;
