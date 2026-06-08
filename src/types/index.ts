export type Arcana = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type Element = "fire" | "water" | "air" | "earth";
export type Orientation = "upright" | "reversed";

export interface TarotCard {
  id: string;
  name: string;
  nameZh: string;
  arcana: Arcana;
  suit: Suit | null;
  number: number;
  keywords: string[];
  meaning: {
    upright: string;
    reversed: string;
  };
  description: string;
  element: Element | null;
}

export interface SpreadPosition {
  id: string;
  name: string;
  description: string;
  x: number; // percentage position for layout
  y: number;
}

export interface SpreadDefinition {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
}

export interface DrawnCard {
  card: TarotCard;
  orientation: Orientation;
  position: SpreadPosition;
}

export interface SpreadReading {
  spread: SpreadDefinition;
  cards: DrawnCard[];
  question?: string;
}

export interface LLMSettings {
  provider: "openai" | "anthropic" | "deepseek";
  apiKey: string;
  model: string;
}

export type InterpretationStyleId = "concise" | "detailed" | "storytelling" | "savage" | "healing";

export interface InterpretationStyle {
  id: InterpretationStyleId;
  label: string;
  icon: string;
  desc: string;
}
