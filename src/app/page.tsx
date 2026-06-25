import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { DatabaseSetupBanner } from "@/components/catalog/DatabaseSetupBanner";
import { ToolGrid } from "@/components/catalog/ToolGrid";
import { HeroSection } from "@/components/home/HeroSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
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
      <HeroSection categorySlug={categorySlug || undefined} defaultQuery={q} />

      <section className="mx-auto max-w-7xl px-6 py-10">
        {showDbBanner ? <DatabaseSetupBanner /> : null}
        {showSeedBanner ? (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            Database connected but empty. Run{" "}
            <code className="rounded bg-blue-100 px-1">npm run db:setup</code> to
            migrate and seed tools.
          </div>
        ) : null}

        <ScrollReveal>
          <CategoryFilter
            categories={categories}
            activeSlug={categorySlug || undefined}
            searchQuery={q}
          />
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">
            {filtered.length} tool{filtered.length === 1 ? "" : "s"}
          </p>
        </ScrollReveal>

        <ToolGrid tools={filtered} />
      </section>
    </div>
  );
}
