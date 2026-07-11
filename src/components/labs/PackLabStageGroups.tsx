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
            className="overflow-hidden rounded-2xl shadow-md"
            style={{
              border: `2px solid ${color}`,
              backgroundColor: isOpen ? "#ffffff" : color,
            }}
          >
            <button
              type="button"
              onClick={() => setOpenGroup(isOpen ? null : group.slug)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:brightness-[0.97]"
              style={{ backgroundColor: color }}
              aria-expanded={isOpen}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">
                  Phase {index + 1}
                </p>
                <h3 className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-white">
                  {group.name}
                </h3>
                <p className="mt-1.5 max-w-2xl text-sm font-medium text-white">
                  {group.description}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-6 w-6 shrink-0 text-white transition",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {isOpen ? (
              <div className="border-t bg-white px-6 py-5" style={{ borderColor: color }}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.stageSlugs.map((stageSlug) => {
                    const stage = getPackSection(stageSlug);
                    if (!stage) return null;

                    return (
                      <Link
                        key={stage.slug}
                        href={stage.href}
                        className="group rounded-xl border-2 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                        style={{ borderColor: color }}
                      >
                        <p
                          className="text-xs font-bold uppercase tracking-wide"
                          style={{ color }}
                        >
                          Stage
                        </p>
                        <h4
                          className="mt-1 font-[family-name:var(--font-barlow)] text-lg font-bold"
                          style={{ color }}
                        >
                          {stage.name}
                        </h4>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-[#1a3352]">
                          {stage.description}
                        </p>
                        <span
                          className="mt-4 inline-flex text-sm font-bold"
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
