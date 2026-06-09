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
  glassBackground: string;
  glassBorder: string;
  glowSoft: string;
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
      bgPrimary: "#06020f",
      bgGradientVia: "#0d0628",
      bgGradientTo: "#080318",
      surface: "rgba(88,28,135,0.18)",
      surfaceHover: "rgba(88,28,135,0.32)",
      border: "rgba(109,40,217,0.3)",
      borderHover: "rgba(167,139,250,0.5)",
      accentPrimary: "#8b5cf6",
      accentSecondary: "#c4a0ff",
      accentGlow: "rgba(139,92,246,0.35)",
      textPrimary: "#f5f0fa",
      textMuted: "#c4bdd0",
      scrollbarThumb: "#4a2a7a",
      scrollbarThumbHover: "#6b4aaa",
      glassBackground: "rgba(20,10,50,0.35)",
      glassBorder: "rgba(167,139,250,0.18)",
      glowSoft: "0 0 40px rgba(139,92,246,0.18)",
      starColor: "rgba(200,160,255,",
      starColorAlt: "rgba(230,205,255,",
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
    palette: ["#6dbd80", "#d4a040", "#020a06", "#2d5a40"],
    theme: {
      bgPrimary: "#020a06",
      bgGradientVia: "#061508",
      bgGradientTo: "#020806",
      surface: "rgba(22,78,48,0.2)",
      surfaceHover: "rgba(22,78,48,0.36)",
      border: "rgba(90,154,110,0.35)",
      borderHover: "rgba(150,200,155,0.55)",
      accentPrimary: "#6dbd80",
      accentSecondary: "#d4a040",
      accentGlow: "rgba(109,189,128,0.4)",
      textPrimary: "#f0f7f2",
      textMuted: "#c0d4c5",
      scrollbarThumb: "#3a6a50",
      scrollbarThumbHover: "#5a8a70",
      glassBackground: "rgba(10,30,20,0.35)",
      glassBorder: "rgba(109,189,128,0.18)",
      glowSoft: "0 0 40px rgba(109,189,128,0.18)",
      starColor: "rgba(160,220,180,",
      starColorAlt: "rgba(220,180,100,",
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
    palette: ["#8fb8e0", "#d0c8f0", "#050812", "#3a5a8a"],
    theme: {
      bgPrimary: "#050812",
      bgGradientVia: "#080d1a",
      bgGradientTo: "#050a14",
      surface: "rgba(30,58,138,0.18)",
      surfaceHover: "rgba(30,58,138,0.3)",
      border: "rgba(110,150,215,0.35)",
      borderHover: "rgba(160,195,240,0.55)",
      accentPrimary: "#8fb8e0",
      accentSecondary: "#d0c8f0",
      accentGlow: "rgba(143,184,224,0.4)",
      textPrimary: "#f0f4fc",
      textMuted: "#c0cde8",
      scrollbarThumb: "#4a6a9a",
      scrollbarThumbHover: "#6a8aba",
      glassBackground: "rgba(10,20,50,0.35)",
      glassBorder: "rgba(143,184,224,0.18)",
      glowSoft: "0 0 40px rgba(143,184,224,0.18)",
      starColor: "rgba(170,205,240,",
      starColorAlt: "rgba(210,200,245,",
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
    palette: ["#ee4444", "#ff9090", "#0d0002", "#4a0a0a"],
    theme: {
      bgPrimary: "#0d0002",
      bgGradientVia: "#140005",
      bgGradientTo: "#0a0003",
      surface: "rgba(80,8,8,0.22)",
      surfaceHover: "rgba(100,12,12,0.38)",
      border: "rgba(170,50,50,0.35)",
      borderHover: "rgba(220,90,90,0.55)",
      accentPrimary: "#ee4444",
      accentSecondary: "#ff9090",
      accentGlow: "rgba(238,68,68,0.45)",
      textPrimary: "#f5e8e8",
      textMuted: "#d4b8b8",
      scrollbarThumb: "#5a1515",
      scrollbarThumbHover: "#8a2525",
      glassBackground: "rgba(30,5,5,0.4)",
      glassBorder: "rgba(238,68,68,0.18)",
      glowSoft: "0 0 40px rgba(238,68,68,0.2)",
      starColor: "rgba(240,100,80,",
      starColorAlt: "rgba(255,160,120,",
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
    palette: ["#aaaaaa", "#dddddd", "#080808", "#333333"],
    theme: {
      bgPrimary: "#080808",
      bgGradientVia: "#0d0d0d",
      bgGradientTo: "#080808",
      surface: "rgba(40,40,40,0.3)",
      surfaceHover: "rgba(55,55,55,0.4)",
      border: "rgba(120,120,120,0.3)",
      borderHover: "rgba(180,180,180,0.5)",
      accentPrimary: "#aaaaaa",
      accentSecondary: "#dddddd",
      accentGlow: "rgba(170,170,170,0.3)",
      textPrimary: "#f0f0f0",
      textMuted: "#aaaaaa",
      scrollbarThumb: "#444444",
      scrollbarThumbHover: "#666666",
      glassBackground: "rgba(20,20,20,0.4)",
      glassBorder: "rgba(170,170,170,0.15)",
      glowSoft: "0 0 40px rgba(170,170,170,0.12)",
      starColor: "rgba(200,200,200,",
      starColorAlt: "rgba(235,235,235,",
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
    palette: ["#5c8ac0", "#f0b0c0", "#02030e", "#1a2550"],
    theme: {
      bgPrimary: "#02030e",
      bgGradientVia: "#04061a",
      bgGradientTo: "#02030c",
      surface: "rgba(20,35,100,0.2)",
      surfaceHover: "rgba(30,50,130,0.32)",
      border: "rgba(92,138,192,0.35)",
      borderHover: "rgba(190,175,230,0.55)",
      accentPrimary: "#5c8ac0",
      accentSecondary: "#f0b0c0",
      accentGlow: "rgba(92,138,192,0.4)",
      textPrimary: "#f2f0f8",
      textMuted: "#c0c8e4",
      scrollbarThumb: "#2a3570",
      scrollbarThumbHover: "#3a4a90",
      glassBackground: "rgba(10,12,40,0.35)",
      glassBorder: "rgba(92,138,192,0.18)",
      glowSoft: "0 0 40px rgba(92,138,192,0.18)",
      starColor: "rgba(190,175,230,",
      starColorAlt: "rgba(248,185,200,",
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
      border: "rgba(0,200,220,0.35)",
      borderHover: "rgba(50,235,250,0.55)",
      accentPrimary: "#00d4e8",
      accentSecondary: "#ff20b8",
      accentGlow: "rgba(0,212,232,0.45)",
      textPrimary: "#e0faff",
      textMuted: "#88c8d4",
      scrollbarThumb: "#002a35",
      scrollbarThumbHover: "#003d4d",
      glassBackground: "rgba(0,15,20,0.4)",
      glassBorder: "rgba(0,212,232,0.18)",
      glowSoft: "0 0 40px rgba(0,212,232,0.2)",
      starColor: "rgba(30,220,245,",
      starColorAlt: "rgba(255,60,190,",
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
    palette: ["#d4943a", "#e8b86a", "#0d0804", "#2a1a08"],
    theme: {
      bgPrimary: "#0d0804",
      bgGradientVia: "#140c06",
      bgGradientTo: "#0d0a06",
      surface: "rgba(60,30,8,0.24)",
      surfaceHover: "rgba(80,40,10,0.38)",
      border: "rgba(160,100,40,0.35)",
      borderHover: "rgba(210,140,55,0.55)",
      accentPrimary: "#d4943a",
      accentSecondary: "#f0c87a",
      accentGlow: "rgba(212,148,58,0.4)",
      textPrimary: "#f5efe0",
      textMuted: "#ccbc98",
      scrollbarThumb: "#3a2510",
      scrollbarThumbHover: "#5a3a1a",
      glassBackground: "rgba(25,15,5,0.4)",
      glassBorder: "rgba(212,148,58,0.18)",
      glowSoft: "0 0 40px rgba(212,148,58,0.18)",
      starColor: "rgba(225,165,80,",
      starColorAlt: "rgba(250,205,115,",
      canvasEffect: "particles",
    },
  },
];

export const DEFAULT_STYLE: StyleId = "classical";

export function getCardStyle(id: StyleId): CardStyle {
  return CARD_STYLES.find((s) => s.id === id) ?? CARD_STYLES[0];
}
