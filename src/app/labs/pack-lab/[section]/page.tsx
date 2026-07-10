import { notFound } from "next/navigation";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { LabToolList } from "@/components/labs/LabToolList";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  breadcrumbs,
  getPackSection,
  SITE_NAME,
} from "@/lib/content/desire-lab";
import { getToolsByCategorySlugs } from "@/lib/tools";

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

  const tools = config.categorySlugs
    ? await getToolsByCategorySlugs(config.categorySlugs)
    : [];

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
          {tools.length > 0 ? (
            <p className="mb-8 text-sm text-[var(--text-secondary)]">
              {tools.length} tool{tools.length === 1 ? "" : "s"}
            </p>
          ) : (
            <div className="mb-8 rounded-xl border border-dashed border-[var(--border)] bg-white px-6 py-8 text-center">
              <p className="font-medium text-brand">More tools coming soon</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                This section is ready — add tools via{" "}
                <a href="/admin/tools" className="text-brand hover:underline">
                  Desire Lab CMS
                </a>
                .
              </p>
            </div>
          )}
        </ScrollReveal>

        <LabToolList tools={tools} />
      </section>
    </div>
  );
}
