import type { LabType, ToolStatus } from "@prisma/client";
import { db, hasDatabase } from "@/lib/db";
import type { PackSectionSlug } from "@/lib/content/desire-lab";
import { getPackSection } from "@/lib/content/desire-lab";
import {
  getPackLabToolDefinition,
  getPackLabToolPath,
} from "@/lib/content/pack-lab-tools";

export type ToolWithCategory = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  status: ToolStatus;
  purpose: string;
  description: string;
  toolUrl: string;
  pocName: string;
  pocEmail: string;
  pocTeam: string | null;
  tags: string[];
  prerequisites: string | null;
  lastUpdated: Date;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    lab: LabType;
    sortOrder: number;
    createdAt: Date;
  };
};

async function withDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!hasDatabase()) {
    return fallback;
  }
  try {
    return await fn();
  } catch (error) {
    console.error("Database error:", error);
    return fallback;
  }
}

export async function getActiveTools() {
  return withDb(
    () =>
      db.tool.findMany({
        where: {
          status: { in: ["ACTIVE", "BETA"] },
        },
        include: {
          category: true,
        },
        orderBy: { name: "asc" },
      }),
    [],
  );
}

export async function getToolsByCategorySlugs(categorySlugs: string[]) {
  if (categorySlugs.length === 0) return [];
  return withDb(
    () =>
      db.tool.findMany({
        where: {
          status: { in: ["ACTIVE", "BETA"] },
          category: { slug: { in: categorySlugs } },
        },
        include: { category: true },
        orderBy: { name: "asc" },
      }),
    [],
  );
}

export async function getToolsBySlugs(slugs: string[]) {
  if (slugs.length === 0) return [];
  return withDb(
    () =>
      db.tool.findMany({
        where: {
          slug: { in: slugs },
          status: { in: ["ACTIVE", "BETA"] },
        },
        include: { category: true },
      }),
    [],
  );
}

export async function getCategories() {
  return withDb(
    () =>
      db.category.findMany({
        orderBy: { sortOrder: "asc" },
      }),
    [],
  );
}

export async function getToolBySlug(slug: string) {
  return withDb(
    () =>
      db.tool.findUnique({
        where: { slug },
        include: {
          category: true,
          trainingDocs: true,
        },
      }),
    null,
  );
}

export function statusLabel(status: ToolStatus) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "BETA":
      return "Beta";
    case "DEPRECATED":
      return "Deprecated";
  }
}

export function orderToolsBySlugs<T extends { slug: string }>(
  tools: T[],
  slugs: string[],
): T[] {
  const map = new Map(tools.map((t) => [t.slug, t]));
  return slugs.map((slug) => map.get(slug)).filter(Boolean) as T[];
}

export type PackSectionToolCard = ToolWithCategory & {
  href: string;
};

export async function getPackSectionTools(
  sectionSlug: PackSectionSlug,
): Promise<PackSectionToolCard[]> {
  const section = getPackSection(sectionSlug);
  if (!section?.toolSlugs?.length) return [];

  const dbTools = orderToolsBySlugs(
    await getToolsBySlugs(section.toolSlugs),
    section.toolSlugs,
  );
  const dbBySlug = new Map(dbTools.map((tool) => [tool.slug, tool]));

  return section.toolSlugs.map((slug) => {
    const dbTool = dbBySlug.get(slug);
    const staticTool = getPackLabToolDefinition(slug);
    const href = getPackLabToolPath(sectionSlug, slug);

    if (dbTool) {
      return { ...dbTool, href };
    }

    if (!staticTool) {
      throw new Error(`Missing Pack Lab tool definition: ${slug}`);
    }

    const now = new Date(0);
    return {
      id: slug,
      slug: staticTool.slug,
      name: staticTool.name,
      categoryId: section.categorySlugs?.[0] ?? "pack-static",
      status: "ACTIVE" as ToolStatus,
      purpose: staticTool.purpose,
      description: staticTool.description,
      toolUrl: staticTool.toolUrl ?? "#",
      pocName: staticTool.pocName ?? "TBD",
      pocEmail: staticTool.pocEmail ?? "desirelab@unilever.com",
      pocTeam: null,
      tags: staticTool.tags,
      prerequisites: null,
      lastUpdated: now,
      createdAt: now,
      category: {
        id: section.categorySlugs?.[0] ?? "pack-static",
        name: section.name,
        slug: section.categorySlugs?.[0] ?? section.slug,
        description: section.description,
        lab: "PACK" as LabType,
        sortOrder: 0,
        createdAt: now,
      },
      href,
    };
  });
}

export type PackLabToolDetail = {
  slug: string;
  name: string;
  purpose: string;
  description: string;
  tags: string[];
  status: ToolStatus;
  toolUrl: string;
  pocName: string;
  pocEmail: string;
  pocTeam: string | null;
  lastUpdated: Date;
  categoryName: string;
  sectionSlug: PackSectionSlug;
  sectionName: string;
  href: string;
  id: string;
  trainingDocs: { id: string; title: string; url: string }[];
};

export async function getPackLabToolDetail(
  sectionSlug: PackSectionSlug,
  toolSlug: string,
): Promise<PackLabToolDetail | null> {
  const section = getPackSection(sectionSlug);
  if (!section?.toolSlugs?.includes(toolSlug)) return null;

  const staticTool = getPackLabToolDefinition(toolSlug);
  if (!staticTool) return null;

  const dbTool = await getToolBySlug(toolSlug);
  const href = getPackLabToolPath(sectionSlug, toolSlug);
  const now = new Date(0);

  if (dbTool) {
    return {
      id: dbTool.id,
      slug: dbTool.slug,
      name: dbTool.name,
      purpose: dbTool.purpose,
      description: dbTool.description,
      tags: dbTool.tags,
      status: dbTool.status,
      toolUrl: dbTool.toolUrl,
      pocName: dbTool.pocName,
      pocEmail: dbTool.pocEmail,
      pocTeam: dbTool.pocTeam,
      lastUpdated: dbTool.lastUpdated,
      categoryName: section.name,
      sectionSlug,
      sectionName: section.name,
      href,
      trainingDocs: dbTool.trainingDocs,
    };
  }

  return {
    id: toolSlug,
    slug: staticTool.slug,
    name: staticTool.name,
    purpose: staticTool.purpose,
    description: staticTool.description,
    tags: staticTool.tags,
    status: "ACTIVE",
    toolUrl: staticTool.toolUrl ?? "#",
    pocName: staticTool.pocName ?? "TBD",
    pocEmail: staticTool.pocEmail ?? "desirelab@unilever.com",
    pocTeam: null,
    lastUpdated: now,
    categoryName: section.name,
    sectionSlug,
    sectionName: section.name,
    href,
    trainingDocs: [],
  };
}
