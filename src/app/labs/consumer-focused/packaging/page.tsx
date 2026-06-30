import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { LabToolList } from "@/components/labs/LabToolList";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbs, packagingToolSlugs, SITE_NAME } from "@/lib/content/desire-lab";
import { getToolsBySlugs, orderToolsBySlugs } from "@/lib/tools";

export const metadata = {
  title: `Packaging | Consumer Focused Lab | ${SITE_NAME}`,
};

export default async function PackagingSectionPage() {
  const tools = orderToolsBySlugs(
    await getToolsBySlugs([...packagingToolSlugs]),
    [...packagingToolSlugs],
  );

  return (
    <div>
      <DesireLabHero
        eyebrow="Consumer Focused Lab · Packaging"
        title="Packaging"
        subtitle="Pack exploration and image-to-model conversion for packaging innovation."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs
          items={breadcrumbs(
            { label: "Consumer Focused Lab", href: "/labs/consumer-focused" },
            { label: "Packaging" },
          )}
        />

        <ScrollReveal>
          <p className="mb-8 text-sm text-[var(--text-secondary)]">
            Pack Explorer and Image to Model Conversion tools
          </p>
        </ScrollReveal>

        <LabToolList tools={tools} />
      </section>
    </div>
  );
}
