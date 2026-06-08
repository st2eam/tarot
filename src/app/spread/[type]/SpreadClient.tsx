"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTarotStore } from "@/store/useTarotStore";
import { useShallow } from "zustand/react/shallow";
import { spreadIds } from "@/data/spreads";
import { buildInterpretationPrompt, INTERPRETATION_STYLES, DEFAULT_STYLE_ID, getStyleSystemPrompt } from "@/lib/prompts";
import { streamInterpretation } from "@/lib/llm-stream";
import { InterpretationStyleId } from "@/types";
import CardSlot from "@/components/spread/CardSlot";
import DrawButton from "@/components/spread/DrawButton";
import CardPickerModal from "@/components/spread/CardPickerModal";
import InterpretationPanel from "@/components/spread/InterpretationPanel";
import ExportPreview from "@/components/spread/ExportPreview";
import { CustomCardSelection } from "@/lib/deck";
import { ArrowLeft, Wand2, Shuffle, Hand, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SpreadClient() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;

  // Exclude `interpretation` from this subscription — it changes on every streamed character.
  // InterpretationPanel subscribes to it directly, so only that component re-renders.
  const {
    spread,
    drawnCards,
    isDrawing,
    isRevealed,
    isStreaming,
    showInterpretation,
    llmSettings,
    setSpread,
    drawCards,
    setCustomCards,
    revealCards,
    resetReading,
    setShowInterpretation,
    appendInterpretation,
    setInterpretation,
    setIsStreaming,
    loadLLMSettings,
  } = useTarotStore(
    useShallow((s) => ({
      spread: s.spread,
      drawnCards: s.drawnCards,
      isDrawing: s.isDrawing,
      isRevealed: s.isRevealed,
      isStreaming: s.isStreaming,
      showInterpretation: s.showInterpretation,
      llmSettings: s.llmSettings,
      setSpread: s.setSpread,
      drawCards: s.drawCards,
      setCustomCards: s.setCustomCards,
      revealCards: s.revealCards,
      resetReading: s.resetReading,
      setShowInterpretation: s.setShowInterpretation,
      appendInterpretation: s.appendInterpretation,
      setInterpretation: s.setInterpretation,
      setIsStreaming: s.setIsStreaming,
      loadLLMSettings: s.loadLLMSettings,
    }))
  );

  const [error, setError] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState<"random" | "custom">("random");
  const [showPicker, setShowPicker] = useState(false);
  const [interpretStyle, setInterpretStyle] = useState<InterpretationStyleId>(DEFAULT_STYLE_ID);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const styleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showStyleMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (styleMenuRef.current && !styleMenuRef.current.contains(e.target as Node)) {
        setShowStyleMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showStyleMenu]);

  useEffect(() => {
    if (!(spreadIds as string[]).includes(type)) {
      router.replace("/");
      return;
    }
    loadLLMSettings();
    setSpread(type);
    return () => {
      resetReading();
    };
  }, [type]);

  const handleDraw = useCallback(() => {
    setError(null);
    setInterpretation("");
    setShowInterpretation(false);
    drawCards();
    setTimeout(() => { revealCards(); }, 400);
  }, [drawCards, revealCards, setInterpretation, setShowInterpretation]);

  const handleCustomConfirm = useCallback(
    (selections: CustomCardSelection[]) => {
      setError(null);
      setInterpretation("");
      setShowInterpretation(false);
      setCustomCards(selections);
      setTimeout(() => { revealCards(); }, 400);
    },
    [setCustomCards, revealCards, setInterpretation, setShowInterpretation]
  );

  const handleModeChange = useCallback(
    (mode: "random" | "custom") => {
      if (mode === drawMode) return;
      setDrawMode(mode);
      resetReading();
      setError(null);
    },
    [drawMode, resetReading]
  );

  const handleInterpret = useCallback(async () => {
    if (!spread || drawnCards.length === 0) return;

    const settings = llmSettings;
    if (!settings?.apiKey) {
      setError("请先在设置页面配置 API Key");
      setShowInterpretation(true);
      return;
    }

    setShowInterpretation(true);
    setIsStreaming(true);
    setInterpretation("");
    setError(null);

    const prompt = buildInterpretationPrompt(drawnCards, spread, interpretStyle);
    const systemPrompt = getStyleSystemPrompt(interpretStyle);

    try {
      await streamInterpretation(
        prompt,
        settings.provider,
        settings.apiKey,
        settings.model,
        (chunk) => appendInterpretation(chunk),
        systemPrompt
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "解读请求失败");
    } finally {
      setIsStreaming(false);
    }
  }, [
    spread,
    drawnCards,
    llmSettings,
    interpretStyle,
    appendInterpretation,
    setInterpretation,
    setIsStreaming,
    setShowInterpretation,
  ]);

  if (!spread) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-zinc-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-3 sm:px-6 py-6 sm:py-8">
      {/* Top bar */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6 sm:mb-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 transition-colors text-sm shrink-0"
          style={{ color: "var(--theme-text-muted)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">返回</span>
        </button>
        <div className="text-center flex-1 px-2">
          <h1 className="text-lg sm:text-xl font-bold leading-tight" style={{ color: "var(--theme-text)" }}>{spread.nameZh}</h1>
          <p className="text-xs hidden sm:block" style={{ color: "var(--theme-text-muted)" }}>{spread.name}</p>
        </div>
        <div className="w-8 sm:w-16 shrink-0" />
      </div>

      {/* Draw mode toggle */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl mb-4"
        style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--theme-border)" }}
      >
        <button
          onClick={() => handleModeChange("random")}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={
            drawMode === "random"
              ? { background: "var(--theme-surface-hover)", color: "var(--theme-accent-secondary)", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }
              : { color: "var(--theme-text-muted)" }
          }
        >
          <Shuffle className="h-3.5 w-3.5" />
          随机抽牌
        </button>
        <button
          onClick={() => handleModeChange("custom")}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={
            drawMode === "custom"
              ? { background: "var(--theme-surface-hover)", color: "var(--theme-accent-secondary)", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }
              : { color: "var(--theme-text-muted)" }
          }
        >
          <Hand className="h-3.5 w-3.5" />
          自定义选牌
        </button>
      </div>

      {/* Draw button */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 sm:mb-8">
        {drawMode === "random" ? (
          <DrawButton onDraw={handleDraw} disabled={isDrawing} drawn={drawnCards.length > 0} />
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowPicker(true)}
            className="relative px-8 py-3.5 rounded-2xl font-semibold text-base text-white transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, var(--theme-accent), var(--theme-accent-secondary))",
              boxShadow: "0 4px 16px var(--theme-glow)",
            }}
          >
            <span className="flex items-center gap-2">
              <Hand className="h-4 w-4" />
              {drawnCards.length > 0 ? "重新选牌" : "选择牌面"}
            </span>
          </motion.button>
        )}
        {isRevealed && drawnCards.length > 0 && !isStreaming && (
          <motion.div
            ref={styleMenuRef}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-stretch relative"
          >
            {/* Main interpret button */}
            <button
              onClick={handleInterpret}
              className="flex items-center gap-2 pl-5 pr-4 py-3.5 rounded-l-2xl font-semibold text-base text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, var(--theme-accent-secondary), var(--theme-accent))",
                boxShadow: "0 4px 16px var(--theme-glow)",
              }}
            >
              <Wand2 className="h-4 w-4" />
              AI 解读
            </button>

            {/* Divider */}
            <div
              className="w-px self-stretch"
              style={{ background: "rgba(255,255,255,0.15)" }}
            />

            {/* Style dropdown trigger */}
            <button
              onClick={() => setShowStyleMenu((v) => !v)}
              className="flex items-center gap-1 pl-3 pr-3.5 py-3.5 rounded-r-2xl font-medium text-sm text-white transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, var(--theme-accent-secondary), var(--theme-accent))",
                boxShadow: "0 4px 16px var(--theme-glow)",
              }}
            >
              {(() => {
                const s = INTERPRETATION_STYLES.find((s) => s.id === interpretStyle)!;
                return <span className="text-base leading-none">{s.icon}</span>;
              })()}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${showStyleMenu ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown menu */}
            <AnimatePresence>
              {showStyleMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-48 rounded-2xl overflow-hidden z-50"
                  style={{
                    background: "rgba(18, 8, 30, 0.95)",
                    border: "1px solid var(--theme-border)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {INTERPRETATION_STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setInterpretStyle(s.id);
                        setShowStyleMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all text-left"
                      style={
                        interpretStyle === s.id
                          ? { background: "rgba(147,112,219,0.2)", color: "var(--theme-accent-secondary)" }
                          : { color: "var(--theme-text-muted)" }
                      }
                    >
                      <span className="text-base w-5 shrink-0">{s.icon}</span>
                      <span className="font-medium">{s.label}</span>
                      <span className="ml-auto text-xs opacity-50">{s.desc}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Card slots grid */}
      <div
        className="relative w-full max-w-3xl mx-auto flex flex-wrap items-start justify-center gap-3 sm:gap-5"
        style={{ minHeight: "200px" }}
      >
        {drawnCards.length === 0 ? (
          spread.positions.map((pos) => (
            <div
              key={pos.id}
              className={`flex flex-col items-center gap-2 ${drawMode === "custom" ? "opacity-60" : "opacity-30"}`}
            >
              <div className="text-center mb-1">
                <span className="text-xs opacity-50" style={{ color: "var(--theme-accent)" }}>{pos.name}</span>
              </div>
              {drawMode === "custom" ? (
                <button
                  onClick={() => setShowPicker(true)}
                  className="w-[90px] h-[140px] sm:w-32 sm:h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                  style={{ borderColor: "var(--theme-border-hover)", color: "var(--theme-accent)" }}
                >
                  <Hand className="h-4 w-4 sm:h-5 sm:w-5 opacity-50" />
                  <span className="text-xs opacity-50">选牌</span>
                </button>
              ) : (
                <div
                  className="w-[90px] h-[140px] sm:w-32 sm:h-48 rounded-xl border-2 border-dashed flex items-center justify-center"
                  style={{ borderColor: "var(--theme-border)" }}
                >
                  <span className="text-xs opacity-30" style={{ color: "var(--theme-accent)" }}>待抽</span>
                </div>
              )}
            </div>
          ))
        ) : (
          drawnCards.map((dc, i) => (
            <CardSlot
              key={`${dc.card.id}-${i}`}
              drawnCard={dc}
              index={i}
              revealed={isRevealed}
              onClick={() => {}}
            />
          ))
        )}
      </div>

      {/* Error */}
      {error && showInterpretation && (
        <div className="w-full max-w-3xl mt-6 mx-auto bg-red-950/30 border border-red-800/30 rounded-xl p-4 text-red-300 text-sm">
          {error}
          {error.includes("API Key") && (
            <button onClick={() => router.push("/settings")} className="ml-2 underline hover:text-red-200">
              前往设置
            </button>
          )}
        </div>
      )}

      {/* Hidden export preview */}
      {spread && drawnCards.length > 0 && (
        <ExportPreview ref={exportRef} spread={spread} cards={drawnCards} />
      )}

      {/* Custom card picker */}
      <CardPickerModal
        spread={spread}
        open={showPicker}
        onClose={() => setShowPicker(false)}
        onConfirm={handleCustomConfirm}
      />

      {/* Interpretation panel */}
      {showInterpretation && !error && (
        <InterpretationPanel visible={showInterpretation} exportRef={exportRef} />
      )}
    </div>
  );
}
