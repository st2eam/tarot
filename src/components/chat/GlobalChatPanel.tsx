"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Trash2, X, Sparkles } from "lucide-react";
import { useChatStore, type ChatMessage } from "@/store/useChatStore";
import { useTarotStore } from "@/store/useTarotStore";
import { useToast } from "@/components/layout/Toast";
import { streamInterpretation } from "@/lib/llm-stream";
import { buildChatSystemPrompt, QUICK_TOPICS, AI_GREETING } from "@/lib/chat-prompts";
import { buildReadingContext } from "@/lib/reading-context";
import { renderMarkdown } from "@/lib/markdown";

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
    llmSettings, readingHistory, saveReading,
  } = useTarotStore(
    useShallow((s) => ({
      llmSettings: s.llmSettings,
      readingHistory: s.readingHistory,
      saveReading: s.saveReading,
    }))
  );

  const showToast = useToast((s) => s.show);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [lastSeen, setLastSeen] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("tarot-chat-last-seen") ?? "0", 10);
    }
    return 0;
  });

  // Auto-scroll
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Auto-open when streaming
  useEffect(() => {
    if (isStreaming) setOpen(true);
  }, [isStreaming]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;
      if (!llmSettings?.apiKey) {
        showToast("请先在设置页面配置 API Key");
        return;
      }

      addUserMessage(content.trim());
      setInput("");

      const aiMsg = startAIMessage();
      const readingCtx = buildReadingContext(readingHistory);
      const systemPrompt = buildChatSystemPrompt(readingCtx);

      const recentMessages = [
        ...messages.slice(-10),
        { role: "user" as const, content: content.trim() },
      ];
      const chatContext = recentMessages
        .map((m) => `${m.role === "user" ? "用户" : "AI"}: ${m.content}`)
        .join("\n\n");

      const userPrompt = `以下是对话历史:\n${chatContext}\n\n请回复最后一条用户消息。`;

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
        saveReading();
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
      isStreaming, llmSettings, messages, readingHistory,
      showToast, addUserMessage, startAIMessage,
      appendAIChunk, finishStreaming, saveReading,
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

  const handleStop = () => {
    abortRef.current?.abort();
  };

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

  const handleClear = () => {
    clearHistory();
    setShowConfirmClear(false);
  };

  const unreadCount = Math.max(0, messages.length - lastSeen);
  const hasUnread = unreadCount > 0;

  const markAllRead = () => {
    const count = messages.length;
    setLastSeen(count);
    try { localStorage.setItem("tarot-chat-last-seen", String(count)); } catch {}
  };

  const handleOpen = () => {
    markAllRead();
    setOpen(true);
  };

  const handleClose = () => {
    markAllRead();
    setOpen(false);
  };

  return (
    <>
      {/* Floating FAB button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, var(--theme-accent), var(--theme-accent-secondary))",
              boxShadow: "0 8px 32px var(--theme-glow)",
            }}
            aria-label="打开对话"
          >
            <MessageCircle className="h-6 w-6 text-white" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 99 ? "99" : unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Slide-up panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full sm:max-w-lg sm:max-h-[85vh] sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl"
              style={{
                height: "min(90vh, 600px)",
                background: "var(--theme-glass-bg)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid var(--theme-glass-border)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="shrink-0 flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid var(--theme-glass-border)" }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" style={{ color: "var(--theme-accent)" }} />
                  <span className="font-semibold text-sm" style={{ color: "var(--theme-text)" }}>
                    AI Tarot 对话
                  </span>
                  {isStreaming && (
                    <span className="text-xs" style={{ color: "var(--theme-accent-secondary)" }}>
                      · 回复中...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {/* Stop generating */}
                  {isStreaming && (
                    <button
                      onClick={handleStop}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:brightness-110"
                      style={{
                        background: "rgba(239,68,68,0.2)",
                        color: "#f87171",
                        border: "1px solid rgba(239,68,68,0.3)",
                      }}
                    >
                      停止生成
                    </button>
                  )}

                  {/* Clear */}
                  {messages.length > 0 && !isStreaming && (
                    <>
                      {showConfirmClear ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs" style={{ color: "var(--theme-text-muted)" }}>
                            确认清空？
                          </span>
                          <button
                            onClick={handleClear}
                            className="text-xs px-2 py-1 rounded-md font-medium bg-red-500/20 text-red-400"
                          >
                            确认
                          </button>
                          <button
                            onClick={() => setShowConfirmClear(false)}
                            className="text-xs px-2 py-1 rounded-md"
                            style={{ color: "var(--theme-text-muted)" }}
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowConfirmClear(true)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-zinc-700/50"
                          style={{ color: "var(--theme-text-muted)" }}
                          title="清空对话"
                          aria-label="清空对话"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </>
                  )}

                  {/* Close */}
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-lg transition-colors hover:bg-zinc-700/50"
                    style={{ color: "var(--theme-text-muted)" }}
                    aria-label="关闭对话"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Sparkles className="h-8 w-8" style={{ color: "var(--theme-accent)", opacity: 0.4 }} />
                    <p
                      className="text-xs text-center max-w-xs leading-relaxed"
                      style={{ color: "var(--theme-text-muted)", opacity: 0.7 }}
                    >
                      {AI_GREETING}
                    </p>

                    {/* Quick topic chips */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {QUICK_TOPICS.map((topic) => (
                        <button
                          key={topic.label}
                          onClick={() => sendMessage(topic.prompt)}
                          className="shrink-0 glass-card rounded-full px-3 py-1.5 text-xs transition-all hover:brightness-110"
                          style={{ color: "var(--theme-accent-secondary)" }}
                        >
                          {topic.label}
                        </button>
                      ))}
                    </div>

                    {/* Daily card quick action */}
                    {context.type === "daily-card" && (
                      <button
                        onClick={handleDailyInterpret}
                        className="shrink-0 glass-card rounded-full px-4 py-2 text-sm transition-all hover:brightness-110"
                        style={{ color: "var(--theme-accent-secondary)" }}
                      >
                        ✨ 解读今日「{context.card.nameZh}」
                      </button>
                    )}
                  </div>
                ) : (
                  messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))
                )}

                {/* Streaming indicator */}
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

              {/* Input bar */}
              <form
                onSubmit={handleSubmit}
                className="shrink-0 flex gap-2 items-end px-4 py-3"
                style={{
                  borderTop: "1px solid var(--theme-glass-border)",
                  paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
                }}
              >
                <div
                  className="flex-1 rounded-xl overflow-hidden"
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid var(--theme-glass-border)",
                  }}
                >
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
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
                    background: input.trim() && !isStreaming
                      ? "var(--theme-accent)"
                      : "rgba(0,0,0,0.3)",
                    color: input.trim() && !isStreaming ? "#fff" : "var(--theme-text-muted)",
                    opacity: isStreaming ? 0.5 : 1,
                  }}
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
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
