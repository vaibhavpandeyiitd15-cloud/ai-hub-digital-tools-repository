"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deprecateToolAction } from "@/lib/actions/tools";

export function DeprecateToolButton({
  toolId,
  toolName,
}: {
  toolId: string;
  toolName: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (
          !confirm(
            `Mark "${toolName}" as deprecated? It will be hidden from the public catalog.`,
          )
        ) {
          return;
        }
        startTransition(async () => {
          await deprecateToolAction(toolId);
          router.refresh();
        });
      }}
      className="text-sm font-medium text-warning hover:underline disabled:opacity-50"
    >
      {pending ? "Updating…" : "Deprecate"}
    </button>
  );
}
