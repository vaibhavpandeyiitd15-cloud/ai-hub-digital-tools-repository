"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import type { Category } from "@prisma/client";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
  type CategoryActionState,
} from "@/lib/actions/categories";
import { slugify } from "@/lib/slug";

type CategoryRow = Category & { _count: { tools: number } };

const initialState: CategoryActionState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-xs text-danger">{messages[0]}</p>;
}

function CategoryEditRow({ category }: { category: CategoryRow }) {
  const router = useRouter();
  const [deleting, startDelete] = useTransition();
  const boundUpdate = updateCategoryAction.bind(null, category.id);
  const [state, formAction, pending] = useActionState(boundUpdate, initialState);
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [slugTouched, setSlugTouched] = useState(true);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  function handleDelete() {
    if (
      !confirm(
        `Delete category "${category.name}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    startDelete(async () => {
      await deleteCategoryAction(category.id);
      router.refresh();
    });
  }

  return (
    <form
      action={formAction}
      className="rounded-xl border border-[var(--border)] bg-white p-4"
    >
      <div className="grid gap-3 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-3">
          <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
            Name
          </label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          />
          <FieldError messages={state.fieldErrors?.name} />
        </div>
        <div className="lg:col-span-3">
          <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
            Slug
          </label>
          <input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            required
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 font-mono text-sm"
          />
          <FieldError messages={state.fieldErrors?.slug} />
        </div>
        <div className="lg:col-span-3">
          <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
            Description
          </label>
          <input
            name="description"
            defaultValue={category.description ?? ""}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          />
        </div>
        <div className="lg:col-span-2">
          <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
            Lab
          </label>
          <select
            name="lab"
            defaultValue={category.lab}
            className="w-full rounded-lg border border-[var(--border)] px-2 py-2 text-sm"
          >
            <option value="PACK">Packaging Lab</option>
            <option value="FORMULATION">Formulation Lab</option>
          </select>
        </div>
        <div className="lg:col-span-1">
          <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
            Order
          </label>
          <input
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={category.sortOrder}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 lg:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="btn-primary px-3 py-2 text-xs disabled:opacity-50"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={category._count.tools > 0 || deleting}
            title={
              category._count.tools > 0
                ? "Reassign tools before deleting"
                : "Delete category"
            }
            className="rounded-lg p-2 text-danger hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">
        {category._count.tools} tool(s) · slug: {category.slug}
      </p>
      {state.error && <p className="mt-2 text-xs text-danger">{state.error}</p>}
      {state.success && (
        <p className="mt-2 text-xs text-success">Saved.</p>
      )}
    </form>
  );
}

export function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const [state, formAction, pending] = useActionState(
    createCategoryAction,
    initialState,
  );
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  useEffect(() => {
    if (state.success) {
      setName("");
      setSlug("");
      setSlugTouched(false);
    }
  }, [state.success]);

  return (
    <div className="space-y-6">
      <form
        action={formAction}
        className="rounded-xl border border-brand/20 bg-brand/5 p-5"
      >
        <h2 className="font-[family-name:var(--font-barlow)] text-lg font-semibold text-brand">
          Add category
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-1 block text-xs font-medium">Name *</label>
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
            />
            <FieldError messages={state.fieldErrors?.name} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Slug *</label>
            <input
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              required
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 font-mono text-sm"
            />
            <FieldError messages={state.fieldErrors?.slug} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Description</label>
            <input
              name="description"
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Lab</label>
            <select
              name="lab"
              defaultValue="PACK"
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
            >
              <option value="PACK">Packaging Lab</option>
              <option value="FORMULATION">Formulation Lab</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Sort order</label>
            <input
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={categories.length + 1}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
            />
          </div>
        </div>
        {state.error && <p className="mt-2 text-sm text-danger">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="btn-primary mt-4 disabled:opacity-50"
        >
          {pending ? "Adding…" : "Add category"}
        </button>
      </form>

      <div className="space-y-3">
        {categories.map((category) => (
          <CategoryEditRow key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
