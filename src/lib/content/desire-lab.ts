export const SITE_NAME = "Desire Lab";

/** Shown in metadata and assistant context — both India hubs */
export const SITE_REGION = "Mumbai and Bangalore";

export type LabSlug = "pack-lab" | "formulation-lab";

export type PackSectionSlug =
  | "insight"
  | "screening"
  | "prototyping"
  | "simulation"
  | "data-capture"
  | "workflow-dashboard";

export type LabBranch = {
  slug: LabSlug;
  name: string;
  description: string;
  available: boolean;
  href: string;
};

export type SectionCard = {
  slug: string;
  name: string;
  description: string;
  href: string;
  categorySlugs?: string[];
};

export const PACK_LAB_WORKFLOW_HREF = "/labs/pack-lab/workflow";

export const labBranches: LabBranch[] = [
  {
    slug: "pack-lab",
    name: "Pack Lab",
    description:
      "Packaging innovation — from consumer insight and screening through prototyping, simulation, and project workflow.",
    available: true,
    href: "/labs/pack-lab",
  },
  {
    slug: "formulation-lab",
    name: "Formulation Lab",
    description: "Formulation R&D tools and workflows — coming soon.",
    available: false,
    href: "/labs/formulation-lab",
  },
];

export const packSections: SectionCard[] = [
  {
    slug: "insight",
    name: "Insight",
    description: "Consumer and packaging intelligence — Convotrack and Vurvey.",
    href: "/labs/pack-lab/insight",
    categorySlugs: ["pack-insight"],
  },
  {
    slug: "screening",
    name: "Screening",
    description: "Rapid screening and evaluation — Boltchat and PactInstant AI.",
    href: "/labs/pack-lab/screening",
    categorySlugs: ["pack-screening"],
  },
  {
    slug: "prototyping",
    name: "Prototyping",
    description: "3D prototyping and model generation — Kaedim.",
    href: "/labs/pack-lab/prototyping",
    categorySlugs: ["pack-prototyping"],
  },
  {
    slug: "simulation",
    name: "Simulation",
    description: "Structural and performance simulation — 3DX FEA simulator.",
    href: "/labs/pack-lab/simulation",
    categorySlugs: ["pack-simulation"],
  },
  {
    slug: "data-capture",
    name: "Data capture",
    description: "Electronic lab records and sample management — ELN and LIMS.",
    href: "/labs/pack-lab/data-capture",
    categorySlugs: ["pack-data-capture"],
  },
  {
    slug: "workflow-dashboard",
    name: "Workflow & dashboard",
    description: "Packaging project management workflow and team dashboards.",
    href: "/labs/pack-lab/workflow-dashboard",
    categorySlugs: ["pack-workflow-dashboard"],
  },
];

export type BreadcrumbItem = { label: string; href?: string };

export function breadcrumbs(...items: BreadcrumbItem[]): BreadcrumbItem[] {
  return [{ label: SITE_NAME, href: "/" }, ...items];
}

export function getPackSection(slug: string): SectionCard | undefined {
  return packSections.find((s) => s.slug === slug);
}

export function getLabPathForCategory(categorySlug: string): string {
  const packSection = packSections.find((section) =>
    section.categorySlugs?.includes(categorySlug),
  );
  if (packSection) return packSection.href;
  return "/labs/pack-lab";
}
