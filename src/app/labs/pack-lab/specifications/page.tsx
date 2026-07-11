import { ExternalLink } from "lucide-react";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  breadcrumbs,
  SITE_NAME,
} from "@/lib/content/desire-lab";
import {
  ACTIVE_WORKSPACE_URL,
  packSpecificationsContent,
} from "@/lib/content/pack-specifications";

export const metadata = {
  title: `Specifications | Pack Lab | ${SITE_NAME}`,
};

export default function PackSpecificationsPage() {
  const { title, description, message, ctaLabel } = packSpecificationsContent;
  const hasWorkspaceUrl = Boolean(ACTIVE_WORKSPACE_URL);

  return (
    <div>
      <DesireLabHero eyebrow="Pack Lab" title={title} subtitle={description} />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs
          items={breadcrumbs(
            { label: "Pack Lab", href: "/labs/pack-lab" },
            { label: title },
          )}
        />

        <ScrollReveal>
          <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-sm sm:p-10">
            <p className="text-lg leading-relaxed text-[var(--text-primary)]">{message}</p>
            {hasWorkspaceUrl ? (
              <>
                <a
                  href={ACTIVE_WORKSPACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-light"
                >
                  {ctaLabel}
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="mt-4 text-xs text-[var(--text-secondary)]">
                  You will be redirected to Active Workspace in a new tab.
                </p>
              </>
            ) : (
              <p className="mt-6 text-sm text-[var(--text-secondary)]">
                Active Workspace link is not configured yet. Contact the Desire Lab team for
                access.
              </p>
            )}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
