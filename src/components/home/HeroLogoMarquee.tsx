"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  HERO_MARQUEE_HANDOFF_S,
  HERO_MARQUEE_PLAY_MS,
  HERO_MARQUEE_ROW1_DURATION,
  HERO_MARQUEE_ROW2_DURATION,
  UNILEVER_BRAND_SYMBOLS_LOOP,
  UNILEVER_LOGO_U_SRC,
} from "@/lib/content/unilever-brand-symbols";
import { cn } from "@/lib/utils";

type HeroLogoMarqueeProps = {
  compact?: boolean;
  fullBleed?: boolean;
  className?: string;
};

function MarqueeRow({
  rowRef,
  reverse,
  duration,
}: {
  rowRef: React.RefObject<HTMLDivElement | null>;
  reverse: boolean;
  duration: number;
}) {
  return (
    <div className="hero-marquee-viewport w-full overflow-hidden">
      <div
        ref={rowRef}
        className={cn(
          "hero-marquee-track flex w-max items-center",
          reverse ? "hero-marquee-row-reverse" : "hero-marquee-row-forward",
        )}
        style={
          {
            "--marquee-duration": `${duration}s`,
          } as React.CSSProperties
        }
      >
        {UNILEVER_BRAND_SYMBOLS_LOOP.map((symbol, index) => (
          <div
            key={`${symbol.id}-${index}`}
            className="hero-marquee-icon shrink-0"
            aria-hidden
          >
            <Image
              src={symbol.src}
              alt=""
              width={72}
              height={72}
              className="hero-marquee-icon-img h-[var(--hero-icon-size)] w-auto object-contain brightness-0 invert"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroLogoMarquee({
  compact = false,
  fullBleed = false,
  className,
}: HeroLogoMarqueeProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const masterRef = useRef<HTMLDivElement>(null);
  const handoffDoneRef = useRef(false);
  const [marqueeHidden, setMarqueeHidden] = useState(false);
  const [logoRevealed, setLogoRevealed] = useState(false);

  const logoSize = compact ? 170 : 240;

  const runHandoff = useCallback(() => {
    const marquee = marqueeRef.current;
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    const master = masterRef.current;
    if (!marquee || !row1 || !row2 || !master || handoffDoneRef.current) return;

    handoffDoneRef.current = true;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set(marquee, { display: "none" });
      gsap.set(row1, { animationPlayState: "paused" });
      gsap.set(row2, { animationPlayState: "paused" });
      gsap.set(master, { opacity: 1, scale: 1 });
      setMarqueeHidden(true);
      setLogoRevealed(true);
      return;
    }

    try {
    const slowDuration1 = HERO_MARQUEE_ROW1_DURATION * 3;
    const slowDuration2 = HERO_MARQUEE_ROW2_DURATION * 3;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(row1, { animationPlayState: "paused" });
        gsap.set(row2, { animationPlayState: "paused" });
        gsap.set(marquee, { display: "none" });
        gsap.set(master, { opacity: 1, scale: 1 });
        setMarqueeHidden(true);
        setLogoRevealed(true);
      },
    });

    tl.to(
      row1,
      {
        "--marquee-duration": `${slowDuration1}s`,
        duration: HERO_MARQUEE_HANDOFF_S,
        ease: "power1.out",
      },
      0,
    );
    tl.to(
      row2,
      {
        "--marquee-duration": `${slowDuration2}s`,
        duration: HERO_MARQUEE_HANDOFF_S,
        ease: "power1.out",
      },
      0,
    );
    tl.to(
      marquee,
      {
        opacity: 0,
        duration: HERO_MARQUEE_HANDOFF_S,
        ease: "power1.out",
      },
      0,
    );
    tl.fromTo(
      master,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: HERO_MARQUEE_HANDOFF_S,
        ease: "power1.out",
      },
      0,
    );
    } catch {
      gsap.set(marquee, { display: "none", opacity: 0 });
      gsap.set(master, { opacity: 1, scale: 1 });
      setMarqueeHidden(true);
      setLogoRevealed(true);
    }
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      runHandoff();
      return;
    }

    const handoffTimer = setTimeout(() => runHandoff(), HERO_MARQUEE_PLAY_MS);
    return () => clearTimeout(handoffTimer);
  }, [runHandoff]);

  return (
    <div
      ref={stageRef}
      className={cn(
        "hero-marquee-stage pointer-events-none",
        fullBleed ? "absolute inset-0 z-0" : "relative w-full max-w-[360px]",
        className,
      )}
    >
      <div
        className={cn(
          "hero-marquee-bleed flex h-full flex-col justify-center",
          fullBleed && "absolute inset-y-0 left-1/2 w-screen -translate-x-1/2",
        )}
      >
        <div
          ref={marqueeRef}
          className={cn(
            "hero-marquee-muted flex flex-col",
            compact ? "gap-3" : "gap-4",
          )}
          aria-hidden={marqueeHidden}
        >
          <MarqueeRow rowRef={row1Ref} reverse={false} duration={HERO_MARQUEE_ROW1_DURATION} />
          <MarqueeRow rowRef={row2Ref} reverse duration={HERO_MARQUEE_ROW2_DURATION} />
        </div>
      </div>

      <div
        className={cn(
          "absolute inset-y-0 left-0 right-0 z-[2] mx-auto flex max-w-7xl items-center justify-end px-6",
          logoRevealed && "z-[3]",
        )}
      >
        <div
          ref={masterRef}
          className={cn(
            "hero-logo-master flex shrink-0 items-center justify-center",
            compact ? "h-[170px] w-[170px]" : "h-[220px] w-[220px] sm:h-[240px] sm:w-[240px]",
            logoRevealed && "hero-logo-revealed",
          )}
        >
          <Image
            src={UNILEVER_LOGO_U_SRC}
            alt="Unilever"
            width={logoSize}
            height={logoSize}
            quality={100}
            priority
            className="h-auto w-full drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
