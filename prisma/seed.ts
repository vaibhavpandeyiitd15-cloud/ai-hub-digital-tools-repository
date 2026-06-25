import { PrismaClient, ToolStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const categories = [
  {
    name: "Consumer Insights (CMI)",
    slug: "consumer-insights-cmi",
    description: "Tools for consumer and market insights",
    sortOrder: 1,
  },
  {
    name: "Formulation",
    slug: "formulation",
    description: "Tools for formulation and product development",
    sortOrder: 2,
  },
] as const;

const tools = [
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
    slug: "rview",
    name: "RView",
    categorySlug: "formulation",
    purpose: "Review and collaboration for formulation research",
    description:
      "RView supports review workflows and collaboration for formulation and R&D teams.",
    tags: ["formulation", "review", "collaboration"],
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
    slug: "beauty-vault",
    name: "Beauty Vault",
    categorySlug: "formulation",
    purpose: "Knowledge repository for beauty and formulation",
    description:
      "Beauty Vault is a centralized knowledge base for beauty, personal care, and formulation expertise.",
    tags: ["beauty", "formulation", "knowledge"],
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
  {
    slug: "innoflex-gpt",
    name: "Innoflex GPT",
    categorySlug: "formulation",
    purpose: "GPT assistant for formulation and innovation",
    description:
      "Innoflex GPT supports formulation scientists and innovators with AI-assisted research and development.",
    tags: ["gpt", "formulation", "innovation"],
  },
] as const;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

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
        pocName: "TBD",
        toolUrl: "#",
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
        pocEmail: "aihub@unilever.com",
        toolUrl: "#",
      },
    });
  }

  await prisma.$disconnect();
  console.log("Seed complete: 2 categories, 8 tools");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
