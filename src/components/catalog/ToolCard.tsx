import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/catalog/StatusBadge";
import type { ToolWithCategory } from "@/lib/tools";

export function ToolCard({ tool }: { tool: ToolWithCategory }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="rounded-full border border-brand/20 bg-brand/5 px-2.5 py-0.5 text-xs font-medium text-brand">
          {tool.category.name}
        </span>
        <StatusBadge status={tool.status} />
      </div>

      <h3 className="mb-2 font-[family-name:var(--font-barlow)] text-lg font-semibold text-[var(--text-primary)] group-hover:text-brand">
        {tool.name}
      </h3>

      <p className="mb-4 line-clamp-2 flex-1 text-sm text-[var(--text-secondary)]">
        {tool.purpose}
      </p>

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm">
        <span className="text-[var(--text-secondary)]">
          POC: <span className="font-medium text-[var(--text-primary)]">{tool.pocName}</span>
        </span>
        <ArrowRight className="h-4 w-4 text-brand opacity-0 transition group-hover:opacity-100" />
      </div>
    </Link>
  );
}
