import { create } from "zustand";
import { DrawnCard, SpreadDefinition, LLMSettings } from "@/types";
import { dealSpread, buildCustomSpread, CustomCardSelection } from "@/lib/deck";
import { getSpreadById } from "@/data/spreads";
import { StyleId, DEFAULT_STYLE } from "@/lib/themes";

export interface ReadingRecord {
  date: string;
  spreadName: string;
  cards: { name: string; position: string; orientation: string }[];
}

interface TarotState {
  spread: SpreadDefinition | null;
  drawnCards: DrawnCard[];
  isDrawing: boolean;
  isRevealed: boolean;
  showInterpretation: boolean;
  interpretation: string;
  isStreaming: boolean;
  llmSettings: LLMSettings | null;
  cardStyle: StyleId;
  readingHistory: ReadingRecord[];

  setSpread: (spreadId: string) => void;
  drawCards: () => void;
  setCustomCards: (selections: CustomCardSelection[]) => void;
  revealCards: () => void;
  resetReading: () => void;
  setShowInterpretation: (show: boolean) => void;
  setInterpretation: (text: string) => void;
  appendInterpretation: (chunk: string) => void;
  setIsStreaming: (streaming: boolean) => void;
  setLLMSettings: (settings: LLMSettings) => void;
  loadLLMSettings: () => void;
  setCardStyle: (style: StyleId) => void;
  loadCardStyle: () => void;
  saveReading: () => void;
  loadReadingHistory: () => void;
  loadFromStorage: () => void;
}

export const useTarotStore = create<TarotState>((set, get) => ({
  spread: null,
  drawnCards: [],
  isDrawing: false,
  isRevealed: false,
  showInterpretation: false,
  interpretation: "",
  isStreaming: false,
  llmSettings: null,
  cardStyle: DEFAULT_STYLE,
  readingHistory: [],

  setSpread: (spreadId: string) => {
    const spread = getSpreadById(spreadId);
    if (spread) {
      set({ spread, drawnCards: [], isRevealed: false, showInterpretation: false, interpretation: "", isStreaming: false });
    }
  },

  drawCards: () => {
    const { spread } = get();
    if (!spread) return;
    set({ isDrawing: true, isRevealed: false, showInterpretation: false, interpretation: "" });
    const cards = dealSpread(spread.cardCount, spread.positions);
    set({ drawnCards: cards, isDrawing: false });
  },

  setCustomCards: (selections: CustomCardSelection[]) => {
    const { spread } = get();
    if (!spread) return;
    const cards = buildCustomSpread(selections, spread.positions);
    if (!cards) return;
    set({
      isDrawing: false,
      isRevealed: false,
      showInterpretation: false,
      interpretation: "",
      drawnCards: cards,
    });
  },

  revealCards: () => {
    set({ isRevealed: true });
  },

  resetReading: () => {
    set({ drawnCards: [], isDrawing: false, isRevealed: false, showInterpretation: false, interpretation: "", isStreaming: false });
  },

  setShowInterpretation: (show: boolean) => {
    set({ showInterpretation: show });
  },

  setInterpretation: (text: string) => {
    set({ interpretation: text });
  },

  appendInterpretation: (chunk: string) => {
    set((state) => ({ interpretation: state.interpretation + chunk }));
  },

  setIsStreaming: (isStreaming: boolean) => {
    set({ isStreaming });
  },

  setLLMSettings: (settings: LLMSettings) => {
    set({ llmSettings: settings });
    if (typeof window !== "undefined") {
      localStorage.setItem("tarot-llm-settings", JSON.stringify(settings));
    }
  },

  loadLLMSettings: () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("tarot-llm-settings");
        if (stored) {
          set({ llmSettings: JSON.parse(stored) });
        }
      } catch {
        // ignore parse errors
      }
    }
  },

  setCardStyle: (style: StyleId) => {
    set({ cardStyle: style });
    if (typeof window !== "undefined") {
      localStorage.setItem("tarot-card-style", style);
    }
  },

  loadCardStyle: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tarot-card-style") as StyleId | null;
      if (stored) {
        set({ cardStyle: stored });
      }
    }
  },

  saveReading: () => {
    const { spread, drawnCards, readingHistory } = get();
    if (!spread || drawnCards.length === 0) return;
    const record: ReadingRecord = {
      date: new Date().toISOString(),
      spreadName: spread.nameZh,
      cards: drawnCards.map((dc) => ({
        name: dc.card.nameZh,
        position: dc.position.name,
        orientation: dc.orientation,
      })),
    };
    const next = [...readingHistory, record].slice(-20);
    set({ readingHistory: next });
    if (typeof window !== "undefined") {
      localStorage.setItem("tarot-reading-history", JSON.stringify(next));
    }
  },

  loadReadingHistory: () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("tarot-reading-history");
        if (stored) set({ readingHistory: JSON.parse(stored) });
      } catch {}
    }
  },

  loadFromStorage: () => {
    const state = get();
    state.loadLLMSettings();
    state.loadCardStyle();
    state.loadReadingHistory();
  },
}));
