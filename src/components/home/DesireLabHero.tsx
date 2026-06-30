"use client";

import { WaveBackground } from "@/components/ui/WaveBackground";

type DesireLabHeroProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

export function DesireLabHero({
  eyebrow = "Unilever · Head Office",
  title = "Desire Lab",
  subtitle = "Consumer and science innovation tools — organised by lab, section, and capability.",
}: DesireLabHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-brand/10 bg-gradient-to-br from-brand via-brand to-brand-light text-white">
      <WaveBackground />
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border-[3px] border-white/10"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-6 py-14 text-center sm:py-18">
        <p className="mb-3 inline-block animate-fade-up rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
          {eyebrow}
        </p>
        <h1 className="animate-fade-up font-[family-name:var(--font-barlow)] text-4xl font-bold tracking-tight sm:text-5xl [animation-delay:100ms]">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl animate-fade-up text-base text-white/85 sm:text-lg [animation-delay:200ms]">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
