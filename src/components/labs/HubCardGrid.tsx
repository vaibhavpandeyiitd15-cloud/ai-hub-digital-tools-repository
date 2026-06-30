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

export function HubCardGrid({ items }: { items: HubCardItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <ScrollReveal key={item.href} delay={index * 80}>
          {item.available === false ? (
            <div
              className={cn(
                "relative flex h-full flex-col rounded-2xl border border-dashed border-[var(--border)] bg-white/60 p-6 opacity-80",
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-[var(--border)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-secondary)]">
                  Coming soon
                </span>
                <Lock className="h-4 w-4 text-[var(--text-secondary)]" />
              </div>
              <h2 className="font-[family-name:var(--font-barlow)] text-xl font-bold text-[var(--text-primary)]">
                {item.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-[var(--text-secondary)]">
                {item.description}
              </p>
            </div>
          ) : (
            <Link
              href={item.href}
              className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg"
            >
              {item.badge && (
                <span className="mb-3 w-fit rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                  {item.badge}
                </span>
              )}
              <h2 className="font-[family-name:var(--font-barlow)] text-xl font-bold text-brand transition group-hover:text-brand-light">
                {item.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-[var(--text-secondary)]">
                {item.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                Explore
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          )}
        </ScrollReveal>
      ))}
    </div>
  );
}
