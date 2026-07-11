import { HubCardGrid } from "@/components/labs/HubCardGrid";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbs, packLabBrowseSections, SITE_NAME } from "@/lib/content/desire-lab";

export const metadata = {
  title: `Pack Lab | ${SITE_NAME}`,
};

export default function PackLabPage() {
  return (
    <div>
      <DesireLabHero
        eyebrow="Pack Lab"
        title="Pack Lab"
        subtitle="Packaging innovation — insight, screening, prototyping, simulation, and data capture."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs items={breadcrumbs({ label: "Pack Lab" })} />

        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand">
            Sections
          </h2>
          <p className="mt-2 text-[var(--text-secondary)]">
            Select a section to browse packaging tools and capabilities.
          </p>
        </ScrollReveal>

        <div className="mt-8">
          <HubCardGrid
            items={packLabBrowseSections.map((section) => ({
              title: section.name,
              description: section.description,
              href: section.href,
              available: true,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
