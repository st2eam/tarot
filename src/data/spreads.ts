import { SpreadDefinition } from "@/types";

export const spreads: SpreadDefinition[] = [
  {
    id: "single",
    name: "Single Card",
    nameZh: "单张牌",
    description: "最简单的牌阵，适合每天抽取一张牌来获取当日的指引和灵感",
    cardCount: 1,
    positions: [
      {
        id: "center",
        name: "今日指引",
        description: "今日的核心讯息和能量",
        x: 50,
        y: 50,
      },
    ],
  },
  {
    id: "three-card",
    name: "Three Card Spread",
    nameZh: "三张牌阵",
    description: "经典的三张牌阵，揭示过去、现在和未来之间的关联",
    cardCount: 3,
    positions: [
      {
        id: "past",
        name: "过去",
        description: "影响当前状况的过去因素",
        x: 15,
        y: 50,
      },
      {
        id: "present",
        name: "现在",
        description: "当前状况的核心能量",
        x: 50,
        y: 50,
      },
      {
        id: "future",
        name: "未来",
        description: "按照当前趋势发展的可能结果",
        x: 85,
        y: 50,
      },
    ],
  },
  {
    id: "celtic-cross",
    name: "Celtic Cross",
    nameZh: "凯尔特十字",
    description: "最经典的塔罗牌阵，提供从各个角度对问题深入全面的解析",
    cardCount: 10,
    positions: [
      {
        id: "present",
        name: "现状",
        description: "当前的核心状况",
        x: 50,
        y: 45,
      },
      {
        id: "challenge",
        name: "挑战",
        description: "横跨在现状之上的阻碍或助力",
        x: 50,
        y: 45,
      },
      {
        id: "foundation",
        name: "根源",
        description: "问题的基础和过去的影响",
        x: 50,
        y: 75,
      },
      {
        id: "past",
        name: "过去",
        description: "正在离开你生活的能量",
        x: 15,
        y: 20,
      },
      {
        id: "crown",
        name: "目标",
        description: "可能达到的最佳结果",
        x: 50,
        y: 15,
      },
      {
        id: "future",
        name: "未来",
        description: "即将进入你生活的能量",
        x: 85,
        y: 20,
      },
      {
        id: "self",
        name: "自我",
        description: "你在这个问题中的内在角色",
        x: 85,
        y: 55,
      },
      {
        id: "environment",
        name: "环境",
        description: "外部环境和他人对你的影响",
        x: 85,
        y: 75,
      },
      {
        id: "hopes",
        name: "希望与恐惧",
        description: "你的期待和担忧",
        x: 15,
        y: 55,
      },
      {
        id: "outcome",
        name: "结果",
        description: "所有能量汇聚后的最终指向",
        x: 15,
        y: 75,
      },
    ],
  },
  {
    id: "horseshoe",
    name: "Horseshoe Spread",
    nameZh: "马蹄牌阵",
    description: "马蹄形排列，适合分析具体问题的走向和潜在影响",
    cardCount: 7,
    positions: [
      {
        id: "past",
        name: "过去",
        description: "影响当前状况的过去因素",
        x: 20,
        y: 25,
      },
      {
        id: "present",
        name: "现在",
        description: "当前状况的状态",
        x: 50,
        y: 45,
      },
      {
        id: "hidden",
        name: "隐藏影响",
        description: "你尚未察觉的因素",
        x: 20,
        y: 65,
      },
      {
        id: "obstacle",
        name: "障碍",
        description: "你需要克服的困难",
        x: 35,
        y: 85,
      },
      {
        id: "environment",
        name: "环境",
        description: "周围人和环境的态度",
        x: 65,
        y: 85,
      },
      {
        id: "advice",
        name: "建议",
        description: "应对当前局面的最佳行动",
        x: 80,
        y: 65,
      },
      {
        id: "outcome",
        name: "结果",
        description: "按照当前趋势的可能结果",
        x: 80,
        y: 25,
      },
    ],
  },
  {
    id: "relationship",
    name: "Relationship Spread",
    nameZh: "关系牌阵",
    description: "专为关系设计的牌阵，分析双方的想法、感受和互动模式",
    cardCount: 5,
    positions: [
      {
        id: "you",
        name: "你",
        description: "你在关系中的位置和状态",
        x: 25,
        y: 40,
      },
      {
        id: "partner",
        name: "对方",
        description: "对方在关系中的位置和状态",
        x: 75,
        y: 40,
      },
      {
        id: "connection",
        name: "连接",
        description: "你们之间的连接和互动模式",
        x: 50,
        y: 50,
      },
      {
        id: "strength",
        name: "优势",
        description: "关系中的优势和积极因素",
        x: 25,
        y: 75,
      },
      {
        id: "challenge",
        name: "挑战",
        description: "关系中的挑战和需要解决的问题",
        x: 75,
        y: 75,
      },
    ],
  },
];

export const visibleSpreadIds = ["single", "three-card"] as const;

export const visibleSpreads = spreads.filter((s) =>
  (visibleSpreadIds as readonly string[]).includes(s.id)
);

export function getSpreadById(id: string): SpreadDefinition | undefined {
  return spreads.find((s) => s.id === id);
}

export const spreadIds = [...visibleSpreadIds];
