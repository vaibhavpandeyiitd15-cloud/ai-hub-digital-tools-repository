const API_VERSION = process.env.AZURE_OPENAI_API_VERSION ?? "2024-08-01-preview";

function getEndpoint(): string | undefined {
  const raw = process.env.AZURE_OPENAI_ENDPOINT?.trim();
  return raw?.replace(/\/$/, "");
}

export function isAzureOpenAIConfigured(): boolean {
  return Boolean(
    getEndpoint() &&
      process.env.AZURE_OPENAI_API_KEY?.trim() &&
      process.env.AZURE_OPENAI_DEPLOYMENT?.trim() &&
      process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT?.trim(),
  );
}

export function getAzureOpenAIConfigError(): string | null {
  if (!getEndpoint()) return "AZURE_OPENAI_ENDPOINT is not set";
  if (!process.env.AZURE_OPENAI_API_KEY?.trim()) return "AZURE_OPENAI_API_KEY is not set";
  if (!process.env.AZURE_OPENAI_DEPLOYMENT?.trim()) {
    return "AZURE_OPENAI_DEPLOYMENT is not set";
  }
  if (!process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT?.trim()) {
    return "AZURE_OPENAI_EMBEDDING_DEPLOYMENT is not set";
  }
  return null;
}

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

function azureHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "api-key": process.env.AZURE_OPENAI_API_KEY!.trim(),
  };
}

export async function createEmbedding(text: string): Promise<number[]> {
  const endpoint = getEndpoint();
  const deployment = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT!.trim();
  const url = `${endpoint}/openai/deployments/${deployment}/embeddings?api-version=${API_VERSION}`;

  const response = await fetch(url, {
    method: "POST",
    headers: azureHeaders(),
    body: JSON.stringify({ input: text }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Azure embedding failed (${response.status}): ${body}`);
  }

  const json = (await response.json()) as {
    data: Array<{ embedding: number[] }>;
  };
  return json.data[0]?.embedding ?? [];
}

export async function streamChatCompletion(
  messages: ChatMessage[],
): Promise<ReadableStream<Uint8Array>> {
  const endpoint = getEndpoint();
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT!.trim();
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${API_VERSION}`;

  const response = await fetch(url, {
    method: "POST",
    headers: azureHeaders(),
    body: JSON.stringify({
      messages,
      temperature: 0.2,
      max_tokens: 800,
      stream: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Azure chat failed (${response.status}): ${body}`);
  }

  if (!response.body) {
    throw new Error("Azure chat returned empty body");
  }

  return response.body;
}

export async function createChatCompletion(messages: ChatMessage[]): Promise<string> {
  const endpoint = getEndpoint();
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT!.trim();
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${API_VERSION}`;

  const response = await fetch(url, {
    method: "POST",
    headers: azureHeaders(),
    body: JSON.stringify({
      messages,
      temperature: 0.2,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Azure chat failed (${response.status}): ${body}`);
  }

  const json = (await response.json()) as {
    choices: Array<{ message?: { content?: string } }>;
  };
  return json.choices[0]?.message?.content?.trim() ?? "";
}

export const CHAT_SYSTEM_PROMPT = `You are the AI Hub assistant for Unilever Head Office.
Answer ONLY using the provided tool context about AI Hub digital tools.
Always cite relevant tool names and include their catalog path as /tools/{slug}.
If the question is not about AI Hub tools, politely decline and suggest browsing the catalog.
If you don't know, say so and suggest contacting the tool POC from the context.
Keep answers concise, helpful, and professional.`;
