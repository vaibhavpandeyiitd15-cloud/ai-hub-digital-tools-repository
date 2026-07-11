import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { LabToolList } from "@/components/labs/LabToolList";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbs, PACKAGING_LAB_NAME, SITE_NAME } from "@/lib/content/desire-lab";
import { getPackSectionTools } from "@/lib/tools";

export const metadata = {
  title: `Project workflow | ${PACKAGING_LAB_NAME} | ${SITE_NAME}`,
};

const workflowSteps = [
  {
    step: "1",
    title: "Define brief",
    description: "Capture packaging goals, constraints, and success criteria for the project.",
    sectionHref: "/labs/pack-lab/workflow",
  },
  {
    step: "2",
    title: "Insight & screening",
    description: "Gather consumer insight with Convotrack and Vurvey; screen concepts with Boltchat and PactInstant AI.",
    sectionHref: "/labs/pack-lab/insight",
  },
  {
    step: "3",
    title: "Prototype & simulate",
    description: "Build prototypes with Kaedim and validate performance in the 3DX FEA Simulator.",
    sectionHref: "/labs/pack-lab/prototyping",
  },
  {
    step: "4",
    title: "Capture & track",
    description: "Log experiments in ELN/LIMS and monitor progress on the project dashboard.",
    sectionHref: "/labs/pack-lab/data-capture",
  },
  {
    step: "5",
    title: "Review & handoff",
    description: "Complete milestones, document outcomes, and hand off to scale-up teams.",
    sectionHref: "/labs/pack-lab/workflow",
  },
];

export default async function PackLabWorkflowPage() {
  const workflowTools = await getPackSectionTools("workflow-dashboard");

  return (
    <div>
      <DesireLabHero
        eyebrow={PACKAGING_LAB_NAME}
        title="Packaging project workflow"
        subtitle="Create a new workflow and follow the end-to-end journey from brief to handoff."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs
          items={breadcrumbs(
            { label: PACKAGING_LAB_NAME, href: "/labs/pack-lab" },
            { label: "Project workflow" },
          )}
        />

        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand">
                Create a new workflow
              </h2>
              <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">
                Use this workflow to structure packaging innovation projects across Packaging Lab
                stages — from insight through prototyping, simulation, and delivery.
              </p>
            </div>
            <Link
              href="/labs/pack-lab"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {PACKAGING_LAB_NAME}
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {workflowSteps.map((item, index) => (
            <ScrollReveal key={item.step} delay={index * 60}>
              <article className="hub-card flex h-full flex-col gap-4 rounded-2xl p-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 font-[family-name:var(--font-barlow)] text-lg font-bold text-brand">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-barlow)] text-lg font-bold text-brand">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.description}</p>
                  </div>
                </div>
                {item.step === "2" || item.step === "3" || item.step === "4" ? (
                  <Link
                    href={item.sectionHref}
                    className="text-sm font-semibold text-brand hover:underline"
                  >
                    Browse {item.title} tools →
                  </Link>
                ) : null}
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={320}>
          <div className="mt-10">
            <div className="mb-6 flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-u-mint" aria-hidden />
              <h3 className="font-[family-name:var(--font-barlow)] text-xl font-bold text-brand">
                Workflow &amp; dashboard tools
              </h3>
            </div>
            <LabToolList tools={workflowTools} />
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
