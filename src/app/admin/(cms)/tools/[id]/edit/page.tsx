import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminToolForm } from "@/components/admin/AdminToolForm";
import { getAllCategoriesForAdmin, getToolForAdmin } from "@/lib/admin-data";

export const metadata = {
  title: "Edit Tool | Desire Lab CMS",
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};

export default async function EditToolPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { created } = await searchParams;
  const [tool, categories] = await Promise.all([
    getToolForAdmin(id),
    getAllCategoriesForAdmin(),
  ]);

  if (!tool) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/tools"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to tools
        </Link>
        <h1 className="mt-2 font-[family-name:var(--font-barlow)] text-3xl font-bold text-brand">
          Edit {tool.name}
        </h1>
        {created === "1" && (
          <p className="mt-2 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
            Tool created successfully. You can add training docs and POC details below.
          </p>
        )}
      </div>

      <AdminToolForm categories={categories} tool={tool} mode="edit" />
    </div>
  );
}
