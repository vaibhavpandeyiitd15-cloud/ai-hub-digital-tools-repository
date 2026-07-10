import { HubCardGrid } from "@/components/labs/HubCardGrid";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbs, SITE_NAME } from "@/lib/content/desire-lab";

export const metadata = {
  title: `Formulation Lab | ${SITE_NAME}`,
};

export default function FormulationLabPage() {
  return (
    <div>
      <DesireLabHero
        eyebrow="Formulation Lab"
        title="Formulation Lab"
        subtitle="Formulation R&D tools and workflows — coming soon."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs items={breadcrumbs({ label: "Formulation Lab" })} />

        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand">
            Coming soon
          </h2>
          <p className="mt-2 text-[var(--text-secondary)]">
            Formulation Lab sections and tools are being prepared. Pack Lab is available now.
          </p>
        </ScrollReveal>

        <div className="mt-8">
          <HubCardGrid
            items={[
              {
                title: "Formulation workflows",
                description: "R&D formulation tools and capabilities — in development.",
                href: "/labs/formulation-lab",
                available: false,
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
