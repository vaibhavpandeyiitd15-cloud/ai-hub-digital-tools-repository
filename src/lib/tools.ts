import type { ToolStatus } from "@prisma/client";
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
