import type { LabType, ToolStatus } from "@prisma/client";
import { db, hasDatabase } from "@/lib/db";

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
