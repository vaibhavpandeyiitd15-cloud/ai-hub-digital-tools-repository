import { z } from "zod";

export const bookingSchema = z.object({
  toolId: z.string().min(1),
  requesterName: z.string().min(2, "Name is required"),
  requesterEmail: z.string().email("Valid email required"),
  preferredDate: z.string().min(1, "Date is required"),
  preferredTime: z.string().min(1, "Time is required"),
  durationMinutes: z.union([z.literal(30), z.literal(60)]),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
