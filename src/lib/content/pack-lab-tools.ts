import type { PackSectionSlug } from "@/lib/content/desire-lab";

export type PackLabToolDefinition = {
  slug: string;
  sectionSlug: PackSectionSlug;
  name: string;
  purpose: string;
  description: string;
  tags: string[];
  pocName?: string;
  pocEmail?: string;
};

export const packLabToolDefinitions: PackLabToolDefinition[] = [
  {
    slug: "convotrack",
    sectionSlug: "insight",
    name: "Convotrack",
    purpose: "Track and analyze consumer conversations",
    description:
      "Convotrack monitors and analyzes consumer conversations to surface trends and actionable packaging insights for early-stage pack decisions.",
    tags: ["insight", "conversations", "consumer"],
  },
  {
    slug: "vurvey",
    sectionSlug: "insight",
    name: "Vurvey",
    purpose: "Video-based consumer research and insight platform",
    description:
      "Vurvey captures and analyzes video-based consumer feedback to inform packaging design, messaging, and shelf appeal.",
    tags: ["insight", "video", "consumer", "research"],
  },
  {
    slug: "boltchat-ai",
    sectionSlug: "screening",
    name: "Boltchat",
    purpose: "AI-powered conversational screening platform",
    description:
      "Boltchat enables rapid screening and AI-assisted evaluation of packaging concepts, claims, and creative directions.",
    tags: ["screening", "ai", "conversational"],
  },
  {
    slug: "pactinstant-ai",
    sectionSlug: "screening",
    name: "PactInstant AI",
    purpose: "Instant AI-assisted packaging screening",
    description:
      "PactInstant AI accelerates early packaging screening with instant AI-driven analysis, comparisons, and recommendations.",
    tags: ["screening", "ai", "packaging"],
  },
  {
    slug: "kaedim",
    sectionSlug: "prototyping",
    name: "Kaedim",
    purpose: "AI-powered 3D model generation from images",
    description:
      "Kaedim transforms packaging reference images into production-ready 3D models for rapid prototyping and design iteration.",
    tags: ["prototyping", "3d", "ai", "packaging"],
  },
  {
    slug: "3dx-fea-simulator",
    sectionSlug: "simulation",
    name: "3DX FEA Simulator",
    purpose: "Finite element analysis for packaging performance",
    description:
      "3DX FEA Simulator runs structural and performance simulations on packaging designs before physical testing and tooling investment.",
    tags: ["simulation", "fea", "3d", "packaging"],
  },
  {
    slug: "eln",
    sectionSlug: "data-capture",
    name: "ELN",
    purpose: "Electronic laboratory notebook for packaging R&D",
    description:
      "ELN captures experiments, observations, and results in a structured electronic lab notebook for packaging development teams.",
    tags: ["data-capture", "eln", "lab"],
  },
  {
    slug: "lims",
    sectionSlug: "data-capture",
    name: "LIMS",
    purpose: "Laboratory information management system",
    description:
      "LIMS manages samples, tests, and lab workflows for packaging development, quality tracking, and audit readiness.",
    tags: ["data-capture", "lims", "lab"],
  },
  {
    slug: "packaging-project-workflow",
    sectionSlug: "workflow-dashboard",
    name: "Packaging project management workflow",
    purpose: "End-to-end packaging project management and dashboards",
    description:
      "Packaging project management workflow coordinates milestones, tools, and team dashboards across Pack Lab projects from brief to handoff.",
    tags: ["workflow", "dashboard", "project-management", "packaging"],
  },
];

const toolBySlug = new Map(packLabToolDefinitions.map((tool) => [tool.slug, tool]));

const toolsBySection = packLabToolDefinitions.reduce(
  (acc, tool) => {
    if (!acc[tool.sectionSlug]) acc[tool.sectionSlug] = [];
    acc[tool.sectionSlug].push(tool.slug);
    return acc;
  },
  {} as Record<PackSectionSlug, string[]>,
);

export function getPackLabToolSlugsForSection(sectionSlug: PackSectionSlug): string[] {
  return toolsBySection[sectionSlug] ?? [];
}

export function getPackLabToolDefinition(slug: string): PackLabToolDefinition | undefined {
  return toolBySlug.get(slug);
}

export function getPackLabToolPath(sectionSlug: PackSectionSlug, toolSlug: string): string {
  return `/labs/pack-lab/${sectionSlug}/${toolSlug}`;
}

export function isPackLabToolInSection(
  sectionSlug: PackSectionSlug,
  toolSlug: string,
): boolean {
  return toolsBySection[sectionSlug]?.includes(toolSlug) ?? false;
}

export const packLabToolStaticParams = packLabToolDefinitions.map((tool) => ({
  section: tool.sectionSlug,
  tool: tool.slug,
}));
