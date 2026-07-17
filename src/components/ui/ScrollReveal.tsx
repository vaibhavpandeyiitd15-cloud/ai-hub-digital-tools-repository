"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

function isElementInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  return rect.bottom > 0 && rect.right > 0 && rect.top < viewportHeight && rect.left < viewportWidth;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Start visible so critical tiles/content never stay blank if JS observers fail
  // (common when cloning and running locally with blocked scripts or odd viewports).
  const [visible, setVisible] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setVisible(true);
      setAnimateIn(true);
      return;
    }

    // Only hide for animation when the element is below the fold
    if (!isElementInViewport(el)) {
      setVisible(false);
    } else {
      setAnimateIn(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      setAnimateIn(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setAnimateIn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );

    observer.observe(el);

    // Safety net: never leave content invisible
    const fallback = window.setTimeout(() => {
      setVisible(true);
      setAnimateIn(true);
      observer.disconnect();
    }, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        visible || animateIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
      style={{ transitionDelay: visible || animateIn ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
