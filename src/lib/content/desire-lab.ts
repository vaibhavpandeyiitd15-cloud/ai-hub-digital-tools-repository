export const SITE_NAME = "Desire Lab";

export type LabSlug = "consumer-focused" | "science-focused";

export type ConsumerSectionSlug = "insights" | "fragrance" | "packaging";

export type LabBranch = {
  slug: LabSlug;
  name: string;
  description: string;
  available: boolean;
  href: string;
};

export type SectionCard = {
  slug: ConsumerSectionSlug;
  name: string;
  description: string;
  href: string;
};

export type SubsectionCard = {
  slug: string;
  name: string;
  description: string;
  href: string;
  toolSlugs: string[];
};

export const labBranches: LabBranch[] = [
  {
    slug: "consumer-focused",
    name: "Consumer Focused Lab",
    description:
      "Insights, fragrance, and packaging tools for consumer-centric innovation.",
    available: true,
    href: "/labs/consumer-focused",
  },
  {
    slug: "science-focused",
    name: "Science Focused Lab",
    description: "Formulation and science tools — coming in the next release.",
    available: false,
    href: "/labs/science-focused",
  },
];

export const consumerSections: SectionCard[] = [
  {
    slug: "insights",
    name: "Insights",
    description: "Consumer and market intelligence for concept development.",
    href: "/labs/consumer-focused/insights",
  },
  {
    slug: "fragrance",
    name: "Fragrance",
    description: "Explore and manage the fragrance knowledge library.",
    href: "/labs/consumer-focused/fragrance",
  },
  {
    slug: "packaging",
    name: "Packaging",
    description: "Pack exploration and image-to-model conversion workflows.",
    href: "/labs/consumer-focused/packaging",
  },
];

export const insightsSubsections: SubsectionCard[] = [
  {
    slug: "consumer-market-insights",
    name: "Consumer and Market Insights",
    description:
      "AI-assisted concept development and social trend intelligence.",
    href: "/labs/consumer-focused/insights/consumer-market-insights",
    toolSlugs: ["concept-gpt", "trends-by-social-intelligence"],
  },
];

export const fragranceToolSlugs = ["fragrance-library"] as const;

export const packagingToolSlugs = [
  "pack-explorer",
  "image-to-model-conversion",
] as const;

export const consumerToolSlugs = [
  ...insightsSubsections.flatMap((s) => s.toolSlugs),
  ...fragranceToolSlugs,
  ...packagingToolSlugs,
] as const;

export type BreadcrumbItem = { label: string; href?: string };

export function breadcrumbs(...items: BreadcrumbItem[]): BreadcrumbItem[] {
  return [{ label: SITE_NAME, href: "/" }, ...items];
}

export function getSectionBySlug(slug: ConsumerSectionSlug): SectionCard | undefined {
  return consumerSections.find((s) => s.slug === slug);
}

export function getInsightsSubsection(slug: string): SubsectionCard | undefined {
  return insightsSubsections.find((s) => s.slug === slug);
}

export function getLabPathForCategory(categorySlug: string): string {
  switch (categorySlug) {
    case "consumer-market-insights":
      return "/labs/consumer-focused/insights/consumer-market-insights";
    case "fragrance":
      return "/labs/consumer-focused/fragrance";
    case "packaging":
      return "/labs/consumer-focused/packaging";
    default:
      return "/labs/consumer-focused";
  }
}
