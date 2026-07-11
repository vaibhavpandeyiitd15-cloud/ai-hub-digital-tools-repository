import type { Booking, BookingStatus } from "@prisma/client";
import { db, hasDatabase } from "@/lib/db";

export type BookingWithTool = Booking & {
  tool: { id: string; name: string; slug: string; pocName: string };
};

export type CollatedBookingSlot = {
  key: string;
  toolId: string;
  toolName: string;
  toolSlug: string;
  pocName: string;
  preferredDate: Date;
  preferredTime: string;
  durationMinutes: number;
  requestCount: number;
  pendingCount: number;
  bookings: BookingWithTool[];
};

function slotKey(booking: BookingWithTool): string {
  const date = booking.preferredDate.toISOString().slice(0, 10);
  return `${booking.toolId}|${date}|${booking.preferredTime}|${booking.durationMinutes}`;
}

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
        ? { status: statusFilter as BookingStatus }
        : undefined,
    include: {
      tool: { select: { id: true, name: true, slug: true, pocName: true } },
    },
    orderBy: [{ preferredDate: "asc" }, { preferredTime: "asc" }, { createdAt: "desc" }],
  });
}

export async function getBookingsCollatedByToolAndSlot(
  statusFilter?: string,
): Promise<CollatedBookingSlot[]> {
  const bookings = await getBookingsForAdmin(statusFilter);
  const groups = new Map<string, CollatedBookingSlot>();

  for (const booking of bookings) {
    const key = slotKey(booking);
    const existing = groups.get(key);

    if (!existing) {
      groups.set(key, {
        key,
        toolId: booking.toolId,
        toolName: booking.tool.name,
        toolSlug: booking.tool.slug,
        pocName: booking.tool.pocName,
        preferredDate: booking.preferredDate,
        preferredTime: booking.preferredTime,
        durationMinutes: booking.durationMinutes,
        requestCount: 1,
        pendingCount: booking.status === "PENDING" ? 1 : 0,
        bookings: [booking],
      });
      continue;
    }

    existing.requestCount += 1;
    if (booking.status === "PENDING") existing.pendingCount += 1;
    existing.bookings.push(booking);
  }

  return [...groups.values()].sort((a, b) => {
    const dateCompare = a.preferredDate.getTime() - b.preferredDate.getTime();
    if (dateCompare !== 0) return dateCompare;
    const toolCompare = a.toolName.localeCompare(b.toolName);
    if (toolCompare !== 0) return toolCompare;
    return a.preferredTime.localeCompare(b.preferredTime);
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
