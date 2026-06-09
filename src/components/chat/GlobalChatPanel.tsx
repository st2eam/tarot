"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, ChevronDown } from "lucide-react";
import { useChatStore, type ChatMessage, type ChatContext } from "@/store/useChatStore";
import { useTarotStore } from "@/store/useTarotStore";
import { useToast } from "@/components/layout/Toast";
import { streamInterpretation } from "@/lib/llm-stream";
import { buildChatSystemPrompt, QUICK_TOPICS, AI_GREETING } from "@/lib/chat-prompts";
import {
  buildInterpretationPrompt,
  INTERPRETATION_STYLES,
  getStyleSystemPrompt,
} from "@/lib/prompts";
import { buildReadingContext } from "@/lib/reading-context";
import { renderMarkdown } from "@/lib/markdown";
import type { InterpretationStyleId } from "@/types";

export default function GlobalChatPanel() {
  const {
    messages, isStreaming, context,
    addUserMessage, startAIMessage,
    appendAIChunk, finishStreaming, clearHistory,
  } = useChatStore(
    useShallow((s) => ({
      messages: s.messages,
      isStreaming: s.isStreaming,
      context: s.context,
      addUserMessage: s.addUserMessage,
      startAIMessage: s.startAIMessage,
      appendAIChunk: s.appendAIChunk,
      finishStreaming: s.finishStreaming,
      clearHistory: s.clearHistory,
    }))
  );

  const {
    llmSettings, readingHistory,
    saveReading, setInterpretation,
  } = useTarotStore(
    useShallow((s) => ({
      llmSettings: s.llmSettings,
      readingHistory: s.readingHistory,
      saveReading: s.saveReading,
      setInterpretation: s.setInterpretation,
    }))
  );

  const showToast = useToast((s) => s.show);
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (expanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, expanded]);

  // Auto-expand when streaming starts
  useEffect(() => {
    if (isStreaming) setExpanded(true);
  }, [isStreaming]);

  const sendMessage = useCallback(
    async (content: string, systemPromptOverride?: string) => {
      if (!content.trim() || isStreaming) return;
      if (!llmSettings?.apiKey) {
        showToast("请先在设置页面配置 API Key");
        return;
      }

      addUserMessage(content.trim());
      setInput("");
      setExpanded(true);

      const aiMsg = startAIMessage();

      const readingCtx = buildReadingContext(readingHistory);
      const systemPrompt = systemPromptOverride ?? buildChatSystemPrompt(readingCtx);

      const recentMessages = [
        ...messages.slice(-10),
        { role: "user" as const, content: content.trim() },
      ];
      const chatContext = recentMessages
        .map((m) => `${m.role === "user" ? "用户" : "AI"}: ${m.content}`)
        .join("\n\n");

      const userPrompt = `以下是对话历史:\n${chatContext}\n\n请回复最后一条用户消息。`;

      // Abort any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await streamInterpretation(
          userPrompt,
          llmSettings.provider,
          llmSettings.apiKey,
          llmSettings.model,
          (chunk) => appendAIChunk(aiMsg.id, chunk),
          systemPrompt,
          controller.signal,
        );
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        appendAIChunk(
          aiMsg.id,
          `\n\n_发生错误: ${err instanceof Error ? err.message : "未知错误"}_`,
        );
      } finally {
        finishStreaming();
      }
    },
    [
      isStreaming,
      llmSettings,
      messages,
      readingHistory,
      showToast,
      addUserMessage,
      startAIMessage,
      appendAIChunk,
      finishStreaming,
    ],
  );

  const handleSpreadInterpret = useCallback(
    async (styleId: InterpretationStyleId) => {
      if (context.type !== "spread-revealed" || isStreaming) return;
      if (!llmSettings?.apiKey) {
        showToast("请先在设置页面配置 API Key");
        return;
      }

      const { spread, drawnCards } = context;
      const prompt = buildInterpretationPrompt(drawnCards, spread, styleId);
      const systemPrompt = getStyleSystemPrompt(styleId);
      const styleName = INTERPRETATION_STYLES.find((s) => s.id === styleId)?.label ?? "";

      addUserMessage(`请用「${styleName}」风格解读我的${spread.nameZh}牌阵`);
      setExpanded(true);

      const aiMsg = startAIMessage();

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
            appendAIChunk(aiMsg.id, chunk);
          },
          systemPrompt,
          controller.signal,
        );
        setInterpretation(fullText);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        appendAIChunk(
          aiMsg.id,
          `\n\n_发生错误: ${err instanceof Error ? err.message : "未知错误"}_`,
        );
      } finally {
        finishStreaming();
        saveReading();
      }
    },
    [
      context,
      isStreaming,
      llmSettings,
      showToast,
      addUserMessage,
      startAIMessage,
      appendAIChunk,
      finishStreaming,
      saveReading,
      setInterpretation,
    ],
  );

  const handleDailyInterpret = useCallback(() => {
    if (context.type !== "daily-card") return;
    const { card, orientation } = context;
    const orient = orientation === "upright" ? "正位" : "逆位";
    sendMessage(
      `今天的每日一牌是「${card.nameZh}」（${card.name}）${orient}，请帮我解读一下这张牌对我今天的指引。`,
    );
  }, [context, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div
      className="shrink-0 z-40 flex flex-col"
      style={{
        borderTop: "1px solid var(--theme-glass-border)",
        background: "var(--theme-glass-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Context-aware quick actions — centered when collapsed, left-aligned inside panel when expanded */}
      {!expanded && !isStreaming && (
        <div className="px-3 sm:px-4 pt-2 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar justify-center">
          <ContextActions
            context={context}
            onDailyInterpret={handleDailyInterpret}
            onSpreadInterpret={handleSpreadInterpret}
            onSendMessage={sendMessage}
            hasMessages={messages.length > 0}
          />
        </div>
      )}

      {/* Messages area (collapsible) */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "clamp(180px, 35vh, 320px)", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Top bar: quick actions (left) + collapse arrow (center) + clear (right) */}
              <div className="shrink-0 flex items-center px-3 sm:px-4 py-1.5 gap-2"
                style={{ borderBottom: "1px solid var(--theme-glass-border)" }}
              >
                {/* Quick actions — left aligned */}
                {!isStreaming && (
                  <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <ContextActions
                      context={context}
                      onDailyInterpret={handleDailyInterpret}
                      onSpreadInterpret={handleSpreadInterpret}
                      onSendMessage={sendMessage}
                      hasMessages={messages.length > 0}
                    />
                  </div>
                )}
                {isStreaming && <div className="flex-1" />}

                {/* Collapse */}
                <button
                  onClick={() => setExpanded(false)}
                  className="shrink-0 px-3 py-0.5 rounded-full transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "var(--theme-accent-secondary)",
                  }}
                  title="收起面板"
                  aria-label="收起面板"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Clear with confirm */}
                {messages.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm("确定要清空所有对话记录吗？")) {
                        clearHistory();
                      }
                    }}
                    className="shrink-0 text-xs flex items-center gap-1 px-2 py-0.5 rounded-md transition-opacity hover:opacity-60"
                    style={{ color: "var(--theme-text-muted)", opacity: 0.3 }}
                  >
                    <Trash2 className="h-3 w-3" />
                    清空
                  </button>
                )}
              </div>

              {/* Scrollable messages */}
              <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-2 space-y-3">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-center" style={{ color: "var(--theme-text-muted)", opacity: 0.6 }}>
                    {AI_GREETING}
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {isStreaming && messages[messages.length - 1]?.content === "" && (
                <div className="flex gap-1 px-3 py-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--theme-accent)" }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-end px-3 sm:px-4 pt-1"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div
          className="flex-1 rounded-xl overflow-hidden"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid var(--theme-glass-border)",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setExpanded(true)}
            placeholder="问我任何关于塔罗的问题..."
            aria-label="输入消息"
            rows={1}
            disabled={isStreaming}
            className="w-full bg-transparent px-3 py-2.5 text-sm resize-none outline-none"
            style={{ color: "var(--theme-text)", maxHeight: 80 }}
          />
        </div>
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          aria-label="发送消息"
          className="shrink-0 p-2.5 rounded-xl transition-all duration-200"
          style={{
            background: input.trim() ? "var(--theme-accent)" : "rgba(0,0,0,0.3)",
            color: input.trim() ? "#fff" : "var(--theme-text-muted)",
            opacity: isStreaming ? 0.5 : 1,
          }}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function ContextActions({
  context,
  onDailyInterpret,
  onSpreadInterpret,
  onSendMessage,
  hasMessages,
}: {
  context: ChatContext;
  onDailyInterpret: () => void;
  onSpreadInterpret: (styleId: InterpretationStyleId) => void;
  onSendMessage: (msg: string) => void;
  hasMessages: boolean;
}) {
  if (context.type === "daily-card") {
    return (
      <button
        onClick={onDailyInterpret}
        className="shrink-0 glass-card rounded-full px-3 py-1 text-xs transition-all hover:brightness-110"
        style={{ color: "var(--theme-accent-secondary)" }}
      >
        ✨ 解读今日「{context.card.nameZh}」
      </button>
    );
  }

  if (context.type === "spread-revealed") {
    return (
      <>
        {INTERPRETATION_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSpreadInterpret(style.id)}
            className="shrink-0 glass-card rounded-full px-3 py-1 text-xs transition-all hover:brightness-110"
            style={{ color: "var(--theme-accent-secondary)" }}
          >
            {style.icon} {style.label}
          </button>
        ))}
      </>
    );
  }

  if (!hasMessages) {
    return (
      <>
        {QUICK_TOPICS.map((topic) => (
          <button
            key={topic.label}
            onClick={() => onSendMessage(topic.prompt)}
            className="shrink-0 glass-card rounded-full px-3 py-1 text-xs transition-all hover:brightness-110"
            style={{ color: "var(--theme-accent-secondary)" }}
          >
            {topic.label}
          </button>
        ))}
      </>
    );
  }

  return null;
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 text-xs sm:text-sm leading-relaxed ${
          isUser ? "" : "glass-card"
        }`}
        style={
          isUser
            ? {
                background: "rgba(79,70,229,0.25)",
                border: "1px solid rgba(99,102,241,0.2)",
                color: "var(--theme-text)",
              }
            : {
                borderLeft: "2px solid var(--theme-accent)",
                color: "var(--theme-text)",
              }
        }
      >
        {isUser ? (
          <p style={{ whiteSpace: "pre-wrap" }}>{message.content}</p>
        ) : (
          <div className="interpretation-text">
            {message.content ? renderMarkdown(message.content) : null}
          </div>
        )}
      </div>
    </motion.div>
  );
}
