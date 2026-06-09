import {
  getProviderConfig,
  DEFAULT_SYSTEM_PROMPT,
} from "@/lib/llm-providers";

export async function streamInterpretation(
  prompt: string,
  provider: string,
  apiKey: string,
  model: string | undefined,
  onChunk: (text: string) => void,
  systemPrompt?: string,
  signal?: AbortSignal
): Promise<void> {
  const cfg = getProviderConfig(provider);
  const sysPrompt = systemPrompt ?? DEFAULT_SYSTEM_PROMPT;

  if (provider === "anthropic") {
    await streamAnthropic(prompt, apiKey, model ?? cfg.defaultModel, onChunk, sysPrompt, signal);
  } else {
    await streamOpenAICompat(
      cfg.baseUrl!,
      prompt,
      apiKey,
      model ?? cfg.defaultModel,
      onChunk,
      sysPrompt,
      signal
    );
  }
}

async function streamOpenAICompat(
  baseUrl: string,
  prompt: string,
  apiKey: string,
  model: string,
  onChunk: (text: string) => void,
  systemPrompt: string,
  signal?: AbortSignal
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
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      stream: true,
    }),
    signal,
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
  model: string,
  onChunk: (text: string) => void,
  systemPrompt: string,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
    signal,
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

export async function readSSEStream(
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
