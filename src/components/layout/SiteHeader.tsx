import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="bg-brand text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/assets/unilever-logo.png"
            alt="Unilever"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />
          <span className="hidden font-[family-name:var(--font-barlow)] text-sm font-semibold tracking-wide sm:inline">
            AI Hub Tool Guide
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-white/90 transition hover:text-white"
          >
            Tools
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full p-2 text-white/90 transition hover:bg-white/10 hover:text-white"
            aria-label="Open AI assistant (coming soon)"
            title="AI assistant — coming in Phase 4"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
