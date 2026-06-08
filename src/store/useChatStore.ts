import { create } from "zustand";
import type { TarotCard, Orientation, SpreadDefinition, DrawnCard } from "@/types";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export type ChatContext =
  | { type: "idle" }
  | { type: "daily-card"; card: TarotCard; orientation: Orientation }
  | { type: "spread-revealed"; spread: SpreadDefinition; drawnCards: DrawnCard[] };

const STORAGE_KEY = "tarot-chat-messages";
const MAX_MESSAGES = 100;

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  context: ChatContext;

  loadHistory: () => void;
  addUserMessage: (content: string) => ChatMessage;
  startAIMessage: () => ChatMessage;
  appendAIChunk: (messageId: string, chunk: string) => void;
  finishStreaming: () => void;
  clearHistory: () => void;
  setContext: (ctx: ChatContext) => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function saveMessages(messages: ChatMessage[]) {
  try {
    const trimmed = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {}
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  context: { type: "idle" } as ChatContext,

  loadHistory: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ messages: JSON.parse(stored) });
      }
    } catch {}
  },

  addUserMessage: (content: string) => {
    const msg: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      timestamp: Date.now(),
    };
    set((state) => {
      const next = [...state.messages, msg];
      saveMessages(next);
      return { messages: next };
    });
    return msg;
  },

  startAIMessage: () => {
    const msg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };
    set((state) => ({
      messages: [...state.messages, msg],
      isStreaming: true,
    }));
    return msg;
  },

  appendAIChunk: (messageId: string, chunk: string) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, content: m.content + chunk } : m
      ),
    }));
  },

  finishStreaming: () => {
    const { messages } = get();
    saveMessages(messages);
    set({ isStreaming: false });
  },

  clearHistory: () => {
    set({ messages: [] });
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  },

  setContext: (ctx: ChatContext) => {
    set({ context: ctx });
  },
}));
