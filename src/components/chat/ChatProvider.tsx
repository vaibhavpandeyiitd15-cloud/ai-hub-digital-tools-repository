"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ChatContextValue = {
  isOpen: boolean;
  openChat: (initialMessage?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  pendingMessage: string | null;
  clearPendingMessage: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const openChat = useCallback((initialMessage?: string) => {
    if (initialMessage) setPendingMessage(initialMessage);
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((v) => !v), []);
  const clearPendingMessage = useCallback(() => setPendingMessage(null), []);

  const value = useMemo(
    () => ({
      isOpen,
      openChat,
      closeChat,
      toggleChat,
      pendingMessage,
      clearPendingMessage,
    }),
    [isOpen, openChat, closeChat, toggleChat, pendingMessage, clearPendingMessage],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return ctx;
}
