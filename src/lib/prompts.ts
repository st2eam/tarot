import { DrawnCard, SpreadDefinition } from "@/types";

export function buildInterpretationPrompt(
  cards: DrawnCard[],
  spread: SpreadDefinition,
  question?: string
): string {
  const cardDescriptions = cards
    .map((dc) => {
      const orientationText =
        dc.orientation === "upright" ? "正位" : "逆位";
      return `- **${dc.position.name}**：${dc.card.nameZh}（${dc.card.name}）${orientationText}
  ${dc.orientation === "upright" ? dc.card.meaning.upright : dc.card.meaning.reversed}`;
    })
    .join("\n");

  const questionText = question ? `\n> 问题：${question}\n` : "";

  return `你是一位经验丰富的塔罗牌解读师，精通各种牌阵和牌面含义。请根据以下抽到的牌阵进行解读。

## 牌阵信息

- 牌阵：${spread.nameZh}（${spread.name}）
- 说明：${spread.description}
${questionText}
## 抽到的牌

${cardDescriptions}

## 解读要求

请严格按照以下 Markdown 格式输出，每个一级标题使用对应的 emoji：

# 🔮 整体能量概览
用一段话概括整个牌阵所呈现的核心能量和主题。

# 📜 各位置牌面解析
逐张分析每张牌在对应位置的含义（正位或逆位），结合该位置的解读视角。每张牌用小标题 **【位置名】牌名** 的形式。

# 🌟 牌面关联与深层洞见
分析牌与牌之间的关联、冲突或呼应，揭示更深层的模式和讯息。

# 💫 综合指引与建议
结合以上分析，给出温暖、有洞察力的总结和行动建议，像一位真正的塔罗师那样给予指引。

注意：语言温暖有力量，使用中文，Markdown 格式规范。`;
}
