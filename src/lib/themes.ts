export type StyleId =
  | "classical"
  | "art_nouveau"
  | "watercolor"
  | "dark_fantasy"
  | "minimalist"
  | "japanese"
  | "cyberpunk"
  | "oil_painting";

export interface CardStyleTheme {
  bgPrimary: string;
  bgGradientVia: string;
  bgGradientTo: string;
  surface: string;
  surfaceHover: string;
  border: string;
  borderHover: string;
  accentPrimary: string;
  accentSecondary: string;
  accentGlow: string;
  textPrimary: string;
  textMuted: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;
  // Canvas background
  starColor: string;
  starColorAlt: string;
  canvasEffect: "stars" | "sakura" | "glitch" | "mist" | "particles" | "sparkle";
}

export interface CardStyle {
  id: StyleId;
  name: string;
  nameZh: string;
  emoji: string;
  description: string;
  descriptionZh: string;
  palette: string[];
  theme: CardStyleTheme;
}

export const CARD_STYLES: CardStyle[] = [
  {
    id: "classical",
    name: "Classical",
    nameZh: "古典插画",
    emoji: "🔮",
    description: "Rider-Waite-Smith inspired",
    descriptionZh: "莱德·韦特传统风格，神秘紫金",
    palette: ["#8b5cf6", "#c4a0ff", "#0a0012", "#3b1f6e"],
    theme: {
      bgPrimary: "#0a0012",
      bgGradientVia: "#10001a",
      bgGradientTo: "#0a0018",
      surface: "rgba(88,28,135,0.18)",
      surfaceHover: "rgba(88,28,135,0.32)",
      border: "rgba(109,40,217,0.3)",
      borderHover: "rgba(167,139,250,0.5)",
      accentPrimary: "#8b5cf6",
      accentSecondary: "#c4a0ff",
      accentGlow: "rgba(139,92,246,0.35)",
      textPrimary: "#ede6f5",
      textMuted: "#9ca3af",
      scrollbarThumb: "#3b1f6e",
      scrollbarThumbHover: "#5b3f9e",
      starColor: "rgba(180,140,255,",
      starColorAlt: "rgba(220,190,255,",
      canvasEffect: "stars",
    },
  },
  {
    id: "art_nouveau",
    name: "Art Nouveau",
    nameZh: "新艺术运动",
    emoji: "🌿",
    description: "Organic forms, copper & sage",
    descriptionZh: "流动有机线条，铜绿与金色",
    palette: ["#5a8a6a", "#c9943a", "#020a06", "#2d5a40"],
    theme: {
      bgPrimary: "#020a06",
      bgGradientVia: "#061508",
      bgGradientTo: "#020806",
      surface: "rgba(22,78,48,0.2)",
      surfaceHover: "rgba(22,78,48,0.36)",
      border: "rgba(74,138,100,0.3)",
      borderHover: "rgba(134,180,140,0.5)",
      accentPrimary: "#5a9a6e",
      accentSecondary: "#c9943a",
      accentGlow: "rgba(90,154,110,0.35)",
      textPrimary: "#e8f0ea",
      textMuted: "#9cb8a5",
      scrollbarThumb: "#2d5a40",
      scrollbarThumbHover: "#4a7c59",
      starColor: "rgba(140,200,160,",
      starColorAlt: "rgba(200,160,80,",
      canvasEffect: "particles",
    },
  },
  {
    id: "watercolor",
    name: "Watercolor",
    nameZh: "水彩插画",
    emoji: "🎨",
    description: "Soft blues, ink washes",
    descriptionZh: "柔和水彩晕染，青蓝薰衣草",
    palette: ["#7ba3d0", "#c5b5e8", "#050812", "#3a5a8a"],
    theme: {
      bgPrimary: "#050812",
      bgGradientVia: "#080d1a",
      bgGradientTo: "#050a14",
      surface: "rgba(30,58,138,0.18)",
      surfaceHover: "rgba(30,58,138,0.3)",
      border: "rgba(96,130,200,0.3)",
      borderHover: "rgba(147,180,230,0.5)",
      accentPrimary: "#7ba3d0",
      accentSecondary: "#c5b5e8",
      accentGlow: "rgba(123,163,208,0.35)",
      textPrimary: "#e8eef8",
      textMuted: "#9eb8d8",
      scrollbarThumb: "#3a5a8a",
      scrollbarThumbHover: "#5a7aaa",
      starColor: "rgba(150,190,230,",
      starColorAlt: "rgba(200,185,240,",
      canvasEffect: "mist",
    },
  },
  {
    id: "dark_fantasy",
    name: "Dark Fantasy",
    nameZh: "暗黑奇幻",
    emoji: "🩸",
    description: "Gothic crimson & void",
    descriptionZh: "哥特深红，暗黑符文美学",
    palette: ["#cc3333", "#ff8080", "#0d0002", "#4a0a0a"],
    theme: {
      bgPrimary: "#0d0002",
      bgGradientVia: "#140005",
      bgGradientTo: "#0a0003",
      surface: "rgba(80,8,8,0.22)",
      surfaceHover: "rgba(100,12,12,0.38)",
      border: "rgba(150,40,40,0.3)",
      borderHover: "rgba(200,80,80,0.5)",
      accentPrimary: "#cc3333",
      accentSecondary: "#ff8080",
      accentGlow: "rgba(200,50,50,0.4)",
      textPrimary: "#f0e0e0",
      textMuted: "#c8a0a0",
      scrollbarThumb: "#4a0a0a",
      scrollbarThumbHover: "#7a1a1a",
      starColor: "rgba(220,80,80,",
      starColorAlt: "rgba(255,140,100,",
      canvasEffect: "sparkle",
    },
  },
  {
    id: "minimalist",
    name: "Minimalist",
    nameZh: "极简主义",
    emoji: "◼",
    description: "Clean monochrome, pure form",
    descriptionZh: "极简黑白，纯粹几何线条",
    palette: ["#888888", "#cccccc", "#080808", "#222222"],
    theme: {
      bgPrimary: "#080808",
      bgGradientVia: "#0d0d0d",
      bgGradientTo: "#080808",
      surface: "rgba(40,40,40,0.3)",
      surfaceHover: "rgba(55,55,55,0.4)",
      border: "rgba(100,100,100,0.25)",
      borderHover: "rgba(160,160,160,0.45)",
      accentPrimary: "#888888",
      accentSecondary: "#cccccc",
      accentGlow: "rgba(150,150,150,0.25)",
      textPrimary: "#e8e8e8",
      textMuted: "#888888",
      scrollbarThumb: "#333333",
      scrollbarThumbHover: "#555555",
      starColor: "rgba(180,180,180,",
      starColorAlt: "rgba(220,220,220,",
      canvasEffect: "particles",
    },
  },
  {
    id: "japanese",
    name: "Japanese",
    nameZh: "日式浮世绘",
    emoji: "🌸",
    description: "Indigo, sakura & moon",
    descriptionZh: "靛蓝樱花，浮世绘意境",
    palette: ["#4a6fa5", "#e8a0b4", "#02030e", "#1a2550"],
    theme: {
      bgPrimary: "#02030e",
      bgGradientVia: "#04061a",
      bgGradientTo: "#02030c",
      surface: "rgba(20,35,100,0.2)",
      surfaceHover: "rgba(30,50,130,0.32)",
      border: "rgba(74,111,165,0.3)",
      borderHover: "rgba(180,160,220,0.5)",
      accentPrimary: "#4a6fa5",
      accentSecondary: "#e8a0b4",
      accentGlow: "rgba(74,111,165,0.35)",
      textPrimary: "#eae8f0",
      textMuted: "#a0a8cc",
      scrollbarThumb: "#1a2550",
      scrollbarThumbHover: "#2a3a70",
      starColor: "rgba(180,160,220,",
      starColorAlt: "rgba(240,170,190,",
      canvasEffect: "sakura",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    nameZh: "赛博朋克",
    emoji: "⚡",
    description: "Neon cyan, magenta pulse",
    descriptionZh: "霓虹赛博，电子神谕未来感",
    palette: ["#00d4e8", "#ff00aa", "#000308", "#001a20"],
    theme: {
      bgPrimary: "#000308",
      bgGradientVia: "#000512",
      bgGradientTo: "#000206",
      surface: "rgba(0,80,100,0.18)",
      surfaceHover: "rgba(0,100,120,0.3)",
      border: "rgba(0,180,200,0.3)",
      borderHover: "rgba(0,220,240,0.55)",
      accentPrimary: "#00d4e8",
      accentSecondary: "#ff00aa",
      accentGlow: "rgba(0,212,232,0.4)",
      textPrimary: "#d0f8ff",
      textMuted: "#60a8b8",
      scrollbarThumb: "#001a20",
      scrollbarThumbHover: "#002a35",
      starColor: "rgba(0,200,230,",
      starColorAlt: "rgba(255,50,180,",
      canvasEffect: "glitch",
    },
  },
  {
    id: "oil_painting",
    name: "Oil Painting",
    nameZh: "油画写实",
    emoji: "🖼️",
    description: "Renaissance warmth, amber glow",
    descriptionZh: "文艺复兴油画质感，琥珀暖光",
    palette: ["#c17b2a", "#8b3a0f", "#0d0804", "#2a1a08"],
    theme: {
      bgPrimary: "#0d0804",
      bgGradientVia: "#140c06",
      bgGradientTo: "#0d0a06",
      surface: "rgba(60,30,8,0.24)",
      surfaceHover: "rgba(80,40,10,0.38)",
      border: "rgba(140,90,30,0.3)",
      borderHover: "rgba(193,123,42,0.5)",
      accentPrimary: "#c17b2a",
      accentSecondary: "#e8b86a",
      accentGlow: "rgba(193,123,42,0.35)",
      textPrimary: "#f0e8d8",
      textMuted: "#b8a080",
      scrollbarThumb: "#2a1a08",
      scrollbarThumbHover: "#4a2a10",
      starColor: "rgba(210,150,70,",
      starColorAlt: "rgba(240,190,100,",
      canvasEffect: "particles",
    },
  },
];

export const DEFAULT_STYLE: StyleId = "classical";

export function getCardStyle(id: StyleId): CardStyle {
  return CARD_STYLES.find((s) => s.id === id) ?? CARD_STYLES[0];
}
