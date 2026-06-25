"use client";

import { Calendar, MessageCircle } from "lucide-react";
import { useBooking, type BookingTool } from "@/components/booking/BookingProvider";
import { useChat } from "@/components/chat/ChatProvider";

export function ToolDetailActions({
  tool,
}: {
  tool: BookingTool & { toolUrl: string; hasToolUrl: boolean; name: string };
}) {
  const { openBooking } = useBooking();
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
      <button
        type="button"
        onClick={() => openBooking(tool)}
        className="btn-outline inline-flex items-center justify-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        Book Training
      </button>
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
