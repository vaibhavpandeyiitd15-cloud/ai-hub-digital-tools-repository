import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

export type HubCardItem = {
  title: string;
  description: string;
  href: string;
  available?: boolean;
  badge?: string;
};

export function HubCardGrid({
  items,
  featured = false,
  centered = false,
}: {
  items: HubCardItem[];
  featured?: boolean;
  centered?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-6",
        featured ? "grid-cols-1 gap-8 sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
        centered && featured && "mx-auto w-full max-w-5xl",
      )}
    >
      {items.map((item, index) => (
        <ScrollReveal key={item.href} delay={index * 80}>
          {item.available === false ? (
            <Link
              href={item.href}
              className={cn(
                "hub-card relative flex h-full flex-col rounded-2xl bg-white opacity-95",
                featured ? "min-h-[240px] p-8 sm:min-h-[280px] sm:p-10" : "p-6",
                "border-dashed border-[var(--border)]",
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={cn(
                    "rounded-full bg-[var(--border)] font-semibold text-[var(--text-secondary)]",
                    featured ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs",
                  )}
                >
                  Coming soon
                </span>
                <Lock className={featured ? "h-5 w-5" : "h-4 w-4 text-[var(--text-secondary)]"} />
              </div>
              <h2
                className={cn(
                  "font-[family-name:var(--font-barlow)] font-bold text-[var(--text-primary)]",
                  featured ? "text-2xl sm:text-3xl" : "text-xl",
                )}
              >
                {item.title}
              </h2>
              <p
                className={cn(
                  "mt-3 flex-1 text-[var(--text-secondary)]",
                  featured ? "text-base leading-relaxed sm:text-lg" : "mt-2 text-sm",
                )}
              >
                {item.description}
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-semibold text-[var(--text-secondary)]",
                  featured ? "mt-6 text-base" : "mt-4 text-sm",
                )}
              >
                View status
                <ArrowRight className={featured ? "h-5 w-5" : "h-4 w-4"} />
              </span>
            </Link>
          ) : (
            <Link
              href={item.href}
              className={cn(
                "hub-card group flex h-full flex-col rounded-2xl bg-white transition hover:-translate-y-1",
                featured ? "min-h-[240px] p-8 sm:min-h-[280px] sm:p-10" : "p-6 hover:shadow-lg",
              )}
            >
              {item.badge && (
                <span
                  className={cn(
                    "mb-3 w-fit rounded-full bg-brand/10 font-semibold text-brand",
                    featured ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs",
                  )}
                >
                  {item.badge}
                </span>
              )}
              <h2
                className={cn(
                  "font-[family-name:var(--font-barlow)] font-bold text-brand transition group-hover:text-brand-light",
                  featured ? "text-2xl sm:text-3xl" : "text-xl",
                )}
              >
                {item.title}
              </h2>
              <p
                className={cn(
                  "flex-1 text-[var(--text-secondary)]",
                  featured ? "mt-3 text-base leading-relaxed sm:text-lg" : "mt-2 text-sm",
                )}
              >
                {item.description}
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-semibold text-brand",
                  featured ? "mt-6 text-base" : "mt-4 text-sm",
                )}
              >
                Explore
                <ArrowRight
                  className={cn(
                    "transition group-hover:translate-x-0.5",
                    featured ? "h-5 w-5" : "h-4 w-4",
                  )}
                />
              </span>
            </Link>
          )}
        </ScrollReveal>
      ))}
    </div>
  );
}
