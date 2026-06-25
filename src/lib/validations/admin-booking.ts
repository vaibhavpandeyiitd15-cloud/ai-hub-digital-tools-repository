import { z } from "zod";

export const bookingStatusSchema = z.enum([
  "PENDING",
  "CONTACTED",
  "COMPLETED",
  "CANCELLED",
]);

export const updateBookingStatusSchema = z.object({
  bookingId: z.string().min(1),
  status: bookingStatusSchema,
});
