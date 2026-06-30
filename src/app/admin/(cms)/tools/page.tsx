import Link from "next/link";
import { Plus } from "lucide-react";
import { DeprecateToolButton } from "@/components/admin/DeprecateToolButton";
import { StatusBadge } from "@/components/catalog/StatusBadge";
import { getAllToolsForAdmin } from "@/lib/admin-data";
import { hasDatabase } from "@/lib/db";

export const metadata = {
  title: "Tools | Desire Lab CMS",
};

export default async function AdminToolsPage() {
  const tools = await getAllToolsForAdmin();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-barlow)] text-3xl font-bold text-brand">
            Tools
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage catalog entries, POCs, and training resources
          </p>
        </div>
        <Link href="/admin/tools/new" className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add tool
        </Link>
      </div>

      {!hasDatabase() && (
        <div className="mb-6 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
          Database is not connected. Configure Supabase env vars to manage tools.
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-surface text-xs uppercase tracking-wide text-[var(--text-secondary)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Tool</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">POC</th>
                <th className="px-4 py-3 font-semibold">Bookings</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {tools.map((tool) => (
                <tr key={tool.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand">{tool.name}</p>
                    <p className="font-mono text-xs text-[var(--text-secondary)]">
                      /{tool.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {tool.category.name}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={tool.status} />
                  </td>
                  <td className="px-4 py-3">
                    <p>{tool.pocName}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{tool.pocEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {tool._count.bookings}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/admin/tools/${tool.id}/edit`}
                        className="text-sm font-medium text-brand hover:underline"
                      >
                        Edit
                      </Link>
                      {tool.status !== "DEPRECATED" && (
                        <DeprecateToolButton toolId={tool.id} toolName={tool.name} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tools.length === 0 && (
          <p className="px-6 py-12 text-center text-[var(--text-secondary)]">
            No tools yet.{" "}
            <Link href="/admin/tools/new" className="text-brand hover:underline">
              Add your first tool
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
