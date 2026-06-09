"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTarotStore } from "@/store/useTarotStore";
import { useChatStore } from "@/store/useChatStore";
import { useShallow } from "zustand/react/shallow";
import { spreadIds } from "@/data/spreads";
import CardSlot from "@/components/spread/CardSlot";
import DrawButton from "@/components/spread/DrawButton";
import CardPickerModal from "@/components/spread/CardPickerModal";
import ExportPreview from "@/components/spread/ExportPreview";
import CardDetailModal from "@/components/card/CardDetailModal";
import { CustomCardSelection } from "@/lib/deck";
import { ArrowLeft, Shuffle, Hand, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { streamInterpretation } from "@/lib/llm-stream";
import {
  buildInterpretationPrompt,
  INTERPRETATION_STYLES,
  getStyleSystemPrompt,
} from "@/lib/prompts";
import { useToast } from "@/components/layout/Toast";
import { renderMarkdown } from "@/lib/markdown";
import { playFlipSound, playDrawSound, playCompleteSound } from "@/lib/sounds";
import type { InterpretationStyleId, DrawnCard } from "@/types";

const FOLLOW_UP_PROMPTS = [
  { label: "感情方面", prompt: "请从感情/人际关系的角度，再深入解读一下这个牌阵" },
  { label: "事业发展", prompt: "请从事业/工作/学业的角度，再深入解读一下这个牌阵" },
  { label: "具体建议", prompt: "请给我3条具体可执行的行动建议" },
  { label: "补充说明", prompt: "还有什么我没注意到的地方吗？请补充说明" },
];

export default function SpreadClient() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;

  const {
    spread,
    drawnCards,
    isDrawing,
    setSpread,
    drawCards,
    setCustomCards,
    resetReading,
  } = useTarotStore(
    useShallow((s) => ({
      spread: s.spread,
      drawnCards: s.drawnCards,
      isDrawing: s.isDrawing,
      setSpread: s.setSpread,
      drawCards: s.drawCards,
      setCustomCards: s.setCustomCards,
      revealCards: s.revealCards,
      resetReading: s.resetReading,
    }))
  );

  const llmSettings = useTarotStore((s) => s.llmSettings);
  const saveReading = useTarotStore((s) => s.saveReading);
  const setInterpretation = useTarotStore((s) => s.setInterpretation);
  const setContext = useChatStore((s) => s.setContext);
  const showToast = useToast((s) => s.show);

  const [error, setError] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState<"random" | "custom">("random");
  const [showPicker, setShowPicker] = useState(false);
  const [question, setQuestion] = useState("");
  const [showQuestionInput, setShowQuestionInput] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [inlineInterpretation, setInlineInterpretation] = useState("");
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretStyleId, setInterpretStyleId] = useState<InterpretationStyleId | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [detailCard, setDetailCard] = useState<DrawnCard | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);

  const allRevealed = drawnCards.length > 0 && revealedIndices.size === drawnCards.length;

  useEffect(() => {
    if (!(spreadIds as string[]).includes(type)) {
      router.replace("/");
      return;
    }
    setSpread(type);
    setContext({ type: "idle" });
    return () => {
      resetReading();
      setContext({ type: "idle" });
    };
  }, [type, router, setSpread, resetReading, setContext]);

  // Set spread-revealed context when all cards are revealed
  useEffect(() => {
    if (allRevealed && spread) {
      setContext({ type: "spread-revealed", spread, drawnCards });
    }
  }, [allRevealed, drawnCards, spread, setContext]);

  const resetLocalState = useCallback(() => {
    setRevealedIndices(new Set());
    setInlineInterpretation("");
    setIsInterpreting(false);
    setInterpretStyleId(null);
    setShowFollowUp(false);
    setError(null);
  }, []);

  const handleDraw = useCallback(() => {
    setError(null);
    setContext({ type: "idle" });
    resetLocalState();
    drawCards();
    playDrawSound();
  }, [drawCards, setContext, resetLocalState]);

  const revealCard = useCallback(
    (index: number) => {
      setRevealedIndices((prev) => {
        const next = new Set(prev);
        next.add(index);
        return next;
      });
      playFlipSound();
    },
    []
  );

  const handleCustomConfirm = useCallback(
    (selections: CustomCardSelection[]) => {
      setError(null);
      setContext({ type: "idle" });
      resetLocalState();
      setCustomCards(selections);
      playDrawSound();
    },
    [setCustomCards, setContext, resetLocalState],
  );

  const handleModeChange = useCallback(
    (mode: "random" | "custom") => {
      if (mode === drawMode) return;
      setDrawMode(mode);
      resetReading();
      setContext({ type: "idle" });
      resetLocalState();
      setError(null);
    },
    [drawMode, resetReading, setContext, resetLocalState],
  );

  const handleInterpret = useCallback(
    async (styleId: InterpretationStyleId) => {
      if (!spread || drawnCards.length === 0 || isInterpreting) return;
      if (!llmSettings?.apiKey) {
        showToast("请先在设置页面配置 API Key");
        return;
      }

      setInterpretStyleId(styleId);
      setIsInterpreting(true);
      setInlineInterpretation("");
      setShowFollowUp(false);

      const prompt = buildInterpretationPrompt(drawnCards, spread, styleId, question || undefined);
      const systemPrompt = getStyleSystemPrompt(styleId);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        let fullText = "";
        await streamInterpretation(
          prompt,
          llmSettings.provider,
          llmSettings.apiKey,
          llmSettings.model,
          (chunk) => {
            fullText += chunk;
            setInlineInterpretation((prev) => prev + chunk);
          },
          systemPrompt,
          controller.signal,
        );
        setInterpretation(fullText);
        setShowFollowUp(true);
        playCompleteSound();
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setInlineInterpretation(
          (prev) =>
            prev +
            `\n\n_发生错误: ${err instanceof Error ? err.message : "未知错误"}_`,
        );
      } finally {
        setIsInterpreting(false);
        saveReading();
      }
    },
    [spread, drawnCards, isInterpreting, llmSettings, question, showToast, setInterpretation, saveReading],
  );

  const handleFollowUp = useCallback(
    async (followUpPrompt: string) => {
      if (!llmSettings?.apiKey || isInterpreting) return;

      setIsInterpreting(true);
      setShowFollowUp(false);

      const context = `之前的解读:\n${inlineInterpretation}\n\n用户的追问: ${followUpPrompt}`;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await streamInterpretation(
          context,
          llmSettings.provider,
          llmSettings.apiKey,
          llmSettings.model,
          (chunk) => {
            setInlineInterpretation((prev) => prev + chunk);
          },
          undefined,
          controller.signal,
        );
        setShowFollowUp(true);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      } finally {
        setIsInterpreting(false);
      }
    },
    [llmSettings, isInterpreting, inlineInterpretation],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc to close modals
      if (e.key === "Escape") {
        if (showPicker) setShowPicker(false);
        if (detailCard) setDetailCard(null);
        return;
      }

      // Don't capture when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      // Number keys for interpretation styles when all revealed
      if (allRevealed && !isInterpreting && !inlineInterpretation) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= INTERPRETATION_STYLES.length) {
          handleInterpret(INTERPRETATION_STYLES[num - 1].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allRevealed, isInterpreting, inlineInterpretation, showPicker, detailCard, handleInterpret]);

  if (!spread) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-zinc-500">加载中...</div>
      </div>
    );
  }

  const hasCards = drawnCards.length > 0;

  return (
    <div className="flex-1 flex flex-col items-center px-3 sm:px-6 py-6 sm:py-8">
      {/* Top bar */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6 sm:mb-8">
        <button
          onClick={() => router.push("/")}
          aria-label="返回首页"
          className="flex items-center gap-1.5 transition-colors text-sm shrink-0"
          style={{ color: "var(--theme-text-muted)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">返回</span>
        </button>
        <div className="text-center flex-1 px-2">
          <h1 className="text-lg sm:text-xl font-bold leading-tight" style={{ color: "var(--theme-text)" }}>
            {spread.nameZh}
          </h1>
          <p className="text-xs hidden sm:block" style={{ color: "var(--theme-text-muted)" }}>
            {spread.name}
          </p>
        </div>
        <div className="w-8 sm:w-16 shrink-0" />
      </div>

      {/* Question input (before drawing) */}
      {!hasCards && (
        <div className="w-full max-w-lg mb-6">
          <button
            onClick={() => {
              setShowQuestionInput(!showQuestionInput);
              if (!showQuestionInput) {
                setTimeout(() => questionInputRef.current?.focus(), 100);
              }
            }}
            className="text-xs mb-2 transition-colors hover:underline"
            style={{ color: question ? "var(--theme-accent-secondary)" : "var(--theme-text-muted)" }}
          >
            {question ? `✧ 你的问题：${question}` : "+ 添加你想问的问题（可选）"}
          </button>
          {showQuestionInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2"
            >
              <textarea
                ref={questionInputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="默想你的问题，然后写在这里..."
                rows={2}
                className="flex-1 bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-purple-600/50 resize-none"
                style={{ color: "var(--theme-text)" }}
              />
            </motion.div>
          )}
        </div>
      )}

      {/* Draw mode toggle */}
      {!allRevealed && (
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
      )}

      {/* Draw / Redraw buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 sm:mb-8">
        {!hasCards ? (
          drawMode === "random" ? (
            <DrawButton onDraw={handleDraw} disabled={isDrawing} drawn={false} />
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
                选择牌面
              </span>
            </motion.button>
          )
        ) : (
          !isInterpreting && (
            <button
              onClick={() => {
                resetLocalState();
                if (drawMode === "random") {
                  handleDraw();
                } else {
                  setShowPicker(true);
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:brightness-110"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--theme-glass-border)",
                color: "var(--theme-text-muted)",
              }}
            >
              <RefreshCw className="h-4 w-4" />
              重新抽牌
            </button>
          )
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
              revealed={revealedIndices.has(i)}
              onClick={() => revealCard(i)}
              onDetailClick={() => setDetailCard(dc)}
            />
          ))
        )}
      </div>

      {/* Tap hint for unrevealed cards */}
      {hasCards && !allRevealed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-xs text-center"
          style={{ color: "var(--theme-text-muted)", opacity: 0.6 }}
        >
          点击卡牌逐张翻开
        </motion.p>
      )}

      {/* Interpretation style selection — shown after all revealed */}
      {allRevealed && !isInterpreting && !inlineInterpretation && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 w-full max-w-xl"
        >
          <p className="text-center text-sm mb-3" style={{ color: "var(--theme-text-muted)" }}>
            选择解读风格
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {INTERPRETATION_STYLES.map((style, i) => (
              <button
                key={style.id}
                onClick={() => handleInterpret(style.id)}
                className="glass-card rounded-full px-4 py-2 text-sm transition-all hover:brightness-110 flex items-center gap-1.5"
                style={{ color: "var(--theme-accent-secondary)" }}
              >
                <span className="text-xs opacity-50">{i + 1}</span>
                {style.icon} {style.label}
              </button>
            ))}
          </div>
          <p className="text-center text-xs mt-2" style={{ color: "var(--theme-text-muted)", opacity: 0.4 }}>
            也可按数字键 1-5 快速选择
          </p>
        </motion.div>
      )}

      {/* Inline interpretation area */}
      {(isInterpreting || inlineInterpretation) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 w-full max-w-2xl"
        >
          <div
            className="glass-card rounded-2xl p-5 sm:p-6"
            style={{ border: "1px solid var(--theme-glass-border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: "var(--theme-accent-secondary)" }}>
                {interpretStyleId
                  ? `${INTERPRETATION_STYLES.find((s) => s.id === interpretStyleId)?.icon} ${INTERPRETATION_STYLES.find((s) => s.id === interpretStyleId)?.label} 解读`
                  : "AI 解读"}
              </h3>
              {isInterpreting && (
                <span className="text-xs" style={{ color: "var(--theme-text-muted)" }}>
                  解读中...
                </span>
              )}
            </div>
            <div
              className="interpretation-text text-sm leading-relaxed"
              style={{ color: "var(--theme-text)" }}
            >
              {inlineInterpretation ? renderMarkdown(inlineInterpretation) : null}
            </div>

            {/* Follow-up buttons */}
            {showFollowUp && !isInterpreting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 pt-4"
                style={{ borderTop: "1px solid var(--theme-glass-border)" }}
              >
                <p className="text-xs mb-2" style={{ color: "var(--theme-text-muted)" }}>
                  换个角度看看：
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {FOLLOW_UP_PROMPTS.map((fp) => (
                    <button
                      key={fp.label}
                      onClick={() => handleFollowUp(fp.prompt)}
                      className="text-xs px-3 py-1.5 rounded-full transition-all hover:brightness-110"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid var(--theme-glass-border)",
                        color: "var(--theme-accent-secondary)",
                      }}
                    >
                      {fp.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Error */}
      {error && (
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

      {/* Card detail modal */}
      <CardDetailModal
        card={detailCard?.card ?? null}
        orientation={detailCard?.orientation ?? "upright"}
        open={detailCard !== null}
        onClose={() => setDetailCard(null)}
      />

      {/* Custom card picker */}
      <CardPickerModal
        spread={spread}
        open={showPicker}
        onClose={() => setShowPicker(false)}
        onConfirm={handleCustomConfirm}
      />
    </div>
  );
}
