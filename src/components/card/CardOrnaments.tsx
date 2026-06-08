/**
 * Reusable SVG ornamental elements for the tarot card frame.
 * All colors use currentColor so they adapt to the theme via CSS.
 */

/** Art-deco corner bracket — rendered in 4 rotations for each corner */
export function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* L-bracket */}
      <path
        d="M2 2 L10 2 L10 3.5 L3.5 3.5 L3.5 10 L2 10 Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Inner accent dot */}
      <circle cx="10" cy="10" r="1.5" fill="currentColor" opacity="0.7" />
      {/* Connecting dot */}
      <circle cx="6" cy="6" r="0.8" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

/** Thin horizontal ornamental divider with a centered diamond */
export function CardDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 8"
      width="80"
      height="8"
      fill="none"
      className={className}
      aria-hidden
    >
      <line x1="0" y1="4" x2="33" y2="4" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      {/* Diamond */}
      <path d="M40 1 L43 4 L40 7 L37 4 Z" fill="currentColor" opacity="0.8" />
      <line x1="47" y1="4" x2="80" y2="4" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}

/** Small centered star/asterisk for section separators */
export function StarMark({ size = 8 }: { size?: number }) {
  return (
    <svg viewBox="0 0 10 10" width={size} height={size} fill="none" aria-hidden>
      <path
        d="M5 1 L5.5 4.5 L9 5 L5.5 5.5 L5 9 L4.5 5.5 L1 5 L4.5 4.5 Z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

/** Roman numeral lookup */
const ROMAN: Record<number, string> = {
  0: "0", 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V",
  6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X",
  11: "XI", 12: "XII", 13: "XIII", 14: "XIV", 15: "XV",
  16: "XVI", 17: "XVII", 18: "XVIII", 19: "XIX", 20: "XX",
  21: "XXI",
};

const SUIT_SYMBOL: Record<string, string> = {
  wands: "🔥",
  cups: "💧",
  swords: "⚔",
  pentacles: "⭐",
};

const COURT_ZH: Record<number, string> = {
  11: "侍从",
  12: "骑士",
  13: "王后",
  14: "国王",
};

export function getCardRomanNumeral(number: number, arcana: string): string {
  if (arcana === "major") return ROMAN[number] ?? String(number);
  if (number >= 11 && number <= 14) return COURT_ZH[number] ?? String(number);
  return String(number);
}

export function getSuitSymbol(suit: string | null): string {
  if (!suit) return "";
  return SUIT_SYMBOL[suit] ?? "";
}
