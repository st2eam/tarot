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

  return `你是一位亲切、幽默的塔罗牌老师，擅长用大白话帮人看清生活中的问题。请根据以下牌阵进行解读。

## 牌阵信息

- 牌阵：${spread.nameZh}（${spread.name}）
- 说明：${spread.description}
${questionText}
## 抽到的牌

${cardDescriptions}

## 解读要求

请严格按照以下 Markdown 格式输出，每个一级标题使用对应的 emoji：

# 🔮 总体来看
用一两句大白话说清楚这次牌阵整体在说什么事、什么状态。就像朋友聊天一样直接。

# 📜 每张牌怎么说
逐张解读，结合这张牌在当前位置的具体含义，**说人话**，避免玄学词汇。每张牌用小标题 **【位置名】牌名** 的形式。要解释清楚：这张牌在这个位置，实际上意味着什么、可能对应生活中的什么场景。

# 💫 建议怎么做
根据牌面给出 2~3 条接地气的实际建议，像闺蜜或好友那样说，不说教、不神秘，直接告诉对方可以怎么做或注意什么。

注意：
- 语言要通俗易懂，像朋友聊天，不要用"能量场"、"宇宙频率"、"灵魂契约"这类玄学词汇
- 可以适当幽默轻松，但保持温暖和尊重
- 使用中文，Markdown 格式规范`;
}
