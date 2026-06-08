import { spreadIds } from "@/data/spreads";
import SpreadClient from "./SpreadClient";

export function generateStaticParams() {
  return (spreadIds as string[]).map((type) => ({ type }));
}

export default function SpreadPage() {
  return <SpreadClient />;
}
