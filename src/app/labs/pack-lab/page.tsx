import { PackLabStageGroups } from "@/components/labs/PackLabStageGroups";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbs, PACKAGING_LAB_NAME, SITE_NAME } from "@/lib/content/desire-lab";
import { PACKAGING_LAB_BG_IMAGE, PACKAGING_LAB_BG_OVERLAY_CLASS } from "@/lib/content/pack-lab-stages";

export const metadata = {
  title: `${PACKAGING_LAB_NAME} | ${SITE_NAME}`,
};

export default function PackLabPage() {
  return (
    <div>
      <DesireLabHero
        eyebrow={PACKAGING_LAB_NAME}
        title={PACKAGING_LAB_NAME}
        subtitle="Packaging innovation — explore, validate, and execute across insight, screening, prototyping, simulation, and data capture."
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
          <LabBreadcrumbs items={breadcrumbs({ label: PACKAGING_LAB_NAME })} />

          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand">
              Phases
            </h2>
            <p className="mt-2 text-[var(--text-secondary)]">
              Expand each phase to browse packaging tools and capabilities by stage.
            </p>
          </ScrollReveal>

          <div className="mt-8">
            <PackLabStageGroups />
          </div>
        </div>
      </section>
    </div>
  );
}
