import { HubCardGrid } from "@/components/labs/HubCardGrid";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbs, insightsSubsections, SITE_NAME } from "@/lib/content/desire-lab";

export const metadata = {
  title: `Insights | Consumer Focused Lab | ${SITE_NAME}`,
};

export default function InsightsSectionPage() {
  return (
    <div>
      <DesireLabHero
        eyebrow="Consumer Focused Lab · Insights"
        title="Insights"
        subtitle="Consumer and market intelligence for concept development and trend tracking."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs
          items={breadcrumbs(
            { label: "Consumer Focused Lab", href: "/labs/consumer-focused" },
            { label: "Insights" },
          )}
        />

        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand">
            Insight areas
          </h2>
        </ScrollReveal>

        <div className="mt-8">
          <HubCardGrid
            items={insightsSubsections.map((sub) => ({
              title: sub.name,
              description: sub.description,
              href: sub.href,
              available: true,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
