import { ToolCard } from "@/components/catalog/ToolCard";
import type { ToolWithCategory } from "@/lib/tools";

export function ToolGrid({ tools }: { tools: ToolWithCategory[] }) {
  if (tools.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
        <p className="font-[family-name:var(--font-barlow)] text-lg font-semibold text-[var(--text-primary)]">
          No tools found
        </p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Try adjusting your search or category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
