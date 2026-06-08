const SYSTEM_PROMPT =
  "你是一位亲切幽默的塔罗老师，擅长用通俗易懂的大白话解读塔罗牌。你的风格像一个靠谱的老朋友：说实话、有温度、接地气，不说玄学废话，不卖弄神秘感。使用中文回答。";

export async function streamInterpretation(
  prompt: string,
  provider: string,
  apiKey: string,
  model: string | undefined,
  onChunk: (text: string) => void
): Promise<void> {
  if (provider === "anthropic") {
    await streamAnthropic(prompt, apiKey, model, onChunk);
  } else {
    const baseUrl =
      provider === "deepseek"
        ? "https://api.deepseek.com/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
    const defaultModel =
      provider === "deepseek" ? "deepseek-v4-pro" : "gpt-4o-mini";
    await streamOpenAICompat(baseUrl, prompt, apiKey, model || defaultModel, onChunk);
  }
}

async function streamOpenAICompat(
  baseUrl: string,
  prompt: string,
  apiKey: string,
  model: string,
  onChunk: (text: string) => void
): Promise<void> {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      stream: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API 错误 ${res.status}: ${err}`);
  }

  await readSSEStream(res.body!, (line) => {
    if (!line.startsWith("data: ")) return;
    const data = line.slice(6);
    if (data === "[DONE]") return;
    try {
      const parsed = JSON.parse(data);
      const content = parsed.choices?.[0]?.delta?.content;
      if (content) onChunk(content);
    } catch {
      // skip malformed JSON
    }
  });
}

async function streamAnthropic(
  prompt: string,
  apiKey: string,
  model: string | undefined,
  onChunk: (text: string) => void
): Promise<void> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      // Required for direct browser access
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: model || "claude-sonnet-4-6",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API 错误 ${res.status}: ${err}`);
  }

  await readSSEStream(res.body!, (line) => {
    if (!line.startsWith("data: ")) return;
    try {
      const parsed = JSON.parse(line.slice(6));
      if (parsed.type === "content_block_delta") {
        const text = parsed.delta?.text;
        if (text) onChunk(text);
      }
    } catch {
      // skip malformed JSON
    }
  });
}

async function readSSEStream(
  body: ReadableStream<Uint8Array>,
  onLine: (line: string) => void
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) onLine(trimmed);
      }
    }
    if (buffer.trim()) onLine(buffer.trim());
  } finally {
    reader.releaseLock();
  }
}
