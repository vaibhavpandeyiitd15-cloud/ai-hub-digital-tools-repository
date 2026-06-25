import {
  CHAT_SYSTEM_PROMPT,
  createChatCompletion,
  getAzureOpenAIConfigError,
  isAzureOpenAIConfigured,
  streamChatCompletion,
} from "@/lib/azure-openai";
import {
  buildContextBlock,
  buildFallbackAnswer,
  chunksToCitations,
  retrieveRelevantChunks,
  type ToolCitation,
} from "@/lib/rag";
import { chatRequestSchema } from "@/lib/validations/chat";

function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

async function pipeAzureStream(
  azureStream: ReadableStream<Uint8Array>,
  citations: ToolCitation[],
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
) {
  const reader = azureStream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  controller.enqueue(encoder.encode(sseEvent("citations", citations)));

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const content = json.choices?.[0]?.delta?.content;
        if (content) {
          controller.enqueue(encoder.encode(sseEvent("token", { content })));
        }
      } catch {
        // ignore malformed chunks
      }
    }
  }

  controller.enqueue(encoder.encode(sseEvent("done", {})));
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = chatRequestSchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { message, history } = parsed.data;
    const chunks = await retrieveRelevantChunks(message, 3);
    const citations = chunksToCitations(chunks);
    const context = buildContextBlock(chunks);

    if (!isAzureOpenAIConfigured()) {
      const configError = getAzureOpenAIConfigError();
      const answer = buildFallbackAnswer(message, chunks);
      return Response.json({
        answer,
        citations,
        mode: "fallback",
        notice: configError,
      });
    }

    const messages = [
      {
        role: "system" as const,
        content: `${CHAT_SYSTEM_PROMPT}\n\nTool context:\n${context || "No tools available."}`,
      },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const accept = request.headers.get("accept") ?? "";
    const wantsStream = accept.includes("text/event-stream");

    if (wantsStream) {
      const azureStream = await streamChatCompletion(messages);
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            await pipeAzureStream(azureStream, citations, controller, encoder);
            controller.close();
          } catch (error) {
            console.error("Chat stream error:", error);
            controller.enqueue(
              encoder.encode(
                sseEvent("error", {
                  message: "Failed to generate response. Please try again.",
                }),
              ),
            );
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    const answer = await createChatCompletion(messages);
    return Response.json({ answer, citations, mode: "azure" });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Failed to process chat request" }, { status: 500 });
  }
}
