import { notFound } from "next/navigation";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { LabToolList } from "@/components/labs/LabToolList";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  breadcrumbs,
  getPackSection,
  SITE_NAME,
  type PackSectionSlug,
} from "@/lib/content/desire-lab";
import { getPackSectionTools } from "@/lib/tools";

type PageProps = {
  params: Promise<{ section: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { section } = await params;
  const config = getPackSection(section);
  return {
    title: config
      ? `${config.name} | Pack Lab | ${SITE_NAME}`
      : `Pack Lab | ${SITE_NAME}`,
  };
}

export default async function PackSectionPage({ params }: PageProps) {
  const { section } = await params;
  const config = getPackSection(section);
  if (!config) notFound();

  const tools = await getPackSectionTools(section as PackSectionSlug);

  return (
    <div>
      <DesireLabHero
        eyebrow="Pack Lab"
        title={config.name}
        subtitle={config.description}
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs
          items={breadcrumbs(
            { label: "Pack Lab", href: "/labs/pack-lab" },
            { label: config.name },
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
