import { PrismaClient, ToolStatus } from "@prisma/client";
import { packLabToolDefinitions } from "../src/lib/content/pack-lab-tools";
import { createPgAdapter } from "../src/lib/pg-adapter";

const categories = [
  {
    name: "Packaging Lab — Insight",
    slug: "pack-insight",
    description: "Consumer and packaging intelligence",
    lab: "PACK" as const,
    sortOrder: 1,
  },
  {
    name: "Packaging Lab — Screening",
    slug: "pack-screening",
    description: "Rapid packaging screening and evaluation",
    lab: "PACK" as const,
    sortOrder: 2,
  },
  {
    name: "Packaging Lab — Prototyping",
    slug: "pack-prototyping",
    description: "3D prototyping and model generation",
    lab: "PACK" as const,
    sortOrder: 3,
  },
  {
    name: "Packaging Lab — Simulation",
    slug: "pack-simulation",
    description: "Structural and performance simulation",
    lab: "PACK" as const,
    sortOrder: 4,
  },
  {
    name: "Packaging Lab — Data capture",
    slug: "pack-data-capture",
    description: "Electronic lab records and sample management",
    lab: "PACK" as const,
    sortOrder: 5,
  },
  {
    name: "Packaging Lab — Specifications",
    slug: "pack-specifications",
    description: "Packaging specification authoring in Active Workspace",
    lab: "PACK" as const,
    sortOrder: 6,
  },
  {
    name: "Packaging Lab — Workflow & dashboard",
    slug: "pack-workflow-dashboard",
    description: "Packaging project management workflow",
    lab: "PACK" as const,
    sortOrder: 7,
  },
] as const;

const categorySlugBySection = {
  insight: "pack-insight",
  screening: "pack-screening",
  prototyping: "pack-prototyping",
  simulation: "pack-simulation",
  "data-capture": "pack-data-capture",
  specifications: "pack-specifications",
  "workflow-dashboard": "pack-workflow-dashboard",
} as const;

const tools = packLabToolDefinitions.map((tool) => ({
  slug: tool.slug,
  name: tool.name,
  categorySlug: categorySlugBySection[tool.sectionSlug],
  purpose: tool.purpose,
  description: tool.description,
  tags: [...tool.tags],
  toolUrl: tool.toolUrl ?? "#",
}));

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
        tags: tool.tags,
        toolUrl: tool.toolUrl,
        status: ToolStatus.ACTIVE,
      },
      create: {
        slug: tool.slug,
        name: tool.name,
        categoryId,
        purpose: tool.purpose,
        description: tool.description,
        tags: tool.tags,
        toolUrl: tool.toolUrl,
        status: ToolStatus.ACTIVE,
        pocName: "TBD",
        pocEmail: "desirelab@unilever.com",
      },
    });
  }

  await prisma.$disconnect();
  console.log(
    `Seed complete: ${categories.length} categories, ${tools.length} tools (Packaging Lab)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
