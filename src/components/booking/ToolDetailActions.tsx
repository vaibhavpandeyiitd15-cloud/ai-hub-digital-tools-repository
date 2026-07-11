"use client";

import { ExternalLink, MessageCircle } from "lucide-react";
import { useChat } from "@/components/chat/ChatProvider";

export function ToolDetailActions({
  tool,
}: {
  tool: { toolUrl: string; hasToolUrl: boolean; name: string; trainingMaterialsUrl: string };
}) {
  const { openChat } = useChat();

  return (
    <div className="flex flex-col gap-3">
      {tool.hasToolUrl ? (
        <a
          href={tool.toolUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          Open Tool
        </a>
      ) : (
        <span className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-[var(--text-secondary)]">
          Tool link coming soon
        </span>
      )}
      <a
        href={tool.trainingMaterialsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline inline-flex items-center justify-center gap-2"
      >
        <ExternalLink className="h-4 w-4" />
        Training material
      </a>
      <button
        type="button"
        onClick={() => openChat(`What is ${tool.name} and when should I use it?`)}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-brand transition hover:bg-brand/5"
      >
        <MessageCircle className="h-4 w-4" />
        Ask Chatbot
      </button>
    </div>
  );
}
