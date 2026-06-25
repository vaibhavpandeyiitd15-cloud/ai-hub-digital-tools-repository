import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Mail } from "lucide-react";
import { StatusBadge } from "@/components/catalog/StatusBadge";
import { getToolBySlug } from "@/lib/tools";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const hasToolUrl = tool.toolUrl && tool.toolUrl !== "#";

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <StatusBadge status={tool.status} />
        <Link
          href={`/?category=${tool.category.slug}`}
          className="rounded-full border border-brand/20 bg-brand/5 px-3 py-0.5 text-xs font-medium text-brand hover:bg-brand/10"
        >
          {tool.category.name}
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="font-[family-name:var(--font-barlow)] text-3xl font-bold text-brand">
            {tool.name}
          </h1>
          <p className="mt-2 text-lg text-[var(--text-secondary)]">{tool.purpose}</p>

          <div className="prose prose-sm mt-8 max-w-none">
            <h2 className="font-[family-name:var(--font-barlow)] text-xl font-semibold">
              About this tool
            </h2>
            <p className="mt-2 leading-relaxed text-[var(--text-primary)]">
              {tool.description}
            </p>
          </div>

          {tool.tags.length > 0 ? (
            <div className="mt-8">
              <h2 className="font-[family-name:var(--font-barlow)] text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Tags
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--text-secondary)] ring-1 ring-[var(--border)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <p className="mt-8 text-xs text-[var(--text-secondary)]">
            Last updated:{" "}
            {tool.lastUpdated.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="font-[family-name:var(--font-barlow)] text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Point of Contact
            </h2>
            <p className="mt-3 font-[family-name:var(--font-barlow)] text-lg font-semibold">
              {tool.pocName}
            </p>
            {tool.pocTeam ? (
              <p className="text-sm text-[var(--text-secondary)]">{tool.pocTeam}</p>
            ) : null}
            <a
              href={`mailto:${tool.pocEmail}`}
              className="mt-2 flex items-center gap-2 text-sm text-brand hover:underline"
            >
              <Mail className="h-4 w-4" />
              {tool.pocEmail}
            </a>
          </div>

          {tool.trainingDocs.length > 0 ? (
            <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <h2 className="font-[family-name:var(--font-barlow)] text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Training docs
              </h2>
              <ul className="mt-3 space-y-2">
                {tool.trainingDocs.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand hover:underline"
                    >
                      {doc.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-6 text-sm text-[var(--text-secondary)]">
              No training docs yet — contact the POC or book a session when
              available.
            </div>
          )}

          <div className="flex flex-col gap-3">
            {hasToolUrl ? (
              <a
                href={tool.toolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-light"
              >
                Open Tool
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <span className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-[var(--text-secondary)]">
                Tool link coming soon
              </span>
            )}
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center rounded-lg border border-brand px-4 py-3 text-sm font-semibold text-brand opacity-60"
              title="Training booking — coming in Phase 3"
            >
              Book Training (soon)
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
