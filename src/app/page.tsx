import { HubCardGrid } from "@/components/labs/HubCardGrid";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { labBranches, SITE_NAME } from "@/lib/content/desire-lab";

export const metadata = {
  title: `${SITE_NAME} | Unilever`,
  description:
    "Desire Lab — Consumer Focused and Science Focused innovation tool branches at Unilever.",
};

export default function HomePage() {
  return (
    <div>
      <DesireLabHero
        compact
        subtitle="Choose a lab to explore innovation tools."
      />

      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
        <ScrollReveal>
          <h2 className="text-center font-[family-name:var(--font-barlow)] text-xl font-bold text-brand sm:text-2xl">
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
