import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { LabToolList } from "@/components/labs/LabToolList";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbs, fragranceToolSlugs, SITE_NAME } from "@/lib/content/desire-lab";
import { getToolsBySlugs, orderToolsBySlugs } from "@/lib/tools";

export const metadata = {
  title: `Fragrance | Consumer Focused Lab | ${SITE_NAME}`,
};

export default async function FragranceSectionPage() {
  const tools = orderToolsBySlugs(
    await getToolsBySlugs([...fragranceToolSlugs]),
    [...fragranceToolSlugs],
  );

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
          <h2 className="font-[family-name:var(--font-barlow)] text-xl font-semibold text-brand">
            Fragrance Library
          </h2>
        </ScrollReveal>

        <div className="mt-8">
          <LabToolList tools={tools} />
        </div>
      </section>
    </div>
  );
}
