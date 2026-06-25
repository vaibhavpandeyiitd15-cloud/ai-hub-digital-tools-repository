"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { db } from "@/lib/db";
import {
  parseTagsInput,
  parseTrainingDocsJson,
  toolFormSchema,
} from "@/lib/validations/tool";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries()) as Record<string, string>;
}

async function syncTrainingDocs(toolId: string, trainingDocsJson: string | undefined) {
  const docs = parseTrainingDocsJson(trainingDocsJson);
  if (docs === null) {
    throw new Error("Invalid training documents format");
  }

  await db.trainingDoc.deleteMany({ where: { toolId } });
  if (docs.length > 0) {
    await db.trainingDoc.createMany({
      data: docs.map((doc) => ({
        toolId,
        title: doc.title,
        url: doc.url,
        type: doc.type,
      })),
    });
  }
}

export async function createToolAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = toolFormSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const trainingDocs = parseTrainingDocsJson(data.trainingDocsJson);
  if (trainingDocs === null) {
    return { error: "Invalid training documents" };
  }

  const existing = await db.tool.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { fieldErrors: { slug: ["This slug is already in use"] } };
  }

  try {
    const tool = await db.tool.create({
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        status: data.status,
        purpose: data.purpose,
        description: data.description,
        toolUrl: data.toolUrl,
        pocName: data.pocName,
        pocEmail: data.pocEmail,
        pocTeam: data.pocTeam || null,
        tags: parseTagsInput(data.tags),
        prerequisites: data.prerequisites || null,
      },
    });

    if (trainingDocs.length > 0) {
      await db.trainingDoc.createMany({
        data: trainingDocs.map((doc) => ({
          toolId: tool.id,
          title: doc.title,
          url: doc.url,
          type: doc.type,
        })),
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/tools");
    revalidatePath(`/tools/${tool.slug}`);
    redirect(`/admin/tools/${tool.id}/edit?created=1`);
  } catch (error) {
    console.error("createToolAction:", error);
    return { error: "Failed to create tool" };
  }
}

export async function updateToolAction(
  toolId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = toolFormSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const existing = await db.tool.findUnique({ where: { id: toolId } });
  if (!existing) {
    return { error: "Tool not found" };
  }

  const slugConflict = await db.tool.findFirst({
    where: { slug: data.slug, NOT: { id: toolId } },
  });
  if (slugConflict) {
    return { fieldErrors: { slug: ["This slug is already in use"] } };
  }

  try {
    const tool = await db.tool.update({
      where: { id: toolId },
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        status: data.status,
        purpose: data.purpose,
        description: data.description,
        toolUrl: data.toolUrl,
        pocName: data.pocName,
        pocEmail: data.pocEmail,
        pocTeam: data.pocTeam || null,
        tags: parseTagsInput(data.tags),
        prerequisites: data.prerequisites || null,
      },
    });

    await syncTrainingDocs(toolId, data.trainingDocsJson);

    revalidatePath("/");
    revalidatePath("/admin/tools");
    revalidatePath(`/tools/${existing.slug}`);
    revalidatePath(`/tools/${tool.slug}`);
    return {};
  } catch (error) {
    console.error("updateToolAction:", error);
    return { error: "Failed to update tool" };
  }
}

export async function deprecateToolAction(toolId: string): Promise<ActionState> {
  await requireAdmin();

  try {
    const tool = await db.tool.update({
      where: { id: toolId },
      data: { status: "DEPRECATED" },
    });
    revalidatePath("/");
    revalidatePath("/admin/tools");
    revalidatePath(`/tools/${tool.slug}`);
    return {};
  } catch (error) {
    console.error("deprecateToolAction:", error);
    return { error: "Failed to deprecate tool" };
  }
}
