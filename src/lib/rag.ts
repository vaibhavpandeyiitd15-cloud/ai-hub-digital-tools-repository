import { db, hasDatabase } from "@/lib/db";
import {
  getLabPathForToolSlug,
  getPackSection,
  PACKAGING_LAB_NAME,
  PACK_LAB_WORKFLOW_HREF,
  packSections,
} from "@/lib/content/desire-lab";
import {
  getPackLabToolDefinition,
  packLabToolDefinitions,
} from "@/lib/content/pack-lab-tools";
import { packSpecificationsContent } from "@/lib/content/pack-specifications";
import { getPhaseSlugForSection, packStageGroups } from "@/lib/content/pack-lab-stages";
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

const PACK_TOOL_SLUGS = new Set(packLabToolDefinitions.map((tool) => tool.slug));

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

function phaseLabelForSection(sectionSlug: string): string {
  const phaseSlug = getPhaseSlugForSection(sectionSlug as Parameters<typeof getPhaseSlugForSection>[0]);
  const phase = packStageGroups.find((group) => group.slug === phaseSlug);
  return phase ? `Phase: ${phase.name}` : "";
}

function buildPackagingLabOverviewChunk(): ToolChunk {
  const phaseLines = packStageGroups.map((phase, index) => {
    const stageDetails = phase.stageSlugs
      .map((stageSlug) => {
        const stage = getPackSection(stageSlug);
        const toolNames = packLabToolDefinitions
          .filter((tool) => tool.sectionSlug === stageSlug)
          .map((tool) => tool.name)
          .join(", ");
        const toolsSuffix = toolNames ? ` — tools: ${toolNames}` : "";
        return `${stage?.name} (${stage?.href})${toolsSuffix}`;
      })
      .join("; ");
    return `Phase ${index + 1} ${phase.name}: ${stageDetails}`;
  });

  return {
    toolId: "packaging-lab-overview",
    slug: "packaging-lab",
    name: PACKAGING_LAB_NAME,
    pocName: "Desire Lab",
    pocEmail: "desirelab@unilever.com",
    text: [
      `Lab: ${PACKAGING_LAB_NAME}`,
      "Catalog path: /labs/pack-lab",
      "Desire Lab organises packaging innovation into Packaging Lab (live) and Formulation Lab (coming soon).",
      "Packaging Lab uses three phases, each with stages:",
      ...phaseLines,
      `Workflow: Create a new workflow at ${PACK_LAB_WORKFLOW_HREF}`,
      "Do NOT refer users to legacy AI Hub tool paths (/tools/...) or Consumer/Science lab names — use Packaging Lab paths only.",
    ].join("\n"),
  };
}

function buildPackLabToolChunk(
  staticTool: (typeof packLabToolDefinitions)[number],
  dbTool?: {
    name: string;
    purpose: string;
    description: string;
    tags: string[];
    pocName: string;
    pocEmail: string;
    pocTeam: string | null;
    prerequisites: string | null;
    category: { name: string };
    trainingDocs: Array<{ title: string; type: string }>;
  },
): ToolChunk {
  const section = getPackSection(staticTool.sectionSlug);
  const phaseLine = phaseLabelForSection(staticTool.sectionSlug);
  const catalogPath = getLabPathForToolSlug(staticTool.slug);

  const lines = [
    `Tool: ${dbTool?.name ?? staticTool.name}`,
    `Lab: ${PACKAGING_LAB_NAME}`,
    phaseLine,
    `Stage: ${section?.name ?? staticTool.sectionSlug} (${staticTool.sectionSlug})`,
    `Catalog path: ${catalogPath}`,
    `Purpose: ${dbTool?.purpose ?? staticTool.purpose}`,
    `Description: ${dbTool?.description ?? staticTool.description}`,
    `Tags: ${(dbTool?.tags ?? staticTool.tags).join(", ")}`,
    `POC: ${dbTool?.pocName ?? staticTool.pocName ?? "TBD"} (${dbTool?.pocEmail ?? staticTool.pocEmail ?? "desirelab@unilever.com"})`,
  ];

  if (dbTool?.pocTeam) lines.push(`POC team: ${dbTool.pocTeam}`);
  if (dbTool?.prerequisites) lines.push(`Prerequisites: ${dbTool.prerequisites}`);
  if (dbTool?.trainingDocs.length) {
    lines.push(
      `Training: look for training slots in the header; training material on SharePoint for this tool`,
    );
  }

  return {
    toolId: staticTool.slug,
    slug: staticTool.slug,
    name: dbTool?.name ?? staticTool.name,
    pocName: dbTool?.pocName ?? staticTool.pocName ?? "TBD",
    pocEmail: dbTool?.pocEmail ?? staticTool.pocEmail ?? "desirelab@unilever.com",
    text: lines.join("\n"),
  };
}

function buildStageChunks(): ToolChunk[] {
  return packSections
    .filter((section) => !section.toolSlugs?.length || section.slug === "specifications")
    .filter((section) => section.slug !== "workflow-dashboard")
    .map((section) => {
      const isSpecifications = section.slug === "specifications";
      const phaseLine = phaseLabelForSection(section.slug);

      return {
        toolId: section.slug,
        slug: section.slug,
        name: section.name,
        pocName: "Desire Lab",
        pocEmail: "desirelab@unilever.com",
        text: [
          `Lab: ${PACKAGING_LAB_NAME}`,
          phaseLine,
          `Stage: ${section.name}`,
          `Catalog path: ${section.href}`,
          `Description: ${section.description}`,
          isSpecifications
            ? `Purpose: ${packSpecificationsContent.message} Use Active Workspace via /labs/pack-lab/specifications.`
            : `Purpose: ${section.description}`,
        ]
          .filter(Boolean)
          .join("\n"),
      };
    });
}

function buildWorkflowChunk(): ToolChunk {
  const workflowTool = getPackLabToolDefinition("packaging-project-workflow");
  return {
    toolId: "packaging-workflow",
    slug: "packaging-project-workflow",
    name: "Packaging project workflow",
    pocName: "Desire Lab",
    pocEmail: "desirelab@unilever.com",
    text: [
      `Lab: ${PACKAGING_LAB_NAME}`,
      "Feature: Create a new workflow",
      `Catalog path: ${PACK_LAB_WORKFLOW_HREF}`,
      `Purpose: ${workflowTool?.purpose ?? "End-to-end packaging project tracking"}`,
      `Description: ${workflowTool?.description ?? "Project workflow across Explore, Validate, and Execute phases."}`,
      "Use the Create a new workflow button on Packaging Lab pages to start a project.",
    ].join("\n"),
  };
}

function buildStaticPackLabChunks(): ToolChunk[] {
  return [
    buildPackagingLabOverviewChunk(),
    ...packLabToolDefinitions.map((tool) => buildPackLabToolChunk(tool)),
    ...buildStageChunks(),
    buildWorkflowChunk(),
  ];
}

async function loadDbPackToolOverrides(): Promise<
  Map<
    string,
    {
      name: string;
      purpose: string;
      description: string;
      tags: string[];
      pocName: string;
      pocEmail: string;
      pocTeam: string | null;
      prerequisites: string | null;
      category: { name: string };
      trainingDocs: Array<{ title: string; type: string }>;
    }
  >
> {
  const map = new Map<
    string,
    {
      name: string;
      purpose: string;
      description: string;
      tags: string[];
      pocName: string;
      pocEmail: string;
      pocTeam: string | null;
      prerequisites: string | null;
      category: { name: string };
      trainingDocs: Array<{ title: string; type: string }>;
    }
  >();

  if (!hasDatabase()) return map;

  try {
    const tools = await db.tool.findMany({
      where: {
        status: { in: ["ACTIVE", "BETA"] },
        slug: { in: [...PACK_TOOL_SLUGS] },
        category: { lab: "PACK" },
      },
      include: {
        category: true,
        trainingDocs: true,
      },
    });

    for (const tool of tools) {
      if (!PACK_TOOL_SLUGS.has(tool.slug)) continue;
      map.set(tool.slug, tool);
    }
  } catch (error) {
    console.error("Failed to load pack lab tools for RAG:", error);
  }

  return map;
}

function mergePackLabChunks(
  dbOverrides: Awaited<ReturnType<typeof loadDbPackToolOverrides>>,
): ToolChunk[] {
  const toolChunks = packLabToolDefinitions.map((staticTool) =>
    buildPackLabToolChunk(staticTool, dbOverrides.get(staticTool.slug)),
  );

  return [
    buildPackagingLabOverviewChunk(),
    ...toolChunks,
    ...buildStageChunks(),
    buildWorkflowChunk(),
  ];
}

export async function getToolChunks(): Promise<ToolChunk[]> {
  if (cache && Date.now() - cache.builtAt < CACHE_TTL_MS) {
    return cache.chunks;
  }

  const dbOverrides = await loadDbPackToolOverrides();
  const chunks = mergePackLabChunks(dbOverrides);

  if (isEmbeddingConfigured()) {
    for (const chunk of chunks) {
      try {
        const embedding = await createEmbedding(chunk.text);
        if (embedding.length > 0) {
          chunk.embedding = embedding;
        }
      } catch (error) {
        console.warn("Embedding failed for chunk:", chunk.slug, error);
      }
    }
  }

  cache = { chunks, builtAt: Date.now() };
  return chunks;
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

  const normalizedQuery = query.toLowerCase();
  const wantsOverview =
    normalizedQuery.includes("packaging lab") ||
    normalizedQuery.includes("phase") ||
    normalizedQuery.includes("stage") ||
    normalizedQuery.includes("workflow") ||
    normalizedQuery.includes("structure") ||
    normalizedQuery.includes("all tools");

  if (isEmbeddingConfigured()) {
    const queryEmbedding = await createEmbedding(query);
    if (queryEmbedding.length > 0) {
      const ranked = [...chunks]
        .map((chunk) => ({
          chunk,
          score: chunk.embedding
            ? cosineSimilarity(chunk.embedding, queryEmbedding)
            : keywordScore(chunk.text, query),
        }))
        .sort((a, b) => b.score - a.score);

      if (wantsOverview && ranked[0]?.chunk.slug !== "packaging-lab") {
        const overview = chunks.find((c) => c.slug === "packaging-lab");
        if (overview) {
          return [overview, ...ranked.slice(0, topK - 1).map((r) => r.chunk)];
        }
      }

      return ranked.slice(0, topK).map((item) => item.chunk);
    }
  }

  const ranked = [...chunks]
    .map((chunk) => ({ chunk, score: keywordScore(chunk.text, query) }))
    .sort((a, b) => b.score - a.score);

  if (wantsOverview) {
    const overview = chunks.find((c) => c.slug === "packaging-lab");
    if (overview) {
      return [overview, ...ranked.slice(0, topK - 1).map((r) => r.chunk)];
    }
  }

  return ranked.slice(0, topK).map((item) => item.chunk);
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
    return "I don't have any tool information loaded yet. Please browse the Packaging Lab catalog at /labs/pack-lab or contact desirelab@unilever.com.";
  }

  const normalizedQuery = query.toLowerCase();
  const isSpecificationsQuery =
    normalizedQuery.includes("specification") ||
    normalizedQuery.includes("active workspace") ||
    normalizedQuery.includes("activeworkspace");

  const isStructureQuery =
    normalizedQuery.includes("packaging lab") ||
    normalizedQuery.includes("phase") ||
    normalizedQuery.includes("stage") ||
    normalizedQuery.includes("all tools") ||
    normalizedQuery.includes("workflow");

  if (isStructureQuery) {
    const overview = chunks.find((c) => c.slug === "packaging-lab");
    if (overview) {
      return [
        `**${PACKAGING_LAB_NAME}** is organised in three phases — **Explore**, **Validate**, and **Execute**:`,
        "",
        "- **Explore** — Insight (Convotrack, Vurvey), Screening (Boltchat, PactInstant AI)",
        "- **Validate** — Prototyping (Kaedim), Simulation (3DX FEA Simulator)",
        "- **Execute** — Data capture (ELN, LIMS), Specifications (Active Workspace)",
        "",
        "Browse phases at /labs/pack-lab. Create a new workflow at /labs/pack-lab/workflow.",
      ].join("\n");
    }
  }

  if (isSpecificationsQuery) {
    return [
      "The **Specifications** stage in Packaging Lab is for writing packaging specifications in **Active Workspace**.",
      "",
      "1. Open /labs/pack-lab/specifications",
      "2. Click **Go to Active Workspace** to launch Active Workspace in a new tab",
      "",
      "Contact desirelab@unilever.com if you need access.",
    ].join("\n");
  }

  const primary = chunks[0]!;
  const path = toolCatalogPath(primary.slug);
  const details = primary.text.split("\n").slice(2, 6).join("\n");
  return `Based on the Desire Lab catalog, **${primary.name}** may be relevant to your question.\n\n${details}\n\nView full details at ${path}. For more help, contact ${primary.pocName} (${primary.pocEmail}).`;
}
