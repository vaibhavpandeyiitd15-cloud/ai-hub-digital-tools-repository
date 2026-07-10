"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { db } from "@/lib/db";
import { categoryFormSchema } from "@/lib/validations/category";

export type CategoryActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function createCategoryAction(
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  await requireAdmin();

  const parsed = categoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    lab: formData.get("lab") ?? "PACK",
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const existing = await db.category.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { fieldErrors: { slug: ["This slug is already in use"] } };
  }

  try {
    await db.category.create({ data });
    revalidatePath("/");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/tools");
    return { success: true };
  } catch (error) {
    console.error("createCategoryAction:", error);
    return { error: "Failed to create category" };
  }
}

export async function updateCategoryAction(
  categoryId: string,
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  await requireAdmin();

  const parsed = categoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    lab: formData.get("lab") ?? "PACK",
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const slugConflict = await db.category.findFirst({
    where: { slug: data.slug, NOT: { id: categoryId } },
  });
  if (slugConflict) {
    return { fieldErrors: { slug: ["This slug is already in use"] } };
  }

  try {
    await db.category.update({
      where: { id: categoryId },
      data,
    });
    revalidatePath("/");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/tools");
    return { success: true };
  } catch (error) {
    console.error("updateCategoryAction:", error);
    return { error: "Failed to update category" };
  }
}

export async function deleteCategoryAction(
  categoryId: string,
): Promise<CategoryActionState> {
  await requireAdmin();

  const toolCount = await db.tool.count({ where: { categoryId } });
  if (toolCount > 0) {
    return {
      error: `Cannot delete — ${toolCount} tool(s) still use this category`,
    };
  }

  try {
    await db.category.delete({ where: { id: categoryId } });
    revalidatePath("/");
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("deleteCategoryAction:", error);
    return { error: "Failed to delete category" };
  }
}
