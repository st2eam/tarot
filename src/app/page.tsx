import { visibleSpreads } from "@/data/spreads";
import SpreadSelector from "@/components/home/SpreadSelector";
import DailyCard from "@/components/home/DailyCard";
import MoonIndicator from "@/components/home/MoonIndicator";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center mb-10 sm:mb-14">
        <div className="flex justify-center mb-4">
          <MoonIndicator />
        </div>
        <h1
          className="font-serif-zh text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight"
          style={{ color: "var(--theme-text)" }}
        >
          探索命运的指引
        </h1>
        <p className="text-base sm:text-lg max-w-md mx-auto" style={{ color: "var(--theme-text-muted)" }}>
          让塔罗揭示隐藏在命运之轮中的讯息
        </p>
      </div>

      <div className="mb-12 sm:mb-16 w-full flex justify-center">
        <DailyCard />
      </div>

      <div className="w-full flex justify-center">
        <SpreadSelector spreads={visibleSpreads} />
      </div>
    </div>
  );
}
