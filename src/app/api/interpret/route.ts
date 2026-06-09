import { NextRequest } from "next/server";
import {
  getProviderConfig,
  DEFAULT_SYSTEM_PROMPT,
} from "@/lib/llm-providers";
import { readSSEStream } from "@/lib/llm-stream";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { prompt, provider, apiKey, model } = await req.json();

    if (!prompt || !apiKey) {
      return new Response(
        JSON.stringify({ error: "缺少必要参数" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const cfg = getProviderConfig(provider);

    let upstreamRes: Response;

    if (provider === "anthropic") {
      upstreamRes = await callAnthropic(prompt, apiKey, model ?? cfg.defaultModel);
    } else {
      upstreamRes = await callOpenAICompat(cfg.baseUrl!, prompt, apiKey, model ?? cfg.defaultModel);
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
        { role: "system", content: DEFAULT_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      stream: true,
    }),
  });
}

async function callAnthropic(
  prompt: string,
  apiKey: string,
  model: string
): Promise<Response> {
  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system: DEFAULT_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
  });
}

function transformSSEStream(
  upstreamBody: ReadableStream<Uint8Array>,
  provider: string
): ReadableStream<Uint8Array> {
  const isAnthropic = provider === "anthropic";
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        await readSSEStream(upstreamBody, (trimmed) => {
          if (isAnthropic) {
            if (!trimmed.startsWith("data: ")) return;
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
            if (!trimmed.startsWith("data: ")) return;
            const data = trimmed.slice(6);
            if (data === "[DONE]") {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              return;
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
        });

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        console.error("Stream transform error:", err);
        controller.error(err);
      }
    },
  });
}
