import type { ReadingRecord } from "@/store/useTarotStore";

export function buildReadingContext(history: ReadingRecord[], maxRecords = 3): string {
  if (history.length === 0) return "";
  const recent = history.slice(-maxRecords);
  return recent
    .map((r) => {
      const date = new Date(r.date).toLocaleDateString("zh-CN");
      const cards = r.cards
        .map((c) => `${c.position}=${c.name}(${c.orientation === "upright" ? "正位" : "逆位"})`)
        .join(", ");
      return `[${date}] ${r.spreadName}: ${cards}`;
    })
    .join("\n");
}
