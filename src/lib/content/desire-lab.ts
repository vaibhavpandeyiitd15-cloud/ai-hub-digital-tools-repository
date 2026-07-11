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
  | "specifications"
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
  toolSlugs?: string[];
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
    toolSlugs: ["convotrack", "vurvey"],
  },
  {
    slug: "screening",
    name: "Screening",
    description: "Rapid screening and evaluation — Boltchat and PactInstant AI.",
    href: "/labs/pack-lab/screening",
    categorySlugs: ["pack-screening"],
    toolSlugs: ["boltchat-ai", "pactinstant-ai"],
  },
  {
    slug: "prototyping",
    name: "Prototyping",
    description: "3D prototyping and model generation — Kaedim.",
    href: "/labs/pack-lab/prototyping",
    categorySlugs: ["pack-prototyping"],
    toolSlugs: ["kaedim"],
  },
  {
    slug: "simulation",
    name: "Simulation",
    description: "Structural and performance simulation — 3DX FEA simulator.",
    href: "/labs/pack-lab/simulation",
    categorySlugs: ["pack-simulation"],
    toolSlugs: ["3dx-fea-simulator"],
  },
  {
    slug: "data-capture",
    name: "Data capture",
    description: "Electronic lab records and sample management — ELN and LIMS.",
    href: "/labs/pack-lab/data-capture",
    categorySlugs: ["pack-data-capture"],
    toolSlugs: ["eln", "lims"],
  },
  {
    slug: "specifications",
    name: "Specifications",
    description: "Access Active Workspace to write your packaging specification.",
    href: "/labs/pack-lab/specifications",
    categorySlugs: ["pack-specifications"],
  },
  {
    slug: "workflow-dashboard",
    name: "Workflow & dashboard",
    description: "Packaging project management workflow and team dashboards.",
    href: "/labs/pack-lab/workflow-dashboard",
    categorySlugs: ["pack-workflow-dashboard"],
    toolSlugs: ["packaging-project-workflow"],
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

export function getLabPathForToolSlug(toolSlug: string): string {
  if (toolSlug === "packaging-project-workflow") {
    return PACK_LAB_WORKFLOW_HREF;
  }
  const section = packSections.find((item) => item.toolSlugs?.includes(toolSlug));
  if (section) return `/labs/pack-lab/${section.slug}/${toolSlug}`;
  return `/tools/${toolSlug}`;
}

/** Sections shown on the Pack Lab hub (workflow is via Start a new project) */
export const packLabBrowseSections = packSections.filter(
  (section) => section.slug !== "workflow-dashboard",
);
