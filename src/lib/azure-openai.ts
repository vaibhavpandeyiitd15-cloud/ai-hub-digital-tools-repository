// Backward-compatible shim — use @/lib/llm for new code
export {
  CHAT_SYSTEM_PROMPT,
  createChatCompletion,
  createEmbedding,
  getAzureOpenAIConfigError,
  isAzureOpenAIConfigured,
  streamChatCompletion,
  type ChatMessage,
} from "@/lib/llm";
