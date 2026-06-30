import Link from "next/link";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbs, SITE_NAME } from "@/lib/content/desire-lab";

export const metadata = {
  title: `Science Focused Lab | ${SITE_NAME}`,
};

export default function ScienceFocusedLabPage() {
  return (
    <div>
      <DesireLabHero
        eyebrow="Coming soon"
        title="Science Focused Lab"
        subtitle="Formulation and science tools will be available in the next release."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs items={breadcrumbs({ label: "Science Focused Lab" })} />

        <ScrollReveal>
          <div className="mx-auto max-w-lg rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-sm">
            <p className="font-[family-name:var(--font-barlow)] text-lg font-semibold text-brand">
              Under development
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              The Science Focused Lab branch is planned after Consumer Focused Lab.
              Check back soon or explore the consumer tools in the meantime.
            </p>
            <Link href="/labs/consumer-focused" className="btn-primary mt-6 inline-flex">
              Go to Consumer Focused Lab
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
