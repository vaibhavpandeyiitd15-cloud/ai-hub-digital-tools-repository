import Link from "next/link";
import { AdminToolForm } from "@/components/admin/AdminToolForm";
import { getAllCategoriesForAdmin } from "@/lib/admin-data";

export const metadata = {
  title: "New Tool | AI Hub CMS",
};

export default async function NewToolPage() {
  const categories = await getAllCategoriesForAdmin();

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
          Add tool
        </h1>
      </div>

      {categories.length === 0 ? (
        <p className="text-[var(--text-secondary)]">
          Create a category first before adding tools.{" "}
          <Link href="/admin/categories" className="text-brand hover:underline">
            Manage categories
          </Link>
        </p>
      ) : (
        <AdminToolForm categories={categories} mode="create" />
      )}
    </div>
  );
}
