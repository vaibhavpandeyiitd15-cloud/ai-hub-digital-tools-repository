import { PACKAGING_LAB_NAME } from "@/lib/content/desire-lab";

export const CHAT_SYSTEM_PROMPT = `You are the Desire Lab assistant for Unilever teams in Mumbai and Bangalore.
Answer ONLY using the provided context about Desire Lab and ${PACKAGING_LAB_NAME} tools.

Current structure (use these names and paths only):
- ${PACKAGING_LAB_NAME} hub: /labs/pack-lab
- Phase 1 Explore → stages Insight (/labs/pack-lab/insight) and Screening (/labs/pack-lab/screening)
- Phase 2 Validate → stages Prototyping (/labs/pack-lab/prototyping) and Simulation (/labs/pack-lab/simulation)
- Phase 3 Execute → stages Data capture (/labs/pack-lab/data-capture) and Specifications (/labs/pack-lab/specifications, Active Workspace)
- Create a new workflow: /labs/pack-lab/workflow
- Formulation Lab: /labs/formulation-lab (coming soon)

Tools live at /labs/pack-lab/{stage}/{tool-slug} (e.g. /labs/pack-lab/insight/convotrack).
Never cite legacy /tools/... paths, AI Hub catalog names, Consumer Lab, or Science Lab.
For packaging specifications, direct users to Active Workspace via /labs/pack-lab/specifications.
For training, tell users to use "Look for training slots" in the header.
If you don't know, say so and suggest contacting the tool POC from the context.
Keep answers concise, helpful, and professional.`;

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LlmProvider = "azure" | "groq" | "fallback";

const AZURE_API_VERSION = process.env.AZURE_OPENAI_API_VERSION ?? "2024-08-01-preview";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";
const DEFAULT_GROQ_EMBEDDING_MODEL =
  process.env.GROQ_EMBEDDING_MODEL?.trim() || "nomic-embed-text-v1_5";

function azureEndpoint(): string | undefined {
  const raw = process.env.AZURE_OPENAI_ENDPOINT?.trim();
  return raw?.replace(/\/$/, "");
}

export function isAzureConfigured(): boolean {
  return Boolean(
    azureEndpoint() &&
      process.env.AZURE_OPENAI_API_KEY?.trim() &&
      process.env.AZURE_OPENAI_DEPLOYMENT?.trim(),
  );
}

export function isAzureEmbeddingConfigured(): boolean {
  return Boolean(isAzureConfigured() && process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT?.trim());
}

export function isGroqConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY?.trim());
}

export function resolveLlmProvider(): LlmProvider {
  const explicit = process.env.LLM_PROVIDER?.trim().toLowerCase();

  if (explicit === "fallback") return "fallback";
  if (explicit === "azure" && isAzureConfigured()) return "azure";
  if (explicit === "groq" && isGroqConfigured()) return "groq";

  if (!explicit || explicit === "auto") {
    if (isAzureConfigured()) return "azure";
    if (isGroqConfigured()) return "groq";
    return "fallback";
  }

  if (explicit === "azure" || explicit === "groq") {
    return "fallback";
  }

  return "fallback";
}

export function isLlmChatConfigured(): boolean {
  const provider = resolveLlmProvider();
  return provider === "azure" || provider === "groq";
}

export function isEmbeddingConfigured(): boolean {
  if (isAzureEmbeddingConfigured()) return true;
  if (isGroqConfigured() && process.env.GROQ_EMBEDDING_MODEL !== "off") return true;
  return false;
}

export function getLlmConfigNotice(): string | null {
  const provider = resolveLlmProvider();
  if (provider === "azure") return null;
  if (provider === "groq") {
    return "Prototype mode: Groq LLM (swap to Azure OpenAI via LLM_PROVIDER=azure when Unilever access is ready)";
  }
  const explicit = process.env.LLM_PROVIDER?.trim().toLowerCase();
  if (explicit === "azure" && !isAzureConfigured()) {
    return "LLM_PROVIDER=azure but Azure OpenAI env vars are incomplete";
  }
  if (explicit === "groq" && !isGroqConfigured()) {
    return "LLM_PROVIDER=groq but GROQ_API_KEY is not set";
  }
  return "No LLM provider configured — using catalog search fallback";
}

async function createAzureEmbedding(text: string): Promise<number[]> {
  const endpoint = azureEndpoint();
  const deployment = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT!.trim();
  const url = `${endpoint}/openai/deployments/${deployment}/embeddings?api-version=${AZURE_API_VERSION}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.AZURE_OPENAI_API_KEY!.trim(),
    },
    body: JSON.stringify({ input: text }),
  });

  if (!response.ok) {
    throw new Error(`Azure embedding failed (${response.status}): ${await response.text()}`);
  }

  const json = (await response.json()) as { data: Array<{ embedding: number[] }> };
  return json.data[0]?.embedding ?? [];
}

async function createGroqEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${GROQ_BASE_URL}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY!.trim()}`,
    },
    body: JSON.stringify({
      model: DEFAULT_GROQ_EMBEDDING_MODEL,
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq embedding failed (${response.status}): ${await response.text()}`);
  }

  const json = (await response.json()) as { data: Array<{ embedding: number[] }> };
  return json.data[0]?.embedding ?? [];
}

export async function createEmbedding(text: string): Promise<number[]> {
  if (isAzureEmbeddingConfigured()) {
    return createAzureEmbedding(text);
  }
  if (isGroqConfigured() && process.env.GROQ_EMBEDDING_MODEL !== "off") {
    try {
      return await createGroqEmbedding(text);
    } catch (error) {
      console.warn("Groq embedding failed, skipping vector search:", error);
      return [];
    }
  }
  return [];
}

type OpenAIChatRequest = {
  url: string;
  headers: HeadersInit;
  model: string;
  useDeploymentPath: boolean;
};

function getChatRequestConfig(provider: LlmProvider): OpenAIChatRequest {
  if (provider === "azure") {
    const endpoint = azureEndpoint()!;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT!.trim();
    return {
      url: `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${AZURE_API_VERSION}`,
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.AZURE_OPENAI_API_KEY!.trim(),
      },
      model: deployment,
      useDeploymentPath: true,
    };
  }

  return {
    url: `${GROQ_BASE_URL}/chat/completions`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY!.trim()}`,
    },
    model: DEFAULT_GROQ_MODEL,
    useDeploymentPath: false,
  };
}

export async function streamChatCompletion(
  messages: ChatMessage[],
): Promise<ReadableStream<Uint8Array>> {
  const provider = resolveLlmProvider();
  if (provider === "fallback") {
    throw new Error("No LLM provider configured for streaming");
  }

  const config = getChatRequestConfig(provider);
  const body: Record<string, unknown> = {
    messages,
    temperature: 0.2,
    max_tokens: 800,
    stream: true,
  };
  if (!config.useDeploymentPath) {
    body.model = config.model;
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`${provider} chat failed (${response.status}): ${await response.text()}`);
  }
  if (!response.body) {
    throw new Error(`${provider} chat returned empty body`);
  }
  return response.body;
}

export async function createChatCompletion(messages: ChatMessage[]): Promise<string> {
  const provider = resolveLlmProvider();
  if (provider === "fallback") {
    throw new Error("No LLM provider configured");
  }

  const config = getChatRequestConfig(provider);
  const body: Record<string, unknown> = {
    messages,
    temperature: 0.2,
    max_tokens: 800,
  };
  if (!config.useDeploymentPath) {
    body.model = config.model;
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`${provider} chat failed (${response.status}): ${await response.text()}`);
  }

  const json = (await response.json()) as {
    choices: Array<{ message?: { content?: string } }>;
  };
  return json.choices[0]?.message?.content?.trim() ?? "";
}

// Backward-compatible re-exports
export const isAzureOpenAIConfigured = isAzureConfigured;

export function getAzureOpenAIConfigError(): string | null {
  if (isAzureConfigured()) return null;
  if (!azureEndpoint()) return "AZURE_OPENAI_ENDPOINT is not set";
  if (!process.env.AZURE_OPENAI_API_KEY?.trim()) return "AZURE_OPENAI_API_KEY is not set";
  if (!process.env.AZURE_OPENAI_DEPLOYMENT?.trim()) return "AZURE_OPENAI_DEPLOYMENT is not set";
  return null;
}
