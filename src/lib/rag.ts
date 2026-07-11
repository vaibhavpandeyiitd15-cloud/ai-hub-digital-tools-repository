import { db, hasDatabase } from "@/lib/db";
import { getLabPathForToolSlug, packSections } from "@/lib/content/desire-lab";
import { packLabToolDefinitions } from "@/lib/content/pack-lab-tools";
import { packSpecificationsContent } from "@/lib/content/pack-specifications";
import { createEmbedding, isEmbeddingConfigured } from "@/lib/llm";

export type ToolCitation = {
  name: string;
  slug: string;
  path: string;
  pocName: string;
  pocEmail: string;
};

export type ToolChunk = {
  toolId: string;
  slug: string;
  name: string;
  pocName: string;
  pocEmail: string;
  text: string;
  embedding?: number[];
};

type ChunkCache = {
  chunks: ToolChunk[];
  builtAt: number;
};

const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: ChunkCache | null = null;

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function keywordScore(text: string, query: string): number {
  const haystack = text.toLowerCase();
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);
  if (terms.length === 0) return 0;
  return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
}

function toolCatalogPath(slug: string): string {
  const section = packSections.find((s) => s.slug === slug);
  if (section) return section.href;
  return getLabPathForToolSlug(slug);
}

function buildStaticPackLabChunks(): ToolChunk[] {
  const toolChunks = packLabToolDefinitions.map((tool) => ({
    toolId: tool.slug,
    slug: tool.slug,
    name: tool.name,
    pocName: tool.pocName ?? "TBD",
    pocEmail: tool.pocEmail ?? "desirelab@unilever.com",
    text: [
      `Tool: ${tool.name}`,
      `Catalog path: ${toolCatalogPath(tool.slug)}`,
      `Section: ${tool.sectionSlug}`,
      `Purpose: ${tool.purpose}`,
      `Description: ${tool.description}`,
      `Tags: ${tool.tags.join(", ")}`,
      `POC: ${tool.pocName ?? "TBD"} (${tool.pocEmail ?? "desirelab@unilever.com"})`,
    ].join("\n"),
  }));

  const sectionChunks = packSections
    .filter((section) => !section.toolSlugs?.length)
    .map((section) => {
      const isSpecifications = section.slug === "specifications";
      return {
        toolId: section.slug,
        slug: section.slug,
        name: section.name,
        pocName: "Desire Lab",
        pocEmail: "desirelab@unilever.com",
        text: [
          `Packaging Lab stage: ${section.name}`,
          `Catalog path: ${section.href}`,
          `Description: ${section.description}`,
          isSpecifications
            ? `Purpose: ${packSpecificationsContent.message} Active Workspace is the PLM system for packaging specification authoring.`
            : `Purpose: ${section.description}`,
          isSpecifications
            ? "How to access: Open /labs/pack-lab/specifications and click Go to Active Workspace."
            : "",
          "Tags: pack lab, section, specifications, active workspace",
        ]
          .filter(Boolean)
          .join("\n"),
      };
    });

  return [...toolChunks, ...sectionChunks];
}

function buildChunkText(tool: {
  name: string;
  slug: string;
  purpose: string;
  description: string;
  tags: string[];
  pocName: string;
  pocEmail: string;
  pocTeam: string | null;
  prerequisites: string | null;
  category: { name: string };
  trainingDocs: Array<{ title: string; type: string }>;
}): string {
  const lines = [
    `Tool: ${tool.name}`,
    `Catalog path: ${toolCatalogPath(tool.slug)}`,
    `Category: ${tool.category.name}`,
    `Purpose: ${tool.purpose}`,
    `Description: ${tool.description}`,
    `Tags: ${tool.tags.join(", ") || "none"}`,
    `POC: ${tool.pocName} (${tool.pocEmail})`,
  ];
  if (tool.pocTeam) lines.push(`POC team: ${tool.pocTeam}`);
  if (tool.prerequisites) lines.push(`Prerequisites: ${tool.prerequisites}`);
  if (tool.trainingDocs.length > 0) {
    lines.push(
      `Training resources: ${tool.trainingDocs.map((d) => `${d.title} (${d.type})`).join("; ")}`,
    );
  }
  return lines.join("\n");
}

export async function getToolChunks(): Promise<ToolChunk[]> {
  if (cache && Date.now() - cache.builtAt < CACHE_TTL_MS) {
    return cache.chunks;
  }

  if (!hasDatabase()) {
    const chunks = buildStaticPackLabChunks();
    cache = { chunks, builtAt: Date.now() };
    return chunks;
  }

  try {
    const tools = await db.tool.findMany({
      where: { status: { in: ["ACTIVE", "BETA"] } },
      include: {
        category: true,
        trainingDocs: true,
      },
      orderBy: { name: "asc" },
    });

    if (tools.length === 0) {
      return buildStaticPackLabChunks();
    }

    const chunks: ToolChunk[] = tools.map((tool) => ({
      toolId: tool.id,
      slug: tool.slug,
      name: tool.name,
      pocName: tool.pocName,
      pocEmail: tool.pocEmail,
      text: buildChunkText(tool),
    }));

    if (isEmbeddingConfigured()) {
      for (const chunk of chunks) {
        const embedding = await createEmbedding(chunk.text);
        if (embedding.length > 0) {
          chunk.embedding = embedding;
        }
      }
    }

    cache = { chunks, builtAt: Date.now() };
    return chunks;
  } catch (error) {
    console.error("Failed to load tool chunks from database:", error);
    const chunks = buildStaticPackLabChunks();
    cache = { chunks, builtAt: Date.now() };
    return chunks;
  }
}

export function invalidateToolChunkCache() {
  cache = null;
}

export async function retrieveRelevantChunks(
  query: string,
  topK = 3,
): Promise<ToolChunk[]> {
  const chunks = await getToolChunks();
  if (chunks.length === 0) return [];

  if (isEmbeddingConfigured()) {
    const queryEmbedding = await createEmbedding(query);
    if (queryEmbedding.length > 0) {
      return [...chunks]
        .map((chunk) => ({
          chunk,
          score: chunk.embedding
            ? cosineSimilarity(chunk.embedding, queryEmbedding)
            : keywordScore(chunk.text, query),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map((item) => item.chunk);
    }
  }

  return [...chunks]
    .map((chunk) => ({ chunk, score: keywordScore(chunk.text, query) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.chunk);
}

export function chunksToCitations(chunks: ToolChunk[]): ToolCitation[] {
  const seen = new Set<string>();
  const citations: ToolCitation[] = [];
  for (const chunk of chunks) {
    if (seen.has(chunk.slug)) continue;
    seen.add(chunk.slug);
    citations.push({
      name: chunk.name,
      slug: chunk.slug,
      path: toolCatalogPath(chunk.slug),
      pocName: chunk.pocName,
      pocEmail: chunk.pocEmail,
    });
  }
  return citations;
}

export function buildContextBlock(chunks: ToolChunk[]): string {
  return chunks.map((chunk) => chunk.text).join("\n\n---\n\n");
}

export function buildFallbackAnswer(query: string, chunks: ToolChunk[]): string {
  if (chunks.length === 0) {
    return "I don't have any tool information loaded yet. Please browse the catalog or contact the AI Hub team.";
  }

  const normalizedQuery = query.toLowerCase();
  const isSpecificationsQuery =
    normalizedQuery.includes("specification") ||
    normalizedQuery.includes("active workspace") ||
    normalizedQuery.includes("activeworkspace");

  if (isSpecificationsQuery) {
    return [
      "The **Specifications** stage in Packaging Lab is for writing packaging specifications in **Active Workspace**.",
      "",
      "1. Open /labs/pack-lab/specifications",
      "2. Click **Go to Active Workspace** to launch Active Workspace in a new tab",
      "",
      "Active Workspace is Unilever's PLM environment for packaging specification authoring.",
      "Contact desirelab@unilever.com if you need access.",
    ].join("\n");
  }

  const primary = chunks[0]!;
  const path = toolCatalogPath(primary.slug);
  const details = primary.text.split("\n").slice(2, 5).join("\n");
  return `Based on the Desire Lab catalog, **${primary.name}** may be relevant to your question.\n\n${details}\n\nView full details at ${path}. For more help, contact ${primary.pocName} (${primary.pocEmail}).`;
}
