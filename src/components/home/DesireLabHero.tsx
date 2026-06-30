"use client";

import { WaveBackground } from "@/components/ui/WaveBackground";
import { cn } from "@/lib/utils";

type DesireLabHeroProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
};

export function DesireLabHero({
  eyebrow = "Unilever · Head Office",
  title = "Desire Lab",
  subtitle = "Consumer and science innovation tools — organised by lab, section, and capability.",
  compact = false,
}: DesireLabHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-brand/10 bg-gradient-to-br from-brand via-brand to-brand-light text-white">
      <WaveBackground />
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border-[3px] border-white/10"
        aria-hidden
      />
      <div
        className={cn(
          "relative mx-auto max-w-7xl px-6 text-center",
          compact ? "py-8 sm:py-10" : "py-14 sm:py-18",
        )}
      >
        <p
          className={cn(
            "mb-2 inline-block animate-fade-up rounded-full border border-white/20 bg-white/10 px-4 py-1 font-medium tracking-widest uppercase backdrop-blur-sm",
            compact ? "text-[10px]" : "text-xs",
          )}
        >
          {eyebrow}
        </p>
        <h1
          className={cn(
            "animate-fade-up font-[family-name:var(--font-barlow)] font-bold tracking-tight [animation-delay:100ms]",
            compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl",
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "mx-auto animate-fade-up text-white/85 [animation-delay:200ms]",
            compact
              ? "mt-2 max-w-xl text-sm sm:text-base"
              : "mt-4 max-w-2xl text-base sm:text-lg",
          )}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
}
