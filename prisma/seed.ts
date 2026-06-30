import { PrismaClient, ToolStatus } from "@prisma/client";
import { createPgAdapter } from "../src/lib/pg-adapter";

const legacyToolSlugs = [
  "innovation-navigator",
  "boltchat-ai",
  "convotrack",
  "rview",
  "insight-gpt",
  "beauty-vault",
  "trajaan-io",
  "innoflex-gpt",
] as const;

const categories = [
  {
    name: "Consumer & Market Insights",
    slug: "consumer-market-insights",
    description: "Concept development and social trend intelligence",
    sortOrder: 1,
  },
  {
    name: "Fragrance",
    slug: "fragrance",
    description: "Fragrance knowledge and library tools",
    sortOrder: 2,
  },
  {
    name: "Packaging",
    slug: "packaging",
    description: "Pack exploration and image-to-model workflows",
    sortOrder: 3,
  },
] as const;

const tools = [
  {
    slug: "concept-gpt",
    name: "Concept GPT",
    categorySlug: "consumer-market-insights",
    purpose: "AI-assisted concept generation from consumer and market insights",
    description:
      "Concept GPT helps teams explore product concepts, test hypotheses, and develop consumer-backed ideas using AI-assisted workflows within the Desire Lab Consumer Focused Lab.",
    tags: ["concept", "gpt", "insights", "consumer"],
  },
  {
    slug: "trends-by-social-intelligence",
    name: "Trends by Social Intelligence",
    categorySlug: "consumer-market-insights",
    purpose: "Track emerging trends from social and market signals",
    description:
      "Trends by Social Intelligence surfaces emerging consumer and market trends from social data and intelligence feeds to inform innovation decisions.",
    tags: ["trends", "social", "intelligence", "insights"],
  },
  {
    slug: "fragrance-library",
    name: "Fragrance Library",
    categorySlug: "fragrance",
    purpose: "Central fragrance knowledge and reference library",
    description:
      "Fragrance Library provides a searchable repository of fragrance knowledge, references, and materials to support consumer-focused fragrance innovation.",
    tags: ["fragrance", "library", "knowledge"],
  },
  {
    slug: "pack-explorer",
    name: "Pack Explorer",
    categorySlug: "packaging",
    purpose: "Explore packaging formats, designs, and benchmarks",
    description:
      "Pack Explorer helps teams discover packaging options, compare formats, and explore design directions for consumer packaging innovation.",
    tags: ["packaging", "explorer", "design"],
  },
  {
    slug: "image-to-model-conversion",
    name: "Image to Model Conversion",
    categorySlug: "packaging",
    purpose: "Convert packaging images into 3D model assets",
    description:
      "Image to Model Conversion transforms packaging reference images into 3D model assets for rapid prototyping and visualisation in packaging workflows.",
    tags: ["packaging", "3d", "conversion", "image"],
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

  for (const slug of legacyToolSlugs) {
    await prisma.tool.updateMany({
      where: { slug },
      data: { status: ToolStatus.DEPRECATED },
    });
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
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
  console.log("Seed complete: Desire Lab — 3 categories, 5 consumer tools (legacy tools deprecated)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
