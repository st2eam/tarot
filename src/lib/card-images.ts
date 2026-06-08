import type { StyleId } from "./themes";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** All 78 tarot card IDs — images generated at /public/cards/{style}/{cardId}.jpg */
const CARD_IDS = new Set([
  // Major Arcana (22)
  "fool", "magician", "high-priestess", "empress", "emperor",
  "hierophant", "lovers", "chariot", "strength", "hermit",
  "wheel-of-fortune", "justice", "hanged-man", "death", "temperance",
  "devil", "tower", "star", "moon", "sun", "judgement", "world",
  // Wands (14)
  "wand-ace", "wand-two", "wand-three", "wand-four", "wand-five",
  "wand-six", "wand-seven", "wand-eight", "wand-nine", "wand-ten",
  "wand-page", "wand-knight", "wand-queen", "wand-king",
  // Cups (14)
  "cup-ace", "cup-two", "cup-three", "cup-four", "cup-five",
  "cup-six", "cup-seven", "cup-eight", "cup-nine", "cup-ten",
  "cup-page", "cup-knight", "cup-queen", "cup-king",
  // Swords (14)
  "sword-ace", "sword-two", "sword-three", "sword-four", "sword-five",
  "sword-six", "sword-seven", "sword-eight", "sword-nine", "sword-ten",
  "sword-page", "sword-knight", "sword-queen", "sword-king",
  // Pentacles (14)
  "pentacle-ace", "pentacle-two", "pentacle-three", "pentacle-four", "pentacle-five",
  "pentacle-six", "pentacle-seven", "pentacle-eight", "pentacle-nine", "pentacle-ten",
  "pentacle-page", "pentacle-knight", "pentacle-queen", "pentacle-king",
]);

export function hasCardImage(cardId: string): boolean {
  return CARD_IDS.has(cardId);
}

/** Returns {basePath}/cards/{style}/{cardId}.jpg, falls back to classical if no style given */
export function getCardImageSrc(cardId: string, style?: StyleId): string {
  if (!CARD_IDS.has(cardId)) return "";
  return `${BASE_PATH}/cards/${style ?? "classical"}/${cardId}.jpg`;
}

/** Fallback always points to the classical directory */
export function getCardImageFallbackSrc(cardId: string): string {
  if (!CARD_IDS.has(cardId)) return "";
  return `${BASE_PATH}/cards/classical/${cardId}.jpg`;
}
