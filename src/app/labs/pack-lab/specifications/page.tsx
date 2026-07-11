import { ExternalLink } from "lucide-react";
import { LabBreadcrumbs } from "@/components/labs/LabBreadcrumbs";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  breadcrumbs,
  PACKAGING_LAB_NAME,
  SITE_NAME,
} from "@/lib/content/desire-lab";
import { PACK_PHASE_COLORS, PACKAGING_LAB_BG_IMAGE, PACKAGING_LAB_BG_OVERLAY_CLASS } from "@/lib/content/pack-lab-stages";
import {
  ACTIVE_WORKSPACE_URL,
  packSpecificationsContent,
} from "@/lib/content/pack-specifications";

export const metadata = {
  title: `Specifications | ${PACKAGING_LAB_NAME} | ${SITE_NAME}`,
};

export default function PackSpecificationsPage() {
  const { title, description, message, ctaLabel } = packSpecificationsContent;
  const hasWorkspaceUrl = Boolean(ACTIVE_WORKSPACE_URL);
  const phaseColor = PACK_PHASE_COLORS.execute;

  return (
    <div>
      <DesireLabHero eyebrow={PACKAGING_LAB_NAME} title={title} subtitle={description} />

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

        <div className="relative mx-auto max-w-7xl px-6 py-12">
        <LabBreadcrumbs
          items={breadcrumbs(
            { label: PACKAGING_LAB_NAME, href: "/labs/pack-lab" },
            { label: title },
          )}
        />

        <ScrollReveal>
          <div
            className="mx-auto max-w-2xl rounded-2xl border bg-white/95 p-8 text-center shadow-sm backdrop-blur-sm sm:p-10"
            style={{ borderColor: `${phaseColor}40`, borderTopWidth: 3, borderTopColor: phaseColor }}
          >
            <p className="text-lg leading-relaxed text-[var(--text-primary)]">{message}</p>
            {hasWorkspaceUrl ? (
              <>
                <a
                  href={ACTIVE_WORKSPACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: phaseColor }}
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
        </div>
      </section>
    </div>
  );
}
