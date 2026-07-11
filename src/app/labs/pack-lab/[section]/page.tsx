import { notFound, redirect } from "next/navigation";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { LabToolList } from "@/components/labs/LabToolList";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { PackagingLabIntroBlock } from "@/components/labs/PackagingLabIntroBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbs, getPackSection, PACKAGING_LAB_NAME, SITE_NAME, type PackSectionSlug } from "@/lib/content/desire-lab";
import { getPhaseColorForSection, PACKAGING_LAB_BG_IMAGE, PACKAGING_LAB_BG_OVERLAY_CLASS } from "@/lib/content/pack-lab-stages";
import { getPackSectionTools } from "@/lib/tools";

type PageProps = {
  params: Promise<{ section: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { section } = await params;
  const config = getPackSection(section);
  return {
    title: config
      ? `${config.name} | ${PACKAGING_LAB_NAME} | ${SITE_NAME}`
      : `${PACKAGING_LAB_NAME} | ${SITE_NAME}`,
  };
}

export default async function PackSectionPage({ params }: PageProps) {
  const { section } = await params;
  if (section === "workflow-dashboard") {
    redirect("/labs/pack-lab/workflow");
  }
  if (section === "specifications") {
    redirect("/labs/pack-lab/specifications");
  }
  const config = getPackSection(section);
  if (!config) notFound();

  const tools = await getPackSectionTools(section as PackSectionSlug);
  const phaseColor = getPhaseColorForSection(section);

  return (
    <div>
      <DesireLabHero
        eyebrow={PACKAGING_LAB_NAME}
        title={config.name}
        subtitle={config.description}
      />

      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${PACKAGING_LAB_BG_IMAGE})` }}
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute inset-0 ${PACKAGING_LAB_BG_OVERLAY_CLASS}`}
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <div className="mb-6 rounded-lg bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
            <LabBreadcrumbs
              items={breadcrumbs(
                { label: PACKAGING_LAB_NAME, href: "/labs/pack-lab" },
                { label: config.name },
              )}
            />
          </div>

        <ScrollReveal>
          <PackagingLabIntroBlock accentColor={phaseColor}>
            <span
              className="mb-1 block text-xs font-bold uppercase tracking-wide"
              style={phaseColor ? { color: phaseColor } : undefined}
            >
              Stage · {config.name}
            </span>
            {config.description}
            <span className="mt-2 block text-sm text-[#334e68]">
              {tools.length} tool{tools.length === 1 ? "" : "s"} available in this stage.
            </span>
          </PackagingLabIntroBlock>
        </ScrollReveal>

        <div className="mt-8">
          <LabToolList tools={tools} accentColor={phaseColor} />
        </div>
        </div>
      </section>
    </div>
  );
}
