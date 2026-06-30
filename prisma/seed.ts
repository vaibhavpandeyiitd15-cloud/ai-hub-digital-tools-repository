import { PrismaClient, ToolStatus } from "@prisma/client";
import { createPgAdapter } from "../src/lib/pg-adapter";

const categories = [
  {
    name: "Consumer & Market Insights",
    slug: "consumer-market-insights",
    description: "Concept development and social trend intelligence",
    lab: "CONSUMER" as const,
    sortOrder: 1,
  },
  {
    name: "Consumer Insights (CMI)",
    slug: "consumer-insights-cmi",
    description: "Legacy AI Hub consumer insights tools",
    lab: "CONSUMER" as const,
    sortOrder: 2,
  },
  {
    name: "Fragrance",
    slug: "fragrance",
    description: "Fragrance knowledge and library tools",
    lab: "CONSUMER" as const,
    sortOrder: 3,
  },
  {
    name: "Packaging",
    slug: "packaging",
    description: "Pack exploration and image-to-model workflows",
    lab: "CONSUMER" as const,
    sortOrder: 4,
  },
  {
    name: "Explore",
    slug: "explore",
    description: "Patents, R&D data, and scientific publications",
    lab: "SCIENCE" as const,
    sortOrder: 10,
  },
  {
    name: "Innovate",
    slug: "innovate",
    description: "Science innovation workflows",
    lab: "SCIENCE" as const,
    sortOrder: 11,
  },
  {
    name: "Design",
    slug: "design",
    description: "Science-led design capabilities",
    lab: "SCIENCE" as const,
    sortOrder: 12,
  },
  {
    name: "Impact",
    slug: "impact",
    description: "Measure and validate scientific impact",
    lab: "SCIENCE" as const,
    sortOrder: 13,
  },
] as const;

const tools = [
  // Consumer — new Desire Lab tools
  {
    slug: "concept-gpt",
    name: "Concept GPT",
    categorySlug: "consumer-market-insights",
    purpose: "AI-assisted concept generation from consumer and market insights",
    description:
      "Concept GPT helps teams explore product concepts, test hypotheses, and develop consumer-backed ideas using AI-assisted workflows.",
    tags: ["concept", "gpt", "insights", "consumer"],
  },
  {
    slug: "trends-by-social-intelligence",
    name: "Trends by Social Intelligence",
    categorySlug: "consumer-market-insights",
    purpose: "Track emerging trends from social and market signals",
    description:
      "Trends by Social Intelligence surfaces emerging consumer and market trends from social data and intelligence feeds.",
    tags: ["trends", "social", "intelligence", "insights"],
  },
  {
    slug: "fragrance-library",
    name: "Fragrance Library",
    categorySlug: "fragrance",
    purpose: "Central fragrance knowledge and reference library",
    description:
      "Fragrance Library provides a searchable repository of fragrance knowledge, references, and materials.",
    tags: ["fragrance", "library", "knowledge"],
  },
  {
    slug: "pack-explorer",
    name: "Pack Explorer",
    categorySlug: "packaging",
    purpose: "Explore packaging formats, designs, and benchmarks",
    description:
      "Pack Explorer helps teams discover packaging options, compare formats, and explore design directions.",
    tags: ["packaging", "explorer", "design"],
  },
  {
    slug: "image-to-model-conversion",
    name: "Image to Model Conversion",
    categorySlug: "packaging",
    purpose: "Convert packaging images into 3D model assets",
    description:
      "Image to Model Conversion transforms packaging reference images into 3D model assets for rapid prototyping.",
    tags: ["packaging", "3d", "conversion", "image"],
  },
  // Consumer — legacy AI Hub insights tools (admin can deprecate)
  {
    slug: "innovation-navigator",
    name: "Innovation Navigator",
    categorySlug: "consumer-insights-cmi",
    purpose: "Navigate innovation insights and opportunities",
    description:
      "Innovation Navigator helps teams discover and track innovation opportunities across consumer insights workflows.",
    tags: ["innovation", "insights"],
  },
  {
    slug: "boltchat-ai",
    name: "Boltchat.AI",
    categorySlug: "consumer-insights-cmi",
    purpose: "AI-powered conversational insights platform",
    description:
      "Boltchat.AI enables conversational analysis and AI-assisted insights for consumer research teams.",
    tags: ["ai", "conversational", "insights"],
  },
  {
    slug: "convotrack",
    name: "Convotrack",
    categorySlug: "consumer-insights-cmi",
    purpose: "Track and analyze consumer conversations",
    description:
      "Convotrack monitors and analyzes consumer conversations to surface trends and actionable insights.",
    tags: ["social", "conversations", "tracking"],
  },
  {
    slug: "insight-gpt",
    name: "Insight GPT",
    categorySlug: "consumer-insights-cmi",
    purpose: "GPT assistant for consumer insights workflows",
    description:
      "Insight GPT provides an AI assistant tailored for consumer insights tasks and analysis.",
    tags: ["gpt", "insights", "ai"],
  },
  {
    slug: "trajaan-io",
    name: "Trajaan.io",
    categorySlug: "consumer-insights-cmi",
    purpose: "Market and consumer trend intelligence",
    description:
      "Trajaan.io delivers market intelligence and consumer trend tracking for strategic decision-making.",
    tags: ["market", "trends", "intelligence"],
  },
  // Science — Explore
  {
    slug: "patbase",
    name: "PatBase",
    categorySlug: "explore",
    purpose: "Patent search and landscape exploration",
    description:
      "PatBase supports patent discovery, landscape analysis, and competitive intelligence for R&D teams.",
    tags: ["patents", "explore", "science"],
  },
  {
    slug: "rd-assistant",
    name: "R&D Assistant",
    categorySlug: "explore",
    purpose: "AI assistant for R&D research workflows",
    description:
      "R&D Assistant helps scientists query research data, summarise findings, and accelerate literature review.",
    tags: ["rd", "assistant", "ai", "science"],
  },
  {
    slug: "data-lab",
    name: "Data Lab",
    categorySlug: "explore",
    purpose: "Scientific data exploration and analysis workspace",
    description:
      "Data Lab provides a workspace for exploring, visualising, and analysing R&D datasets.",
    tags: ["data", "analysis", "science"],
  },
  {
    slug: "journals-publications",
    name: "Internal and External Journals and Publications",
    categorySlug: "explore",
    purpose: "Access internal and external scientific publications",
    description:
      "Search and browse internal Unilever research and external journals to inform science-led innovation.",
    tags: ["journals", "publications", "research"],
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
    `Seed complete: ${categories.length} categories, ${tools.length} tools (consumer + science)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
