import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbItem } from "@/lib/content/desire-lab";
import { cn } from "@/lib/utils";

export function LabBreadcrumbs({
  items,
  variant = "default",
}: {
  items: BreadcrumbItem[];
  variant?: "default" | "hero";
}) {
  const onHero = variant === "hero";

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "mb-6 text-sm",
        onHero ? "text-white/80" : "text-[var(--text-secondary)]",
      )}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    onHero ? "text-white/60" : "opacity-50",
                  )}
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "font-medium hover:underline",
                    onHero ? "text-white/90 hover:text-white" : "text-brand",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast && (onHero ? "text-white" : "text-[var(--text-primary)]"),
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
