"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { useBooking } from "@/components/booking/BookingProvider";
import { StatusBadge } from "@/components/catalog/StatusBadge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { ToolWithCategory } from "@/lib/tools";

export function ToolCard({ tool, index = 0 }: { tool: ToolWithCategory; index?: number }) {
  const { openBooking } = useBooking();

  return (
    <ScrollReveal delay={index * 80}>
      <article className="hub-card group relative flex flex-col overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1">
        <div className="absolute inset-x-0 top-[3px] h-0.5 bg-gradient-to-r from-u-mint via-brand-light to-u-coral opacity-0 transition group-hover:opacity-100" />

        <Link href={`/tools/${tool.slug}`} className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <span className="rounded-full border border-brand/20 bg-brand/5 px-2.5 py-0.5 text-xs font-medium text-brand">
              {tool.category.name}
            </span>
            <StatusBadge status={tool.status} />
          </div>

          <h3 className="mb-2 font-[family-name:var(--font-barlow)] text-lg font-semibold text-[var(--text-primary)] transition group-hover:text-brand">
            {tool.name}
          </h3>

          <p className="mb-4 line-clamp-2 flex-1 text-sm text-[var(--text-secondary)]">
            {tool.purpose}
          </p>

          <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm">
            <span className="text-[var(--text-secondary)]">
              POC:{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {tool.pocName}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 text-brand opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
          </div>
        </Link>

        <div className="border-t border-[var(--border)] bg-surface/50 px-5 py-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              openBooking({
                id: tool.id,
                name: tool.name,
                slug: tool.slug,
                pocName: tool.pocName,
                pocEmail: tool.pocEmail,
              });
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-brand transition hover:bg-brand/10"
          >
            <Calendar className="h-3.5 w-3.5" />
            Request a training
          </button>
        </div>
      </article>
    </ScrollReveal>
  );
}
