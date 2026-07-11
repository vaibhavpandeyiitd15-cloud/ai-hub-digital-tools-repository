import type { PackSectionSlug } from "@/lib/content/desire-lab";

export type PackPhaseSlug = "explore" | "validate" | "execute";

export type PackStageGroup = {
  slug: PackPhaseSlug;
  name: string;
  description: string;
  color: string;
  stageSlugs: PackSectionSlug[];
};

export const PACK_PHASE_COLORS: Record<PackPhaseSlug, string> = {
  explore: "#00BFA5",
  validate: "#9C27B0",
  execute: "#1A73E8",
};

export const packStageGroups: PackStageGroup[] = [
  {
    slug: "explore",
    name: "Explore",
    description: "Consumer insight and rapid screening to shape packaging opportunities.",
    color: PACK_PHASE_COLORS.explore,
    stageSlugs: ["insight", "screening"],
  },
  {
    slug: "validate",
    name: "Validate",
    description: "Prototype and simulate packaging performance before commitment.",
    color: PACK_PHASE_COLORS.validate,
    stageSlugs: ["prototyping", "simulation"],
  },
  {
    slug: "execute",
    name: "Execute",
    description: "Capture lab data and author specifications for handoff.",
    color: PACK_PHASE_COLORS.execute,
    stageSlugs: ["data-capture", "specifications"],
  },
];

export function getPhaseSlugForSection(
  sectionSlug: PackSectionSlug,
): PackPhaseSlug | undefined {
  return packStageGroups.find((group) => group.stageSlugs.includes(sectionSlug))?.slug;
}

export function getPhaseColorForSection(sectionSlug: string): string | undefined {
  const phase = getPhaseSlugForSection(sectionSlug as PackSectionSlug);
  return phase ? PACK_PHASE_COLORS[phase] : undefined;
}

export const PACKAGING_LAB_BG_IMAGE = "/assets/packaging-lab-bg.jpg";

/** Light scrim — lower opacity = more visible lab photo */
export const PACKAGING_LAB_BG_OVERLAY_CLASS = "bg-white/35";

/** Phase surfaces: 25% transparency (75% opacity) */
export const PACK_PHASE_SURFACE_ALPHA = 0.75;

export function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
