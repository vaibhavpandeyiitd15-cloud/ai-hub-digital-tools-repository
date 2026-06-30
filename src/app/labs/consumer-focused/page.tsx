import { HubCardGrid } from "@/components/labs/HubCardGrid";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  breadcrumbs,
  consumerSections,
  SITE_NAME,
} from "@/lib/content/desire-lab";

export const metadata = {
  title: `Consumer Focused Lab | ${SITE_NAME}`,
};

export default function ConsumerFocusedLabPage() {
  return (
    <div>
      <DesireLabHero
        eyebrow="Consumer Focused Lab"
        title="Consumer Focused Lab"
        subtitle="Insights, fragrance, and packaging tools for consumer-centric innovation."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs
          items={breadcrumbs({ label: "Consumer Focused Lab" })}
        />

        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand">
            Sections
          </h2>
          <p className="mt-2 text-[var(--text-secondary)]">
            Select a section to browse tools and capabilities.
          </p>
        </ScrollReveal>

        <div className="mt-8">
          <HubCardGrid
            items={consumerSections.map((section) => ({
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
