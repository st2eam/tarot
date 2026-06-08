"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTarotStore } from "@/store/useTarotStore";
import { useShallow } from "zustand/react/shallow";
import { spreadIds } from "@/data/spreads";
import { buildInterpretationPrompt } from "@/lib/prompts";
import { streamInterpretation } from "@/lib/llm-stream";
import CardSlot from "@/components/spread/CardSlot";
import DrawButton from "@/components/spread/DrawButton";
import CardPickerModal from "@/components/spread/CardPickerModal";
import InterpretationPanel from "@/components/spread/InterpretationPanel";
import ExportPreview from "@/components/spread/ExportPreview";
import { CustomCardSelection } from "@/lib/deck";
import { ArrowLeft, Wand2, Shuffle, Hand } from "lucide-react";
import { motion } from "framer-motion";

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
  const exportRef = useRef<HTMLDivElement>(null);

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

    const prompt = buildInterpretationPrompt(drawnCards, spread);

    try {
      await streamInterpretation(
        prompt,
        settings.provider,
        settings.apiKey,
        settings.model,
        (chunk) => appendInterpretation(chunk)
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
    <div className="flex-1 flex flex-col items-center px-6 py-8">
      {/* Top bar */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 transition-colors text-sm"
          style={{ color: "var(--theme-text-muted)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold" style={{ color: "var(--theme-text)" }}>{spread.nameZh}</h1>
          <p className="text-xs" style={{ color: "var(--theme-text-muted)" }}>{spread.name}</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Draw mode toggle */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl mb-4"
        style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--theme-border)" }}
      >
        <button
          onClick={() => handleModeChange("random")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
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
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
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
      <div className="flex items-center gap-4 mb-8">
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
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleInterpret}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-base text-white transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, var(--theme-accent-secondary), var(--theme-accent))",
              boxShadow: "0 4px 16px var(--theme-glow)",
            }}
          >
            <Wand2 className="h-4 w-4" />
            AI 解读
          </motion.button>
        )}
      </div>

      {/* Card slots grid */}
      <div
        className="relative w-full max-w-3xl mx-auto flex flex-wrap items-start justify-center gap-6"
        style={{ minHeight: "300px" }}
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
                  className="w-32 h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                  style={{ borderColor: "var(--theme-border-hover)", color: "var(--theme-accent)" }}
                >
                  <Hand className="h-5 w-5 opacity-50" />
                  <span className="text-xs opacity-50">点击选牌</span>
                </button>
              ) : (
                <div
                  className="w-32 h-48 rounded-xl border-2 border-dashed flex items-center justify-center"
                  style={{ borderColor: "var(--theme-border)" }}
                >
                  <span className="text-xs opacity-30" style={{ color: "var(--theme-accent)" }}>待抽牌</span>
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
