"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { WaveBackground } from "@/components/ui/WaveBackground";

type HeroSectionProps = {
  categorySlug?: string;
  defaultQuery?: string;
};

export function HeroSection({ categorySlug, defaultQuery }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-brand/10 bg-gradient-to-br from-brand via-brand to-brand-light text-white">
      <WaveBackground />

      {/* U-inspired arc ornament */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border-[3px] border-white/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 top-10 h-56 w-56 rounded-full border border-success/20"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 text-center sm:py-20">
        <p className="mb-3 inline-block animate-fade-up rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
          Desire Lab · Mumbai & Bangalore
        </p>
        <h1 className="animate-fade-up font-[family-name:var(--font-barlow)] text-4xl font-bold tracking-tight sm:text-5xl [animation-delay:100ms]">
          AI Hub Digital Tools
        </h1>
          <p className="mx-auto mt-4 max-w-2xl animate-fade-up text-base text-white/85 sm:text-lg [animation-delay:200ms]">
            Discover, learn, and get support for every digital tool — book training
            with tool experts in one place.
          </p>
          <p className="mt-4 animate-fade-up [animation-delay:250ms]">
            <Link
              href="/about"
              className="text-sm font-medium text-success underline-offset-4 hover:underline"
            >
              From AI Hub to Desire Lab →
            </Link>
          </p>

        <form
          className="relative mx-auto mt-10 max-w-xl animate-fade-up [animation-delay:300ms]"
          action="/"
          method="get"
        >
          {categorySlug ? (
            <input type="hidden" name="category" value={categorySlug} />
          ) : null}
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand/50" />
          <input
            type="search"
            name="q"
            defaultValue={defaultQuery ?? ""}
            placeholder="Search tools by name, purpose, or tag…"
            className="w-full rounded-xl border-0 bg-white py-4 pr-4 pl-12 text-sm text-[var(--text-primary)] shadow-lg outline-none ring-2 ring-transparent transition focus:ring-success/40"
          />
        </form>
      </div>
    </section>
  );
}
