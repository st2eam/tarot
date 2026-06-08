"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import { useChatStore, type ChatMessage, type ChatContext } from "@/store/useChatStore";
import { useTarotStore } from "@/store/useTarotStore";
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
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const context = useChatStore((s) => s.context);
  const loadHistory = useChatStore((s) => s.loadHistory);
  const addUserMessage = useChatStore((s) => s.addUserMessage);
  const startAIMessage = useChatStore((s) => s.startAIMessage);
  const appendAIChunk = useChatStore((s) => s.appendAIChunk);
  const finishStreaming = useChatStore((s) => s.finishStreaming);
  const clearHistory = useChatStore((s) => s.clearHistory);

  const llmSettings = useTarotStore((s) => s.llmSettings);
  const readingHistory = useTarotStore((s) => s.readingHistory);
  const loadLLMSettings = useTarotStore((s) => s.loadLLMSettings);
  const loadReadingHistory = useTarotStore((s) => s.loadReadingHistory);
  const saveReading = useTarotStore((s) => s.saveReading);
  const setInterpretation = useTarotStore((s) => s.setInterpretation);

  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
    loadLLMSettings();
    loadReadingHistory();
  }, [loadHistory, loadLLMSettings, loadReadingHistory]);

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
        alert("请先在设置页面配置 API Key");
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

      try {
        await streamInterpretation(
          userPrompt,
          llmSettings.provider,
          llmSettings.apiKey,
          llmSettings.model,
          (chunk) => appendAIChunk(aiMsg.id, chunk),
          systemPrompt,
        );
      } catch (err) {
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
        alert("请先在设置页面配置 API Key");
        return;
      }

      const { spread, drawnCards } = context;
      const prompt = buildInterpretationPrompt(drawnCards, spread, styleId);
      const systemPrompt = getStyleSystemPrompt(styleId);
      const styleName = INTERPRETATION_STYLES.find((s) => s.id === styleId)?.label ?? "";

      addUserMessage(`请用「${styleName}」风格解读我的${spread.nameZh}牌阵`);
      setExpanded(true);

      const aiMsg = startAIMessage();

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
        );
        setInterpretation(fullText);
      } catch (err) {
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
      {/* Expand/collapse toggle + context actions */}
      <div className="px-3 sm:px-4 pt-2 pb-1 flex items-center gap-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors"
          style={{ color: "var(--theme-accent-secondary)" }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="font-medium">AI 塔罗师</span>
          {expanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronUp className="h-3 w-3" />
          )}
        </button>

        {/* Context-aware quick actions */}
        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {!isStreaming && <ContextActions
            context={context}
            onDailyInterpret={handleDailyInterpret}
            onSpreadInterpret={handleSpreadInterpret}
            onSendMessage={sendMessage}
            hasMessages={messages.length > 0}
          />}
        </div>

        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="shrink-0 p-1 rounded-md transition-colors"
            style={{ color: "var(--theme-text-muted)", opacity: 0.4 }}
            title="清空对话"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

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
            <div className="h-full overflow-y-auto px-3 sm:px-4 py-3 space-y-3">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-end px-3 sm:px-4 pb-3 pt-1">
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
            rows={1}
            disabled={isStreaming}
            className="w-full bg-transparent px-3 py-2.5 text-sm resize-none outline-none"
            style={{ color: "var(--theme-text)", maxHeight: 80 }}
          />
        </div>
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
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
