import { db, hasDatabase } from "@/lib/db";

export async function getAllToolsForAdmin() {
  if (!hasDatabase()) return [];
  return db.tool.findMany({
    include: {
      category: true,
      _count: { select: { bookings: true, trainingDocs: true } },
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });
}

export async function getToolForAdmin(id: string) {
  if (!hasDatabase()) return null;
  return db.tool.findUnique({
    where: { id },
    include: {
      category: true,
      trainingDocs: { orderBy: { title: "asc" } },
    },
  });
}

export async function getAllCategoriesForAdmin() {
  if (!hasDatabase()) return [];
  return db.category.findMany({
    include: { _count: { select: { tools: true } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getBookingsForAdmin(statusFilter?: string) {
  if (!hasDatabase()) return [];
  return db.booking.findMany({
    where:
      statusFilter && statusFilter !== "ALL"
        ? { status: statusFilter as "PENDING" | "CONTACTED" | "COMPLETED" | "CANCELLED" }
        : undefined,
    include: {
      tool: { select: { id: true, name: true, slug: true, pocName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminStats() {
  if (!hasDatabase()) {
    return { tools: 0, categories: 0, pendingBookings: 0 };
  }
  const [tools, categories, pendingBookings] = await Promise.all([
    db.tool.count(),
    db.category.count(),
    db.booking.count({ where: { status: "PENDING" } }),
  ]);
  return { tools, categories, pendingBookings };
}
