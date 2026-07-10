import { ToolCard } from "@/components/catalog/ToolCard";
import type { PackSectionToolCard, ToolWithCategory } from "@/lib/tools";

export function LabToolList({
  tools,
  emptyMessage,
}: {
  tools: (ToolWithCategory | PackSectionToolCard)[];
  emptyMessage?: string;
}) {
  if (tools.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-white px-6 py-12 text-center text-[var(--text-secondary)]">
        {emptyMessage ?? "No tools available in this section yet."}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool, index) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          index={index}
          href={"href" in tool ? tool.href : undefined}
        />
      ))}
    </div>
  );
}
