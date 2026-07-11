import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/catalog/StatusBadge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { ToolWithCategory } from "@/lib/tools";
import { getToolUserCount } from "@/lib/content/tool-user-count";

export function ToolCard({
  tool,
  index = 0,
  href,
  accentColor,
}: {
  tool: ToolWithCategory;
  index?: number;
  href?: string;
  accentColor?: string;
}) {
  const toolHref = href ?? `/tools/${tool.slug}`;
  const userCount = getToolUserCount(tool.slug);

  return (
    <ScrollReveal delay={index * 80}>
      <article
        className="hub-card group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white/95 backdrop-blur-sm transition duration-300 hover:-translate-y-1"
        style={
          accentColor
            ? { borderTopWidth: 3, borderTopColor: accentColor }
            : undefined
        }
      >
        {!accentColor ? (
          <div className="absolute inset-x-0 top-[3px] h-0.5 bg-gradient-to-r from-u-mint via-brand-light to-u-coral opacity-0 transition group-hover:opacity-100" />
        ) : null}

        <Link href={toolHref} className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            {accentColor ? (
              <span
                className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
                style={{
                  borderColor: `${accentColor}40`,
                  backgroundColor: `${accentColor}12`,
                  color: accentColor,
                }}
              >
                {tool.category.name}
              </span>
            ) : (
              <span className="rounded-full border border-brand/20 bg-brand/5 px-2.5 py-0.5 text-xs font-medium text-brand">
                {tool.category.name}
              </span>
            )}
            <StatusBadge status={tool.status} />
          </div>

          <h3
            className={
              accentColor
                ? "mb-2 font-[family-name:var(--font-barlow)] text-lg font-semibold transition group-hover:opacity-90"
                : "mb-2 font-[family-name:var(--font-barlow)] text-lg font-semibold text-[var(--text-primary)] transition group-hover:text-brand"
            }
            style={accentColor ? { color: accentColor } : undefined}
          >
            {tool.name}
          </h3>

          <p className="mb-4 line-clamp-2 flex-1 text-sm font-medium text-[#334e68]">
            {tool.purpose}
          </p>

          <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-[var(--text-secondary)]">
                POC:{" "}
                <span className="font-medium text-[var(--text-primary)]">{tool.pocName}</span>
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                No. of users:{" "}
                <span className="font-semibold text-[var(--text-primary)]">{userCount}</span>
              </span>
            </div>
            <ArrowRight
              className={
                accentColor
                  ? "h-4 w-4 opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                  : "h-4 w-4 text-brand opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
              }
              style={accentColor ? { color: accentColor } : undefined}
            />
          </div>
        </Link>
      </article>
    </ScrollReveal>
  );
}
