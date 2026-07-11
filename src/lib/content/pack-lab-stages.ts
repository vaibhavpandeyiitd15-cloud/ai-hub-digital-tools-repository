import type { PackSectionSlug } from "@/lib/content/desire-lab";

export type PackStageGroup = {
  slug: string;
  name: string;
  description: string;
  stageSlugs: PackSectionSlug[];
};

export const packStageGroups: PackStageGroup[] = [
  {
    slug: "explore",
    name: "Explore",
    description: "Consumer insight and rapid screening to shape packaging opportunities.",
    stageSlugs: ["insight", "screening"],
  },
  {
    slug: "validate",
    name: "Validate",
    description: "Prototype and simulate packaging performance before commitment.",
    stageSlugs: ["prototyping", "simulation"],
  },
  {
    slug: "execute",
    name: "Execute",
    description: "Capture lab data and author specifications for handoff.",
    stageSlugs: ["data-capture", "specifications"],
  },
];
