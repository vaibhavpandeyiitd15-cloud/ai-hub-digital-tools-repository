"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { PACK_LAB_WORKFLOW_HREF } from "@/lib/content/desire-lab";
import { cn } from "@/lib/utils";

export function PackLabFloatingProjectButton() {
  const pathname = usePathname() ?? "";

  const isPackLab = pathname.startsWith("/labs/pack-lab");
  const isWorkflowPage = pathname === PACK_LAB_WORKFLOW_HREF;

  if (!isPackLab || isWorkflowPage) {
    return null;
  }

  return (
    <Link
      href={PACK_LAB_WORKFLOW_HREF}
      className={cn(
        "fixed top-20 right-4 z-50 flex items-center gap-2 rounded-full bg-u-coral px-4 py-3 text-sm font-semibold text-white shadow-lg transition",
        "hover:scale-105 hover:bg-u-coral/90 hover:shadow-xl sm:right-6",
      )}
      aria-label="Start a new packaging project"
    >
      <Plus className="h-5 w-5 shrink-0" />
      <span className="hidden sm:inline">Start a new project</span>
      <span className="sm:hidden">New project</span>
    </Link>
  );
}
