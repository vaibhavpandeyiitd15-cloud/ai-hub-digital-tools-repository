import { PrismaClient, ToolStatus } from "@prisma/client";
import { createPgAdapter } from "../src/lib/pg-adapter";

const categories = [
  {
    name: "Pack Lab — Insight",
    slug: "pack-insight",
    description: "Consumer and packaging intelligence",
    lab: "PACK" as const,
    sortOrder: 1,
  },
  {
    name: "Pack Lab — Screening",
    slug: "pack-screening",
    description: "Rapid packaging screening and evaluation",
    lab: "PACK" as const,
    sortOrder: 2,
  },
  {
    name: "Pack Lab — Prototyping",
    slug: "pack-prototyping",
    description: "3D prototyping and model generation",
    lab: "PACK" as const,
    sortOrder: 3,
  },
  {
    name: "Pack Lab — Simulation",
    slug: "pack-simulation",
    description: "Structural and performance simulation",
    lab: "PACK" as const,
    sortOrder: 4,
  },
  {
    name: "Pack Lab — Data capture",
    slug: "pack-data-capture",
    description: "Electronic lab records and sample management",
    lab: "PACK" as const,
    sortOrder: 5,
  },
  {
    name: "Pack Lab — Workflow & dashboard",
    slug: "pack-workflow-dashboard",
    description: "Packaging project management workflow",
    lab: "PACK" as const,
    sortOrder: 6,
  },
] as const;

const tools = [
  {
    slug: "convotrack",
    name: "Convotrack",
    categorySlug: "pack-insight",
    purpose: "Track and analyze consumer conversations",
    description:
      "Convotrack monitors and analyzes consumer conversations to surface trends and actionable packaging insights.",
    tags: ["insight", "conversations", "consumer"],
  },
  {
    slug: "vurvey",
    name: "Vurvey",
    categorySlug: "pack-insight",
    purpose: "Video-based consumer research and insight platform",
    description:
      "Vurvey captures and analyzes video-based consumer feedback to inform packaging decisions.",
    tags: ["insight", "video", "consumer", "research"],
  },
  {
    slug: "boltchat-ai",
    name: "Boltchat",
    categorySlug: "pack-screening",
    purpose: "AI-powered conversational screening platform",
    description:
      "Boltchat enables rapid screening and AI-assisted evaluation of packaging concepts and options.",
    tags: ["screening", "ai", "conversational"],
  },
  {
    slug: "pactinstant-ai",
    name: "PactInstant AI",
    categorySlug: "pack-screening",
    purpose: "Instant AI-assisted packaging screening",
    description:
      "PactInstant AI accelerates early packaging screening with instant AI-driven analysis and recommendations.",
    tags: ["screening", "ai", "packaging"],
  },
  {
    slug: "kaedim",
    name: "Kaedim",
    categorySlug: "pack-prototyping",
    purpose: "AI-powered 3D model generation from images",
    description:
      "Kaedim transforms packaging reference images into production-ready 3D models for rapid prototyping.",
    tags: ["prototyping", "3d", "ai", "packaging"],
  },
  {
    slug: "3dx-fea-simulator",
    name: "3DX FEA Simulator",
    categorySlug: "pack-simulation",
    purpose: "Finite element analysis for packaging performance",
    description:
      "3DX FEA Simulator runs structural and performance simulations on packaging designs before physical testing.",
    tags: ["simulation", "fea", "3d", "packaging"],
  },
  {
    slug: "eln",
    name: "ELN",
    categorySlug: "pack-data-capture",
    purpose: "Electronic laboratory notebook for packaging R&D",
    description:
      "ELN captures experiments, observations, and results in a structured electronic lab notebook for packaging teams.",
    tags: ["data-capture", "eln", "lab"],
  },
  {
    slug: "lims",
    name: "LIMS",
    categorySlug: "pack-data-capture",
    purpose: "Laboratory information management system",
    description:
      "LIMS manages samples, tests, and lab workflows for packaging development and quality tracking.",
    tags: ["data-capture", "lims", "lab"],
  },
  {
    slug: "packaging-project-workflow",
    name: "Packaging project management workflow",
    categorySlug: "pack-workflow-dashboard",
    purpose: "End-to-end packaging project management and dashboards",
    description:
      "Packaging project management workflow coordinates milestones, tools, and team dashboards across Pack Lab projects.",
    tags: ["workflow", "dashboard", "project-management", "packaging"],
  },
] as const;

async function main() {
  const connectionString =
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error(
      "Database URL not set. Add POSTGRES_URL_NON_POOLING to .env.local",
    );
  }

  const adapter = createPgAdapter(connectionString);
  const prisma = new PrismaClient({ adapter });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
        lab: category.lab,
      },
      create: category,
    });
  }

  const categoryMap = Object.fromEntries(
    (
      await prisma.category.findMany({
        select: { id: true, slug: true },
      })
    ).map((c) => [c.slug, c.id]),
  );

  for (const tool of tools) {
    const categoryId = categoryMap[tool.categorySlug];
    if (!categoryId) {
      throw new Error(`Category not found: ${tool.categorySlug}`);
    }

    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: {
        name: tool.name,
        categoryId,
        purpose: tool.purpose,
        description: tool.description,
        tags: [...tool.tags],
        status: ToolStatus.ACTIVE,
      },
      create: {
        slug: tool.slug,
        name: tool.name,
        categoryId,
        purpose: tool.purpose,
        description: tool.description,
        tags: [...tool.tags],
        status: ToolStatus.ACTIVE,
        pocName: "TBD",
        pocEmail: "desirelab@unilever.com",
        toolUrl: "#",
      },
    });
  }

  await prisma.$disconnect();
  console.log(
    `Seed complete: ${categories.length} categories, ${tools.length} tools (Pack Lab)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
