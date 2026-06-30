import { HubCardGrid } from "@/components/labs/HubCardGrid";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { labBranches, SITE_NAME, SITE_REGION } from "@/lib/content/desire-lab";

export const metadata = {
  title: `${SITE_NAME} | Unilever`,
  description:
    `Desire Lab — Consumer Focused and Science Focused innovation tools for Unilever teams in ${SITE_REGION}.`,
};

export default function HomePage() {
  return (
    <div>
      <DesireLabHero
        compact
        largeTitle
        subtitle="Choose a lab to explore innovation tools."
      />

      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
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
      </section>
    </div>
  );
}
