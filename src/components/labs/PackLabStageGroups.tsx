"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { packStageGroups } from "@/lib/content/pack-lab-stages";
import { getPackSection } from "@/lib/content/desire-lab";
import { cn } from "@/lib/utils";

export function PackLabStageGroups() {
  const [openGroup, setOpenGroup] = useState<string | null>(packStageGroups[0]?.slug ?? null);

  return (
    <div className="space-y-4">
      {packStageGroups.map((group, index) => {
        const isOpen = openGroup === group.slug;

        return (
          <div
            key={group.slug}
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenGroup(isOpen ? null : group.slug)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-surface/60"
              aria-expanded={isOpen}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                  Stage {index + 1}
                </p>
                <h3 className="font-[family-name:var(--font-barlow)] text-xl font-bold text-[var(--text-primary)]">
                  {group.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{group.description}</p>
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-brand transition",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {isOpen ? (
              <div className="border-t border-[var(--border)] bg-surface/40 px-6 py-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.stageSlugs.map((stageSlug) => {
                    const stage = getPackSection(stageSlug);
                    if (!stage) return null;

                    return (
                      <Link
                        key={stage.slug}
                        href={stage.href}
                        className="group rounded-xl border border-[var(--border)] bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                          Stage
                        </p>
                        <h4 className="mt-1 font-[family-name:var(--font-barlow)] text-lg font-semibold text-brand group-hover:text-brand-light">
                          {stage.name}
                        </h4>
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                          {stage.description}
                        </p>
                        <span className="mt-4 inline-flex text-sm font-semibold text-brand">
                          Browse tools →
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
