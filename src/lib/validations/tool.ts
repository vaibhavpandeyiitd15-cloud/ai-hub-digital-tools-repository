import { z } from "zod";

export const toolStatusSchema = z.enum(["ACTIVE", "BETA", "DEPRECATED"]);

export const trainingDocInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Valid URL required"),
  type: z.enum(["GUIDE", "VIDEO", "SLIDE_DECK", "FAQ", "OTHER"]).default("GUIDE"),
});

export const toolFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  categoryId: z.string().min(1, "Category is required"),
  status: toolStatusSchema,
  purpose: z.string().min(10, "Purpose should be at least 10 characters"),
  description: z.string().min(20, "Description should be at least 20 characters"),
  toolUrl: z.string().min(1, "Tool URL is required"),
  pocName: z.string().min(1, "POC name is required"),
  pocEmail: z.string().email("Valid POC email required"),
  pocTeam: z.string().optional(),
  tags: z.string().optional(),
  prerequisites: z.string().optional(),
  trainingDocsJson: z.string().optional(),
});

export type ToolFormInput = z.infer<typeof toolFormSchema>;
export type TrainingDocInput = z.infer<typeof trainingDocInputSchema>;

export function parseTrainingDocsJson(json: string | undefined) {
  if (!json?.trim()) return [];
  try {
    const parsed = JSON.parse(json);
    return z.array(trainingDocInputSchema).parse(parsed);
  } catch {
    return null;
  }
}

export function parseTagsInput(tags: string | undefined): string[] {
  if (!tags?.trim()) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
