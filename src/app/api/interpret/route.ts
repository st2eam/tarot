import { NextRequest } from "next/server";

export const runtime = "edge";

const SYSTEM_PROMPT =
  "你是一位经验丰富的塔罗牌解读师，拥有深厚的塔罗知识和直觉解读能力。请以温暖、有洞察力且专业的方式回答问题。使用中文回答。";

export async function POST(req: NextRequest) {
  try {
    const { prompt, provider, apiKey, model } = await req.json();

    if (!prompt || !apiKey) {
      return new Response(
        JSON.stringify({ error: "缺少必要参数" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let upstreamRes: Response;

    if (provider === "anthropic") {
      upstreamRes = await callAnthropic(prompt, apiKey, model);
    } else {
      const baseUrl =
        provider === "deepseek"
          ? "https://api.deepseek.com/chat/completions"
          : "https://api.openai.com/v1/chat/completions";
      const defaultModel =
        provider === "deepseek" ? "deepseek-v4-pro" : "gpt-4o-mini";
      upstreamRes = await callOpenAICompat(baseUrl, prompt, apiKey, model || defaultModel);
    }

    if (!upstreamRes.ok) {
      const err = await upstreamRes.text();
      return new Response(
        JSON.stringify({ error: `API 错误 ${upstreamRes.status}: ${err}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!upstreamRes.body) {
      return new Response(
        JSON.stringify({ error: "上游 API 未返回响应体" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const transformedStream = transformSSEStream(upstreamRes.body, provider);

    return new Response(transformedStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Interpret API error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "服务器错误",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function callOpenAICompat(
  baseUrl: string,
  prompt: string,
  apiKey: string,
  model: string
): Promise<Response> {
  return fetch(baseUrl, {
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
}

async function callAnthropic(
  prompt: string,
  apiKey: string,
  model?: string
): Promise<Response> {
  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: model || "claude-sonnet-4-6",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
  });
}

function transformSSEStream(
  upstreamBody: ReadableStream<Uint8Array>,
  provider: string
): ReadableStream<Uint8Array> {
  const reader = upstreamBody.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            if (provider === "anthropic") {
              if (!trimmed.startsWith("data: ")) continue;
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                if (parsed.type === "content_block_delta") {
                  const text = parsed.delta?.text;
                  if (text) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                    );
                  }
                } else if (parsed.type === "message_stop") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                }
              } catch {
                // skip malformed JSON
              }
            } else {
              // OpenAI-compatible format (OpenAI + DeepSeek)
              if (!trimmed.startsWith("data: ")) continue;
              const data = trimmed.slice(6);
              if (data === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`)
                  );
                }
              } catch {
                // skip malformed JSON
              }
            }
          }
        }

        // Process remaining buffer after stream ends
        if (buffer.trim()) {
          const trimmed = buffer.trim();
          if (provider !== "anthropic" && trimmed.startsWith("data: ") && trimmed !== "data: [DONE]") {
            try {
              const parsed = JSON.parse(trimmed.slice(6));
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`)
                );
              }
            } catch {
              // skip
            }
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        console.error("Stream transform error:", err);
        controller.error(err);
      }
    },
  });
}
