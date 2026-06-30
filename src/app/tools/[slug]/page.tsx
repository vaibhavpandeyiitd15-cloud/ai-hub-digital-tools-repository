import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail } from "lucide-react";
import { ToolDetailActions } from "@/components/booking/ToolDetailActions";
import { StatusBadge } from "@/components/catalog/StatusBadge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getLabPathForCategory } from "@/lib/content/desire-lab";
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

  const hasToolUrl = Boolean(tool.toolUrl && tool.toolUrl !== "#");

  return (
    <div className="relative">
      {/* Brand hero band */}
      <div className="border-b border-brand/10 bg-gradient-to-r from-brand to-brand-light px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <StatusBadge status={tool.status} />
            <Link
              href={getLabPathForCategory(tool.category.slug)}
              className="rounded-full border border-white/30 bg-white/10 px-3 py-0.5 text-xs font-medium backdrop-blur-sm hover:bg-white/20"
            >
              {tool.category.name}
            </Link>
          </div>
          <h1 className="font-[family-name:var(--font-barlow)] text-3xl font-bold sm:text-4xl">
            {tool.name}
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-white/85">{tool.purpose}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <ScrollReveal className="lg:col-span-2">
            <div className="prose prose-sm max-w-none">
              <h2 className="font-[family-name:var(--font-barlow)] text-xl font-semibold text-brand">
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
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--text-secondary)] ring-1 ring-[var(--border)] transition hover:ring-brand/30"
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
          </ScrollReveal>

          <aside className="space-y-6">
            <ScrollReveal delay={120}>
              <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-md transition hover:shadow-lg">
                <h2 className="font-[family-name:var(--font-barlow)] text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  Point of Contact
                </h2>
                <p className="mt-3 font-[family-name:var(--font-barlow)] text-lg font-semibold">
                  {tool.pocName}
                </p>
                {tool.pocTeam ? (
                  <p className="text-sm text-[var(--text-secondary)]">
                    {tool.pocTeam}
                  </p>
                ) : null}
                <a
                  href={`mailto:${tool.pocEmail}`}
                  className="mt-2 flex items-center gap-2 text-sm text-brand hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {tool.pocEmail}
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              {tool.trainingDocs.length > 0 ? (
                <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-md">
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
                <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-6 text-sm text-[var(--text-secondary)]">
                  No training docs yet — book a session below to get started.
                </div>
              )}
            </ScrollReveal>

            <ScrollReveal delay={280}>
              <ToolDetailActions
                tool={{
                  id: tool.id,
                  name: tool.name,
                  slug: tool.slug,
                  pocName: tool.pocName,
                  pocEmail: tool.pocEmail,
                  toolUrl: tool.toolUrl,
                  hasToolUrl,
                }}
              />
            </ScrollReveal>
          </aside>
        </div>
      </div>
    </div>
  );
}
