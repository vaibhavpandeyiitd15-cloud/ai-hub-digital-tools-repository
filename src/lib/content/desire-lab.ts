export const SITE_NAME = "Desire Lab";

/** Shown in metadata and assistant context — both India hubs */
export const SITE_REGION = "Mumbai and Bangalore";

export type LabSlug = "consumer-focused" | "science-focused";

export type ConsumerSectionSlug = "insights" | "fragrance" | "packaging";

export type ScienceSectionSlug = "explore" | "innovate" | "design" | "impact";

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
    description: "Explore, innovate, design, and measure impact across R&D.",
    available: true,
    href: "/labs/science-focused",
  },
];

/** Insights pulls all active tools from these DB categories (legacy AI Hub + new). */
export const insightsCategorySlugs = [
  "consumer-market-insights",
  "consumer-insights-cmi",
] as const;

export const consumerSections: SectionCard[] = [
  {
    slug: "insights",
    name: "Insights",
    description: "Consumer and market intelligence — includes legacy AI Hub tools.",
    href: "/labs/consumer-focused/insights/consumer-market-insights",
    categorySlugs: [...insightsCategorySlugs],
  },
  {
    slug: "fragrance",
    name: "Fragrance",
    description: "Explore and manage the fragrance knowledge library.",
    href: "/labs/consumer-focused/fragrance",
    categorySlugs: ["fragrance"],
  },
  {
    slug: "packaging",
    name: "Packaging",
    description: "Pack exploration and image-to-model conversion workflows.",
    href: "/labs/consumer-focused/packaging",
    categorySlugs: ["packaging"],
  },
];

export const scienceSections: SectionCard[] = [
  {
    slug: "explore",
    name: "Explore",
    description: "PatBase, R&D Assistant, Data Lab, and journals & publications.",
    href: "/labs/science-focused/explore",
    categorySlugs: ["explore"],
  },
  {
    slug: "innovate",
    name: "Innovate",
    description: "Science innovation workflows — more tools coming soon.",
    href: "/labs/science-focused/innovate",
    categorySlugs: ["innovate"],
  },
  {
    slug: "design",
    name: "Design",
    description: "Science-led design capabilities — more tools coming soon.",
    href: "/labs/science-focused/design",
    categorySlugs: ["design"],
  },
  {
    slug: "impact",
    name: "Impact",
    description: "Measure and validate scientific impact — more tools coming soon.",
    href: "/labs/science-focused/impact",
    categorySlugs: ["impact"],
  },
];

export type BreadcrumbItem = { label: string; href?: string };

export function breadcrumbs(...items: BreadcrumbItem[]): BreadcrumbItem[] {
  return [{ label: SITE_NAME, href: "/" }, ...items];
}

export function getConsumerSection(slug: string): SectionCard | undefined {
  return consumerSections.find((s) => s.slug === slug);
}

export function getScienceSection(slug: string): SectionCard | undefined {
  return scienceSections.find((s) => s.slug === slug);
}

export function getLabPathForCategory(categorySlug: string): string {
  if (insightsCategorySlugs.includes(categorySlug as (typeof insightsCategorySlugs)[number])) {
    return "/labs/consumer-focused/insights/consumer-market-insights";
  }
  switch (categorySlug) {
    case "fragrance":
      return "/labs/consumer-focused/fragrance";
    case "packaging":
      return "/labs/consumer-focused/packaging";
    case "explore":
      return "/labs/science-focused/explore";
    case "innovate":
      return "/labs/science-focused/innovate";
    case "design":
      return "/labs/science-focused/design";
    case "impact":
      return "/labs/science-focused/impact";
    default:
      return "/labs/consumer-focused";
  }
}
