"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, Minus, Send, X } from "lucide-react";
import { useChat } from "@/components/chat/ChatProvider";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Array<{ name: string; path: string }>;
};

type Citation = {
  name: string;
  slug: string;
  path: string;
};

function parseSseEvents(buffer: string): { events: Array<{ event: string; data: string }>; rest: string } {
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";
  const events = parts
    .map((block) => {
      const lines = block.split("\n");
      const eventLine = lines.find((l) => l.startsWith("event:"));
      const dataLine = lines.find((l) => l.startsWith("data:"));
      if (!eventLine || !dataLine) return null;
      return {
        event: eventLine.slice(6).trim(),
        data: dataLine.slice(5).trim(),
      };
    })
    .filter(Boolean) as Array<{ event: string; data: string }>;
  return { events, rest };
}

function AssistantContent({ content }: { content: string }) {
  const parts = content.split(/(\/(?:tools\/[a-z0-9-]+|labs\/pack-lab\/[a-z0-9-]+\/[a-z0-9-]+))/g);
  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed">
      {parts.map((part, i) =>
        part.startsWith("/tools/") || part.startsWith("/labs/pack-lab/") ? (
          <Link key={i} href={part} className="font-medium text-brand hover:underline">
            {part}
          </Link>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  );
}

export function ChatWidget() {
  const { isOpen, toggleChat, closeChat, pendingMessage, clearPendingMessage } =
    useChat();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm the Desire Lab assistant. Ask me about tools in Pack Lab or Formulation Lab — I'll cite the relevant tool pages.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && pendingMessage) {
      setInput(pendingMessage);
      clearPendingMessage();
      inputRef.current?.focus();
    }
  }, [isOpen, pendingMessage, clearPendingMessage]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    setIsLoading(true);
    setInput("");

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);

    const history = messages
      .filter((m) => m.id !== "welcome")
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const contentType = response.headers.get("content-type") ?? "";

      if (contentType.includes("text/event-stream") && response.body) {
        const assistantId = `assistant-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "", citations: [] },
        ]);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let citations: Citation[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const { events, rest } = parseSseEvents(buffer);
          buffer = rest;

          for (const evt of events) {
            if (evt.event === "citations") {
              citations = JSON.parse(evt.data) as Citation[];
            } else if (evt.event === "token") {
              const { content } = JSON.parse(evt.data) as { content: string };
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + content } : m,
                ),
              );
            } else if (evt.event === "error") {
              const { message } = JSON.parse(evt.data) as { message: string };
              setError(message);
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  citations: citations.map((c) => ({ name: c.name, path: c.path })),
                }
              : m,
          ),
        );
      } else {
        const json = (await response.json()) as {
          answer: string;
          citations?: Citation[];
          notice?: string;
        };
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: json.answer,
            citations: json.citations?.map((c) => ({ name: c.name, path: c.path })),
          },
        ]);
        if (json.notice) {
          setError(`Using catalog search mode (${json.notice})`);
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 z-50 flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-2xl animate-scale-in sm:right-6"
          role="dialog"
          aria-label="Desire Lab Assistant chat"
        >
          <header className="flex items-center justify-between bg-brand px-4 py-3 text-white">
            <div>
              <p className="font-[family-name:var(--font-barlow)] font-semibold">
                Desire Lab Assistant
              </p>
              <p className="text-xs text-white/70">Pack & formulation tools</p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={toggleChat}
                className="rounded-lg p-2 hover:bg-white/10"
                aria-label="Minimize chat"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={closeChat}
                className="rounded-lg p-2 hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div
            ref={listRef}
            className="flex max-h-[360px] min-h-[280px] flex-1 flex-col gap-3 overflow-y-auto bg-surface p-4"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[90%] rounded-2xl px-3 py-2",
                  message.role === "user"
                    ? "ml-auto bg-brand text-white"
                    : "bg-white text-[var(--text-primary)] shadow-sm ring-1 ring-[var(--border)]",
                )}
              >
                {message.role === "user" ? (
                  <p className="text-sm">{message.content}</p>
                ) : (
                  <AssistantContent content={message.content} />
                )}
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1 border-t border-[var(--border)] pt-2">
                    {message.citations.map((c) => (
                      <Link
                        key={c.path}
                        href={c.path}
                        className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand hover:bg-brand/15"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-1 px-2 text-xs text-[var(--text-secondary)]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand [animation-delay:300ms]" />
                Thinking…
              </div>
            )}
          </div>

          {error && (
            <p className="border-t border-[var(--border)] bg-warning/5 px-4 py-2 text-xs text-[var(--text-secondary)]">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="border-t border-[var(--border)] bg-white p-3">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage(input);
                  }
                }}
                rows={2}
                placeholder="Ask about a tool…"
                disabled={isLoading}
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition hover:bg-brand-light disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg transition hover:scale-105 hover:bg-brand-light hover:shadow-xl sm:right-6",
          isOpen && "scale-95 opacity-90",
        )}
        aria-label={isOpen ? "Close Desire Lab Assistant" : "Open Desire Lab Assistant"}
        aria-expanded={isOpen}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </>
  );
}
