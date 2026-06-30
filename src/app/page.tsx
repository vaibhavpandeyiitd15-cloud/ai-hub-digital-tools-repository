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
      <DesireLabHero />

      <section className="mx-auto max-w-7xl px-6 py-14">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand">
            Choose your lab
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">
            Desire Lab organises digital tools into two major branches. Start with
            Consumer Focused Lab for insights, fragrance, and packaging.
          </p>
        </ScrollReveal>

        <div className="mt-10">
          <HubCardGrid
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
