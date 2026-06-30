import { HubCardGrid } from "@/components/labs/HubCardGrid";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbs, scienceSections, SITE_NAME } from "@/lib/content/desire-lab";

export const metadata = {
  title: `Science Focused Lab | ${SITE_NAME}`,
};

export default function ScienceFocusedLabPage() {
  return (
    <div>
      <DesireLabHero
        eyebrow="Science Focused Lab"
        title="Science Focused Lab"
        subtitle="Explore, innovate, design, and measure impact across R&D."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs items={breadcrumbs({ label: "Science Focused Lab" })} />

        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand">
            Sections
          </h2>
          <p className="mt-2 text-[var(--text-secondary)]">
            Select a section to browse science tools and capabilities.
          </p>
        </ScrollReveal>

        <div className="mt-8">
          <HubCardGrid
            items={scienceSections.map((section) => ({
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
