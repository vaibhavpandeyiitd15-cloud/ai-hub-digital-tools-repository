"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MessageCircle } from "lucide-react";
import { useBooking } from "@/components/booking/BookingProvider";
import { useChat } from "@/components/chat/ChatProvider";

export function SiteHeader() {
  const { openBooking } = useBooking();
  const { openChat } = useChat();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand/95 text-white shadow-lg backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
        >
          <Image
            src="/assets/unilever-logo.png"
            alt="Unilever"
            width={120}
            height={40}
            className="h-8 w-auto transition-transform group-hover:scale-[1.02]"
            priority
          />
          <span className="hidden font-[family-name:var(--font-barlow)] text-sm font-semibold tracking-wide sm:inline">
            Desire Lab
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/about"
            className="text-sm font-medium text-white/90 transition hover:text-white"
          >
            Our journey
          </Link>
          <Link
            href="/labs/pack-lab"
            className="text-sm font-medium text-white/90 transition hover:text-white"
          >
            Pack Lab
          </Link>
          <Link
            href="/labs/formulation-lab"
            className="text-sm font-medium text-white/90 transition hover:text-white"
          >
            Formulation Lab
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openBooking()}
            className="hidden items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-sm font-medium transition hover:bg-white/20 sm:inline-flex"
          >
            <Calendar className="h-4 w-4" />
            Request a training
          </button>
          <button
            type="button"
            onClick={() => openChat()}
            className="rounded-full p-2 text-white/90 transition hover:bg-white/10 hover:text-white"
            aria-label="Open Desire Lab assistant"
            title="Open Desire Lab assistant"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
