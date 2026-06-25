"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { db } from "@/lib/db";
import { updateBookingStatusSchema } from "@/lib/validations/admin-booking";

export type BookingActionState = {
  error?: string;
  success?: boolean;
};

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function updateBookingStatusAction(
  _prev: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  await requireAdmin();

  const parsed = updateBookingStatusSchema.safeParse({
    bookingId: formData.get("bookingId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: "Invalid status update" };
  }

  try {
    await db.booking.update({
      where: { id: parsed.data.bookingId },
      data: { status: parsed.data.status },
    });
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) {
    console.error("updateBookingStatusAction:", error);
    return { error: "Failed to update booking" };
  }
}
