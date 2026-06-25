import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { DatabaseSetupBanner } from "@/components/catalog/DatabaseSetupBanner";
import { ToolGrid } from "@/components/catalog/ToolGrid";
import { hasDatabase } from "@/lib/db";
import { getActiveTools, getCategories } from "@/lib/tools";

type HomePageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, category } = await searchParams;
  const [tools, categories] = await Promise.all([
    getActiveTools(),
    getCategories(),
  ]);

  const query = q?.trim().toLowerCase() ?? "";
  const categorySlug = category?.trim() ?? "";

  const showDbBanner = !hasDatabase();
  const showSeedBanner =
    hasDatabase() && tools.length === 0 && categories.length === 0;

  const filtered = tools.filter((tool) => {
    const matchesCategory =
      !categorySlug || tool.category.slug === categorySlug;

    const matchesQuery =
      !query ||
      tool.name.toLowerCase().includes(query) ||
      tool.purpose.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 text-center">
          <h1 className="font-[family-name:var(--font-barlow)] text-3xl font-bold text-brand sm:text-4xl">
            AI Hub Digital Tools
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--text-secondary)]">
            Discover, learn, and get support for every tool at Unilever Head
            Office AI Hub.
          </p>
          <form className="mx-auto mt-8 max-w-xl" action="/" method="get">
            {categorySlug ? (
              <input type="hidden" name="category" value={categorySlug} />
            ) : null}
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search tools by name, purpose, or tag…"
              className="w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {showDbBanner ? <DatabaseSetupBanner /> : null}
        {showSeedBanner ? (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            Database connected but empty. Run{" "}
            <code className="rounded bg-blue-100 px-1">npm run db:setup</code> to
            migrate and seed tools.
          </div>
        ) : null}

        <CategoryFilter
          categories={categories}
          activeSlug={categorySlug || undefined}
          searchQuery={q}
        />

        <p className="mb-6 text-sm text-[var(--text-secondary)]">
          {filtered.length} tool{filtered.length === 1 ? "" : "s"}
        </p>

        <ToolGrid tools={filtered} />
      </section>
    </div>
  );
}
