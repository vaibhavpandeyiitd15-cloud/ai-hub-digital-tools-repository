import { notFound } from "next/navigation";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { LabToolList } from "@/components/labs/LabToolList";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbs, getInsightsSubsection, SITE_NAME } from "@/lib/content/desire-lab";
import { getToolsBySlugs, orderToolsBySlugs } from "@/lib/tools";

type PageProps = {
  params: Promise<{ subsection: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { subsection } = await params;
  const config = getInsightsSubsection(subsection);
  return {
    title: config
      ? `${config.name} | ${SITE_NAME}`
      : `Insights | ${SITE_NAME}`,
  };
}

export default async function InsightsSubsectionPage({ params }: PageProps) {
  const { subsection } = await params;
  const config = getInsightsSubsection(subsection);
  if (!config) notFound();

  const tools = orderToolsBySlugs(
    await getToolsBySlugs(config.toolSlugs),
    config.toolSlugs,
  );

  return (
    <div>
      <DesireLabHero
        eyebrow="Insights"
        title={config.name}
        subtitle={config.description}
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs
          items={breadcrumbs(
            { label: "Consumer Focused Lab", href: "/labs/consumer-focused" },
            { label: "Insights", href: "/labs/consumer-focused/insights" },
            { label: config.name },
          )}
        />

        <ScrollReveal>
          <p className="mb-8 text-sm text-[var(--text-secondary)]">
            {tools.length} tool{tools.length === 1 ? "" : "s"} in this area
          </p>
        </ScrollReveal>

        <LabToolList tools={tools} />
      </section>
    </div>
  );
}
