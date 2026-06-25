"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BookingModal } from "@/components/booking/BookingModal";

export type BookingTool = {
  id: string;
  name: string;
  slug: string;
  pocName: string;
  pocEmail: string;
};

type BookingContextValue = {
  openBooking: (tool?: BookingTool) => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({
  children,
  allTools = [],
}: {
  children: ReactNode;
  allTools?: BookingTool[];
}) {
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState<BookingTool | null>(null);

  const openBooking = useCallback((selected?: BookingTool) => {
    setTool(selected ?? null);
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({ openBooking, closeBooking }),
    [openBooking, closeBooking],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingModal
        open={open}
        onClose={closeBooking}
        tool={tool}
        tools={tool ? undefined : allTools}
      />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return ctx;
}
