"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import type { Category, Tool, TrainingDoc, ToolStatus } from "@prisma/client";
import {
  createToolAction,
  updateToolAction,
  type ActionState,
} from "@/lib/actions/tools";
import { slugify } from "@/lib/slug";
import type { TrainingDocInput } from "@/lib/validations/tool";

type ToolWithRelations = Tool & {
  category: Category;
  trainingDocs: TrainingDoc[];
};

type AdminToolFormProps = {
  categories: Category[];
  tool?: ToolWithRelations;
  mode: "create" | "edit";
};

const statusOptions: { value: ToolStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "BETA", label: "Beta" },
  { value: "DEPRECATED", label: "Deprecated" },
];

const docTypes = ["GUIDE", "VIDEO", "SLIDE_DECK", "FAQ", "OTHER"] as const;

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-xs text-danger">{messages[0]}</p>;
}

const initialState: ActionState = {};

export function AdminToolForm({ categories, tool, mode }: AdminToolFormProps) {
  const boundUpdate = tool
    ? updateToolAction.bind(null, tool.id)
    : null;

  const [state, formAction, pending] = useActionState(
    mode === "create" ? createToolAction : boundUpdate!,
    initialState,
  );

  const [name, setName] = useState(tool?.name ?? "");
  const [slug, setSlug] = useState(tool?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(tool));
  const [saved, setSaved] = useState(false);
  const [docs, setDocs] = useState<TrainingDocInput[]>(
    tool?.trainingDocs.map((d) => ({
      id: d.id,
      title: d.title,
      url: d.url,
      type: d.type,
    })) ?? [],
  );

  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && mode === "edit" && !state.error && !state.fieldErrors) {
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(t);
    }
    wasPending.current = pending;
  }, [pending, state, mode]);

  const trainingDocsJson = useMemo(
    () =>
      JSON.stringify(
        docs.filter((d) => d.title.trim().length > 0 && d.url.trim().length > 0),
      ),
    [docs],
  );

  function addDoc() {
    setDocs((prev) => [...prev, { title: "", url: "", type: "GUIDE" }]);
  }

  function updateDoc(index: number, patch: Partial<TrainingDocInput>) {
    setDocs((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  function removeDoc(index: number) {
    setDocs((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="trainingDocsJson" value={trainingDocsJson} readOnly />

      {state.error && (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      {saved && (
        <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          Changes saved successfully.
        </div>
      )}

      <section className="rounded-xl border border-[var(--border)] bg-white p-6">
        <h2 className="font-[family-name:var(--font-barlow)] text-lg font-semibold text-brand">
          Basic information
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Tool name *</label>
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <FieldError messages={state.fieldErrors?.name} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">URL slug *</label>
            <input
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 font-mono text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <FieldError messages={state.fieldErrors?.slug} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Status *</label>
            <select
              name="status"
              defaultValue={tool?.status ?? "ACTIVE"}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Category *</label>
            <select
              name="categoryId"
              defaultValue={tool?.categoryId ?? categories[0]?.id}
              required
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <FieldError messages={state.fieldErrors?.categoryId} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Short purpose *</label>
            <input
              name="purpose"
              defaultValue={tool?.purpose}
              required
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <FieldError messages={state.fieldErrors?.purpose} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Full description *</label>
            <textarea
              name="description"
              defaultValue={tool?.description}
              required
              rows={5}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <FieldError messages={state.fieldErrors?.description} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Tool URL *</label>
            <input
              name="toolUrl"
              defaultValue={tool?.toolUrl ?? "#"}
              required
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <FieldError messages={state.fieldErrors?.toolUrl} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Tags (comma-separated)</label>
            <input
              name="tags"
              defaultValue={tool?.tags.join(", ")}
              placeholder="ai, insights, formulation"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Prerequisites</label>
            <textarea
              name="prerequisites"
              defaultValue={tool?.prerequisites ?? ""}
              rows={2}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-white p-6">
        <h2 className="font-[family-name:var(--font-barlow)] text-lg font-semibold text-brand">
          Point of contact
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">POC name *</label>
            <input
              name="pocName"
              defaultValue={tool?.pocName ?? "TBD"}
              required
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <FieldError messages={state.fieldErrors?.pocName} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">POC email *</label>
            <input
              name="pocEmail"
              type="email"
              defaultValue={tool?.pocEmail ?? "aihub@unilever.com"}
              required
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <FieldError messages={state.fieldErrors?.pocEmail} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">POC team</label>
            <input
              name="pocTeam"
              defaultValue={tool?.pocTeam ?? ""}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-[family-name:var(--font-barlow)] text-lg font-semibold text-brand">
            Training documents
          </h2>
          <button
            type="button"
            onClick={addDoc}
            className="inline-flex items-center gap-1 rounded-lg border border-brand/20 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add doc
          </button>
        </div>
        {docs.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            No training docs yet. Add guides, videos, or slide decks.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {docs.map((doc, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-lg border border-[var(--border)] bg-surface/50 p-3 sm:grid-cols-[1fr_1fr_auto_auto]"
              >
                <input
                  value={doc.title}
                  onChange={(e) => updateDoc(index, { title: e.target.value })}
                  placeholder="Title"
                  className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
                />
                <input
                  value={doc.url}
                  onChange={(e) => updateDoc(index, { url: e.target.value })}
                  placeholder="https://..."
                  className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
                />
                <select
                  value={doc.type}
                  onChange={(e) =>
                    updateDoc(index, {
                      type: e.target.value as TrainingDocInput["type"],
                    })
                  }
                  className="rounded-lg border border-[var(--border)] bg-white px-2 py-2 text-sm"
                >
                  {docTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeDoc(index)}
                  className="rounded-lg p-2 text-danger hover:bg-danger/10"
                  aria-label="Remove document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-50">
          {pending ? "Saving…" : mode === "create" ? "Create tool" : "Save changes"}
        </button>
        <Link href="/admin/tools" className="btn-outline">
          Cancel
        </Link>
        {tool && (
          <Link
            href={`/tools/${tool.slug}`}
            target="_blank"
            className="text-sm font-medium text-brand hover:underline"
          >
            Preview page →
          </Link>
        )}
      </div>
    </form>
  );
}
