import { z } from "zod";

export const labTypeSchema = z.enum(["PACK", "FORMULATION"]);

export const categoryFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  lab: labTypeSchema.default("PACK"),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
