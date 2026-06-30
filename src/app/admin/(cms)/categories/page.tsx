import { CategoryManager } from "@/components/admin/CategoryManager";
import { getAllCategoriesForAdmin } from "@/lib/admin-data";

export const metadata = {
  title: "Categories | Desire Lab CMS",
};

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesForAdmin();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-barlow)] text-3xl font-bold text-brand">
          Categories
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Organize tools into browsable groups on the catalog home page
        </p>
      </div>

      <CategoryManager categories={categories} />
    </div>
  );
}
