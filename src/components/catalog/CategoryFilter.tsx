import Link from "next/link";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export function CategoryFilter({
  categories,
  activeSlug,
  searchQuery,
}: {
  categories: Category[];
  activeSlug?: string;
  searchQuery?: string;
}) {
  function href(slug?: string) {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (slug) params.set("category", slug);
    const query = params.toString();
    return query ? `/?${query}` : "/";
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link
        href={href()}
        className={cn(
          "rounded-full border px-4 py-1.5 text-sm font-medium transition",
          !activeSlug
            ? "border-brand bg-brand text-white"
            : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-brand/40",
        )}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={href(category.slug)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition",
            activeSlug === category.slug
              ? "border-brand bg-brand text-white"
              : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-brand/40",
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
