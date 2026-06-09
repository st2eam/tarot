export type LLMProvider = "openai" | "anthropic" | "deepseek";

export interface ProviderConfig {
  id: LLMProvider;
  baseUrl: string | null; // null for Anthropic (custom fetch)
  defaultModel: string;
}

export const PROVIDERS: Record<LLMProvider, ProviderConfig> = {
  openai: {
    id: "openai",
    baseUrl: "https://api.openai.com/v1/chat/completions",
    defaultModel: "gpt-4o-mini",
  },
  anthropic: {
    id: "anthropic",
    baseUrl: null,
    defaultModel: "claude-sonnet-4-6",
  },
  deepseek: {
    id: "deepseek",
    baseUrl: "https://api.deepseek.com/chat/completions",
    defaultModel: "deepseek-v4-pro",
  },
} as const;

export const DEFAULT_SYSTEM_PROMPT =
  "你是一位亲切幽默的塔罗老师，擅长用通俗易懂的大白话解读塔罗牌。你的风格像一个靠谱的老朋友：说实话、有温度、接地气，不说玄学废话，不卖弄神秘感。使用中文回答。";

export function getProviderConfig(provider: string): ProviderConfig {
  const cfg = PROVIDERS[provider as LLMProvider];
  if (!cfg) throw new Error(`Unknown provider: ${provider}`);
  return cfg;
}
