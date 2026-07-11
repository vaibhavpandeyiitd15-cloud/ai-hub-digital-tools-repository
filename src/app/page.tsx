import { HubCardGrid } from "@/components/labs/HubCardGrid";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { labBranches, PACKAGING_LAB_NAME, SITE_NAME, SITE_REGION } from "@/lib/content/desire-lab";
import { PACKAGING_LAB_BG_IMAGE, PACKAGING_LAB_BG_OVERLAY_CLASS } from "@/lib/content/pack-lab-stages";

export const metadata = {
  title: `${SITE_NAME} | Unilever`,
  description:
    `Desire Lab — ${PACKAGING_LAB_NAME} and Formulation Lab innovation tools for Unilever teams in ${SITE_REGION}.`,
};

export default function HomePage() {
  return (
    <div>
      <DesireLabHero
        compact
        largeTitle
        subtitle="Choose a lab to explore innovation tools."
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

        <div className="relative mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <ScrollReveal>
          <p className="text-center text-sm font-medium uppercase tracking-widest text-u-mint">
            Every U does good
          </p>
          <h2 className="mt-2 text-center font-[family-name:var(--font-barlow)] text-xl font-bold text-brand sm:text-2xl">
            Choose your lab
          </h2>
        </ScrollReveal>

        <div className="mt-8">
          <HubCardGrid
            featured
            centered
            items={labBranches.map((lab) => ({
              title: lab.name,
              description: lab.description,
              href: lab.href,
              available: lab.available,
              badge: lab.available ? "Available" : undefined,
            }))}
          />
        </div>
        </div>
      </section>
    </div>
  );
}
