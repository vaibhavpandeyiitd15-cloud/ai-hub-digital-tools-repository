import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { LabToolList } from "@/components/labs/LabToolList";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbs, SITE_NAME } from "@/lib/content/desire-lab";
import { getToolsByCategorySlugs } from "@/lib/tools";

export const metadata = {
  title: `Fragrance | Consumer Focused Lab | ${SITE_NAME}`,
};

export default async function FragranceSectionPage() {
  const tools = await getToolsByCategorySlugs(["fragrance"]);

  return (
    <div>
      <DesireLabHero
        eyebrow="Consumer Focused Lab · Fragrance"
        title="Fragrance"
        subtitle="Explore the fragrance knowledge library and related capabilities."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs
          items={breadcrumbs(
            { label: "Consumer Focused Lab", href: "/labs/consumer-focused" },
            { label: "Fragrance" },
          )}
        />

        <ScrollReveal>
          <p className="mb-8 text-sm text-[var(--text-secondary)]">
            {tools.length} tool{tools.length === 1 ? "" : "s"}
          </p>
        </ScrollReveal>

        <LabToolList tools={tools} />
      </section>
    </div>
  );
}
