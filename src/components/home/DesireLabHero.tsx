"use client";

import type { ReactNode } from "react";
import { HeroLogoMarquee } from "@/components/home/HeroLogoMarquee";
import { WaveBackground } from "@/components/ui/WaveBackground";
import { cn } from "@/lib/utils";

type DesireLabHeroProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  /** Larger title — used on the home page hero */
  largeTitle?: boolean;
  /** Optional action rendered top-right (e.g. Pack Lab “Start a new project”) */
  topAction?: ReactNode;
};

export function DesireLabHero({
  eyebrow,
  title = "Desire Lab",
  subtitle = "Packaging Lab and Formulation Lab innovation tools — organised by stage and capability.",
  compact = false,
  largeTitle = false,
  topAction,
}: DesireLabHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#001448] via-brand to-[#0057B8] text-white">
      {/* Campaign colour washes — Every U Does Good */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(255,107,74,0.22),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(0,195,137,0.2),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_20%,rgba(255,199,44,0.12),transparent_45%)]"
        aria-hidden
      />
      <WaveBackground />
      <div
        className="pointer-events-none absolute -right-20 -top-20 z-[1] h-80 w-80 rounded-full border-[3px] border-white/10"
        aria-hidden
      />

      <div
        className={cn(
          "relative",
          compact ? "min-h-[190px] pt-7 pb-5 sm:pt-8" : "min-h-[240px] pt-10 pb-6 sm:pt-12 sm:pb-8",
        )}
      >
        {topAction ? (
          <div className="absolute top-4 right-4 z-20 sm:top-6 sm:right-6">{topAction}</div>
        ) : null}
        <HeroLogoMarquee compact={compact} fullBleed />

        <div
          className={cn(
            "relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10",
          )}
        >
          <div className="relative text-center lg:text-left">
            <div
              className="pointer-events-none absolute -inset-x-4 -inset-y-6 -z-10 rounded-2xl bg-brand/50 backdrop-blur-[2px] lg:-inset-x-8 lg:bg-brand/35"
              aria-hidden
            />
            {eyebrow ? (
              <p
                className={cn(
                  "mb-2 inline-block animate-fade-up rounded-full border border-white/20 bg-brand/40 px-4 py-1 font-medium tracking-widest uppercase backdrop-blur-sm",
                  compact ? "text-[10px]" : "text-xs",
                )}
              >
                {eyebrow}
              </p>
            ) : null}
            <h1
              className={cn(
                "animate-fade-up font-[family-name:var(--font-barlow)] font-bold tracking-tight drop-shadow-sm [animation-delay:100ms]",
                largeTitle
                  ? "text-4xl sm:text-5xl md:text-6xl"
                  : compact
                    ? "text-3xl sm:text-4xl"
                    : "text-4xl sm:text-5xl",
                !eyebrow && "mt-0",
              )}
            >
              {title}
            </h1>
            <p
              className={cn(
                "mx-auto animate-fade-up text-white/90 drop-shadow-sm [animation-delay:200ms] lg:mx-0",
                compact
                  ? "mt-2 max-w-xl text-sm sm:text-base"
                  : "mt-4 max-w-2xl text-base sm:text-lg",
              )}
            >
              {subtitle}
            </p>
          </div>

          {/* Reserves space for the logo reveal on the right */}
          <div
            className={cn(
              "shrink-0",
              compact ? "h-[170px] w-[170px]" : "h-[220px] w-[220px] sm:h-[240px] sm:w-[240px]",
            )}
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
