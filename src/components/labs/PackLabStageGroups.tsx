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
        const { color } = group;

        return (
          <div
            key={group.slug}
            className="overflow-hidden rounded-2xl border bg-white/95 shadow-sm backdrop-blur-sm"
            style={{ borderColor: `${color}40` }}
          >
            <button
              type="button"
              onClick={() => setOpenGroup(isOpen ? null : group.slug)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition"
              style={{
                background: isOpen
                  ? `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`
                  : `linear-gradient(135deg, ${color}12 0%, transparent 100%)`,
              }}
              aria-expanded={isOpen}
            >
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color }}
                >
                  Phase {index + 1}
                </p>
                <h3
                  className="font-[family-name:var(--font-barlow)] text-xl font-bold"
                  style={{ color }}
                >
                  {group.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{group.description}</p>
              </div>
              <ChevronDown
                className={cn("h-5 w-5 shrink-0 transition", isOpen && "rotate-180")}
                style={{ color }}
              />
            </button>

            {isOpen ? (
              <div
                className="border-t px-6 py-5"
                style={{
                  borderColor: `${color}30`,
                  background: `linear-gradient(180deg, ${color}06 0%, transparent 100%)`,
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.stageSlugs.map((stageSlug) => {
                    const stage = getPackSection(stageSlug);
                    if (!stage) return null;

                    return (
                      <Link
                        key={stage.slug}
                        href={stage.href}
                        className="group rounded-xl border bg-white/95 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                        style={{
                          borderColor: `${color}35`,
                          boxShadow: `0 0 0 0 ${color}`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = color;
                          e.currentTarget.style.boxShadow = `0 8px 24px ${color}25`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = `${color}35`;
                          e.currentTarget.style.boxShadow = `0 0 0 0 ${color}`;
                        }}
                      >
                        <p
                          className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color }}
                        >
                          Stage
                        </p>
                        <h4
                          className="mt-1 font-[family-name:var(--font-barlow)] text-lg font-semibold"
                          style={{ color }}
                        >
                          {stage.name}
                        </h4>
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                          {stage.description}
                        </p>
                        <span
                          className="mt-4 inline-flex text-sm font-semibold"
                          style={{ color }}
                        >
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
