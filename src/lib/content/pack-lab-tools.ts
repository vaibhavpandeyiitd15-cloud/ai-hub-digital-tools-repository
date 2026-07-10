import type { PackSectionSlug } from "@/lib/content/desire-lab";

export type PackLabToolDefinition = {
  slug: string;
  sectionSlug: PackSectionSlug;
  name: string;
  purpose: string;
  description: string;
  tags: string[];
  toolUrl?: string;
  pocName?: string;
  pocEmail?: string;
};

export const packLabToolDefinitions: PackLabToolDefinition[] = [
  {
    slug: "convotrack",
    sectionSlug: "insight",
    name: "Convotrack",
    toolUrl: "https://convotrack.ai/",
    purpose: "Video social listening and consumer intelligence from millions of social videos",
    description:
      "Convotrack is an AI-powered consumer intelligence platform that analyses social video on Instagram Reels, TikTok, and YouTube Shorts — decoding audio, visuals, and on-screen text to surface trends, sentiment, and innovation opportunities in minutes. Used for trend discovery, competitive intelligence, occasion analysis, and packaging-relevant consumer behaviour. Goes beyond text-based social listening with multimodal AI trained for video-first conversations.",
    tags: ["insight", "video", "social-listening", "consumer", "trends"],
  },
  {
    slug: "vurvey",
    sectionSlug: "insight",
    name: "Vurvey",
    toolUrl: "https://vurvey.com/",
    purpose: "AI-powered video surveys and consumer insight at scale",
    description:
      "Vurvey combines generative AI with video-based feedback to automate market research, concept testing, and qualitative insight. Teams run video survey campaigns, auto-transcribe responses, generate Magic Reels highlight clips, and surface themes with sentiment analysis. AI agents trained on your research data help test packaging ideas faster — with a global community network for rapid consumer participation.",
    tags: ["insight", "video", "research", "concept-testing", "ai"],
  },
  {
    slug: "boltchat-ai",
    sectionSlug: "screening",
    name: "Boltchat",
    toolUrl: "https://www.boltchatai.com/",
    purpose: "AI-moderated qualitative research at scale — insights in 24 hours",
    description:
      "Boltchat (BoltChatAI) automates end-to-end qualitative research: AI moderators recruit participants, conduct one-to-one in-depth interviews with up to 100 people simultaneously across 90+ markets, and deliver summary reports within 24 hours. Ideal for screening packaging concepts, claims, and creative routes with real consumer probing — used by brands including Unilever for fast, scalable qual at a fraction of traditional fieldwork time.",
    tags: ["screening", "ai", "qualitative", "research", "conversational"],
  },
  {
    slug: "pactinstant-ai",
    sectionSlug: "screening",
    name: "PactInstant AI",
    toolUrl: "https://tolunacorporate.com/our-solutions/products-packs-and-experiences/",
    purpose: "AI-powered instant packaging design benchmarking and screening",
    description:
      "PactInstant AI is part of Toluna's PACT packaging testing suite — a hybrid AI diagnostic for instant benchmarking of current pack designs and early-stage concept exploration. Results in ~48 hours using 3D virtual shelf simulations, AI eye tracking, and implicit testing, benchmarked against competitive shelf context and a database of 10,000+ reference cases. Low-cost screening before full validation.",
    tags: ["screening", "ai", "packaging", "shelf", "benchmarking"],
  },
  {
    slug: "kaedim",
    sectionSlug: "prototyping",
    name: "Kaedim",
    toolUrl: "https://kaedim3d.com/",
    purpose: "AI 2D-to-3D conversion for rapid packaging and product prototyping",
    description:
      "Kaedim turns sketches, product photos, and reference packs into production-ready 3D models using machine learning plus human-in-the-loop quality review. Upload up to 10 views of an object, generate watertight quad-based meshes, request revisions, and export as OBJ, FBX, GLB, or USD. Accelerates packaging prototyping before CAD — resolving proportion, volume, and form while designs are still easy to change.",
    tags: ["prototyping", "3d", "ai", "packaging", "cad"],
  },
  {
    slug: "3dx-fea-simulator",
    sectionSlug: "simulation",
    name: "3DX FEA Simulator",
    toolUrl: "https://www.3ds.com/products/simulia/consumer-packaged-goods-retail",
    purpose: "Structural FEA simulation for packaging performance on 3DEXPERIENCE",
    description:
      "3DEXPERIENCE structural simulation (SIMULIA / Abaqus FEA) validates packaging mechanical performance before physical prototypes — top load, squeeze, drop, seal strength, and box compression. MODSIM workflows connect CAD and CAE on the 3DEXPERIENCE platform so packaging teams run linear and nonlinear FEA, optimise material use, and reduce development cost and recall risk through virtual testing.",
    tags: ["simulation", "fea", "abaqus", "3dexperience", "packaging"],
  },
  {
    slug: "eln",
    sectionSlug: "data-capture",
    name: "ELN",
    purpose: "Electronic laboratory notebook for packaging R&D experiments",
    description:
      "An Electronic Laboratory Notebook (ELN) replaces paper notebooks with a secure digital record of experiments, formulations, observations, and results. Scientists capture protocols, calculations, and unstructured notes with version control, audit trails, and e-signatures for regulatory compliance (e.g. 21 CFR Part 11). ELNs integrate with LIMS to connect ideation through scale-up — essential for packaging development IP protection and cross-team collaboration.",
    tags: ["data-capture", "eln", "lab", "compliance", "experiments"],
  },
  {
    slug: "lims",
    sectionSlug: "data-capture",
    name: "LIMS",
    purpose: "Laboratory information management for samples, tests, and QC workflows",
    description:
      "A Laboratory Information Management System (LIMS) is the operational backbone for packaging labs — tracking samples, scheduling tests, managing inventory, enforcing SOPs, and automating QC workflows from R&D through manufacturing. LIMS centralises test methods, batch records, and audit-ready reporting while integrating with ELNs and instruments for real-time data capture. Supports shelf-life testing, raw material lots, and finished-goods quality in CPG packaging programmes.",
    tags: ["data-capture", "lims", "lab", "qc", "samples"],
  },
  {
    slug: "packaging-project-workflow",
    sectionSlug: "workflow-dashboard",
    name: "Packaging project management workflow",
    purpose: "End-to-end packaging project tracking, milestones, and team dashboards",
    description:
      "The Packaging project management workflow coordinates Pack Lab projects from brief through insight, screening, prototyping, simulation, and handoff. Teams track milestones, link tools and deliverables, monitor progress on shared dashboards, and manage handoffs to scale-up — giving packaging innovation leads a single view of active projects across Mumbai and Bangalore hubs.",
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
