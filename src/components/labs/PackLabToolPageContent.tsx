import Link from "next/link";
import { Mail } from "lucide-react";
import { ToolDetailActions } from "@/components/booking/ToolDetailActions";
import { StatusBadge } from "@/components/catalog/StatusBadge";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbs, PACKAGING_LAB_NAME } from "@/lib/content/desire-lab";
import type { PackLabToolDetail } from "@/lib/tools";

export function PackLabToolPageContent({ tool }: { tool: PackLabToolDetail }) {
  const hasToolUrl = Boolean(tool.toolUrl && tool.toolUrl !== "#");
  const sectionHref = `/labs/pack-lab/${tool.sectionSlug}`;

  return (
    <div className="relative">
      <div className="border-b border-brand/10 bg-gradient-to-r from-brand to-brand-light px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <LabBreadcrumbs
            variant="hero"
            items={breadcrumbs(
              { label: PACKAGING_LAB_NAME, href: "/labs/pack-lab" },
              { label: tool.sectionName, href: sectionHref },
              { label: tool.name },
            )}
          />
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <StatusBadge status={tool.status} />
            <Link
              href={sectionHref}
              className="rounded-full border border-white/30 bg-white/10 px-3 py-0.5 text-xs font-medium backdrop-blur-sm hover:bg-white/20"
            >
              {tool.sectionName} stage
            </Link>
          </div>
          <h1 className="font-[family-name:var(--font-barlow)] text-3xl font-bold sm:text-4xl">
            {tool.name}
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-white/85">{tool.purpose}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <ScrollReveal className="lg:col-span-2">
            <div className="prose prose-sm max-w-none">
              <h2 className="font-[family-name:var(--font-barlow)] text-xl font-semibold text-brand">
                About this tool
              </h2>
              <p className="mt-2 leading-relaxed text-[var(--text-primary)]">
                {tool.description}
              </p>
            </div>

            {tool.tags.length > 0 ? (
              <div className="mt-8">
                <h2 className="font-[family-name:var(--font-barlow)] text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  Tags
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--text-secondary)] ring-1 ring-[var(--border)] transition hover:ring-brand/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <p className="mt-8 text-xs text-[var(--text-secondary)]">
              Last updated:{" "}
              {tool.lastUpdated.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </ScrollReveal>

          <aside className="space-y-6">
            <ScrollReveal delay={120}>
              <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-md transition hover:shadow-lg">
                <h2 className="font-[family-name:var(--font-barlow)] text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  Point of Contact
                </h2>
                <p className="mt-3 font-[family-name:var(--font-barlow)] text-lg font-semibold">
                  {tool.pocName}
                </p>
                {tool.pocTeam ? (
                  <p className="text-sm text-[var(--text-secondary)]">{tool.pocTeam}</p>
                ) : null}
                <a
                  href={`mailto:${tool.pocEmail}`}
                  className="mt-2 flex items-center gap-2 text-sm text-brand hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {tool.pocEmail}
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-md">
                <h2 className="font-[family-name:var(--font-barlow)] text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  Training
                </h2>
                <a
                  href={tool.trainingMaterialsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex text-sm font-semibold text-brand hover:underline"
                >
                  Training material
                </a>
                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  Opens SharePoint with guides and resources for this tool.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={280}>
              <ToolDetailActions
                tool={{
                  name: tool.name,
                  toolUrl: tool.toolUrl,
                  hasToolUrl,
                  trainingMaterialsUrl: tool.trainingMaterialsUrl,
                }}
              />
            </ScrollReveal>
          </aside>
        </div>
      </div>
    </div>
  );
}
