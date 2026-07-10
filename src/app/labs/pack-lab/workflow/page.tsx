import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbs, SITE_NAME } from "@/lib/content/desire-lab";

export const metadata = {
  title: `Project workflow | Pack Lab | ${SITE_NAME}`,
};

const workflowSteps = [
  {
    step: "1",
    title: "Define brief",
    description: "Capture packaging goals, constraints, and success criteria for the project.",
  },
  {
    step: "2",
    title: "Insight & screening",
    description: "Gather consumer insight and run early screening with Pack Lab tools.",
  },
  {
    step: "3",
    title: "Prototype & simulate",
    description: "Build prototypes with Kaedim and validate performance in simulation.",
  },
  {
    step: "4",
    title: "Capture & track",
    description: "Log experiments in ELN/LIMS and monitor progress on the project dashboard.",
  },
  {
    step: "5",
    title: "Review & handoff",
    description: "Complete milestones, document outcomes, and hand off to scale-up teams.",
  },
];

export default function PackLabWorkflowPage() {
  return (
    <div>
      <DesireLabHero
        eyebrow="Pack Lab"
        title="Packaging project workflow"
        subtitle="Start a new packaging project and follow the end-to-end workflow from brief to handoff."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs
          items={breadcrumbs(
            { label: "Pack Lab", href: "/labs/pack-lab" },
            { label: "Project workflow" },
          )}
        />

        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand">
                Start a new project
              </h2>
              <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">
                Use this workflow to structure packaging innovation projects across Pack Lab
                sections — from insight through prototyping, simulation, and delivery.
              </p>
            </div>
            <Link
              href="/labs/pack-lab"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Pack Lab
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {workflowSteps.map((item, index) => (
            <ScrollReveal key={item.step} delay={index * 60}>
              <article className="hub-card flex h-full gap-4 rounded-2xl p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 font-[family-name:var(--font-barlow)] text-lg font-bold text-brand">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-barlow)] text-lg font-bold text-brand">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.description}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={320}>
          <div className="mt-10 rounded-2xl border border-dashed border-[var(--border)] bg-white/80 px-6 py-8 text-center">
            <ClipboardList className="mx-auto h-8 w-8 text-u-mint" aria-hidden />
            <p className="mt-4 font-medium text-brand">Project dashboard integration</p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--text-secondary)]">
              Full project management and dashboard tooling will connect here. Browse{" "}
              <Link href="/labs/pack-lab/workflow-dashboard" className="text-brand hover:underline">
                Workflow &amp; dashboard
              </Link>{" "}
              for related tools.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
