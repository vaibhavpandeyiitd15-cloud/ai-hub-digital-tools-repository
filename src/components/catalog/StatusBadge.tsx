import type { ToolStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const styles: Record<ToolStatus, string> = {
  ACTIVE: "bg-emerald-50 text-success",
  BETA: "bg-amber-50 text-amber-700",
  DEPRECATED: "bg-red-50 text-danger",
};

const labels: Record<ToolStatus, string> = {
  ACTIVE: "Active",
  BETA: "Beta",
  DEPRECATED: "Deprecated",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ToolStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[status],
        className,
      )}
    >
      {labels[status]}
    </span>
  );
}
