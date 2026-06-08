export type MoonPhaseName =
  | "新月" | "蛾眉月" | "上弦月" | "盈凸月"
  | "满月" | "亏凸月" | "下弦月" | "残月";

export interface MoonPhaseInfo {
  phase: number;
  illumination: number;
  name: MoonPhaseName;
  emoji: string;
}

const SYNODIC_MONTH = 29.53058770576;

export function getMoonPhase(date: Date = new Date()): MoonPhaseInfo {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let r = year % 100;
  r = r % 19;
  if (r > 9) r -= 19;
  r = ((r * 11) % 30) + month + day;
  if (month < 3) r += 2;
  r -= ((year < 2000 ? 4 : 8.3) as number);
  r = Math.floor(r + 0.5) % 30;
  if (r < 0) r += 30;

  const phase = r;
  const normalizedPhase = phase / SYNODIC_MONTH;
  const illumination = (1 - Math.cos(normalizedPhase * 2 * Math.PI)) / 2;

  let name: MoonPhaseName;
  let emoji: string;

  if (phase <= 1 || phase >= 29) {
    name = "新月"; emoji = "🌑";
  } else if (phase <= 6) {
    name = "蛾眉月"; emoji = "🌒";
  } else if (phase <= 8) {
    name = "上弦月"; emoji = "🌓";
  } else if (phase <= 13) {
    name = "盈凸月"; emoji = "🌔";
  } else if (phase <= 16) {
    name = "满月"; emoji = "🌕";
  } else if (phase <= 21) {
    name = "亏凸月"; emoji = "🌖";
  } else if (phase <= 23) {
    name = "下弦月"; emoji = "🌗";
  } else {
    name = "残月"; emoji = "🌘";
  }

  return { phase, illumination, name, emoji };
}
