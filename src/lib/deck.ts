import { TarotCard, Orientation, DrawnCard, SpreadPosition } from "@/types";
import { allCards } from "@/data/tarot-cards";

export function shuffleDeck(cards: TarotCard[]): TarotCard[] {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function drawCards(
  deck: TarotCard[],
  count: number
): { card: TarotCard; orientation: Orientation }[] {
  const shuffled = shuffleDeck(deck);
  return shuffled.slice(0, count).map((card) => ({
    card,
    orientation: Math.random() > 0.5 ? "upright" : "reversed",
  }));
}

export function dealSpread(
  count: number,
  positions: SpreadPosition[]
): DrawnCard[] {
  const drawn = drawCards(allCards, count);
  return drawn.map((d, i) => ({
    ...d,
    position: positions[i],
  }));
}

export function getFullDeck(): TarotCard[] {
  return [...allCards];
}

export interface CustomCardSelection {
  cardId: string;
  orientation: Orientation;
}

export function buildCustomSpread(
  selections: CustomCardSelection[],
  positions: SpreadPosition[]
): DrawnCard[] | null {
  if (selections.length !== positions.length) return null;

  const usedIds = new Set<string>();
  const cards: DrawnCard[] = [];

  for (let i = 0; i < positions.length; i++) {
    const { cardId, orientation } = selections[i];
    if (usedIds.has(cardId)) return null;

    const card = allCards.find((c) => c.id === cardId);
    if (!card) return null;

    usedIds.add(cardId);
    cards.push({ card, orientation, position: positions[i] });
  }

  return cards;
}
