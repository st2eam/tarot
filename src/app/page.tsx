import { visibleSpreads } from "@/data/spreads";
import SpreadSelector from "@/components/home/SpreadSelector";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: "var(--theme-text)" }}>
          探索命运的指引
        </h1>
        <p className="text-lg max-w-md mx-auto" style={{ color: "var(--theme-text-muted)" }}>
          选择一种牌阵，让塔罗揭示隐藏在命运之轮中的讯息
        </p>
      </div>
      <SpreadSelector spreads={visibleSpreads} />
    </div>
  );
}
