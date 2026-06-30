import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { LabToolList } from "@/components/labs/LabToolList";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  breadcrumbs,
  insightsCategorySlugs,
  SITE_NAME,
} from "@/lib/content/desire-lab";
import { getToolsByCategorySlugs } from "@/lib/tools";

export const metadata = {
  title: `Insights | Consumer Focused Lab | ${SITE_NAME}`,
};

export default async function InsightsToolsPage() {
  const tools = await getToolsByCategorySlugs([...insightsCategorySlugs]);

  return (
    <div>
      <DesireLabHero
        eyebrow="Consumer Focused Lab"
        title="Insights"
        subtitle="Consumer and market intelligence tools — including legacy AI Hub catalog entries you can manage in the CMS."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs
          items={breadcrumbs(
            { label: "Consumer Focused Lab", href: "/labs/consumer-focused" },
            { label: "Insights" },
          )}
        />

        <ScrollReveal>
          <p className="mb-2 text-sm text-[var(--text-secondary)]">
            {tools.length} active tool{tools.length === 1 ? "" : "s"} · Deprecate or
            edit any tool in{" "}
            <a href="/admin/tools" className="font-medium text-brand hover:underline">
              Desire Lab CMS
            </a>
          </p>
        </ScrollReveal>

        <div className="mt-6">
          <LabToolList tools={tools} />
        </div>
      </section>
    </div>
  );
}
