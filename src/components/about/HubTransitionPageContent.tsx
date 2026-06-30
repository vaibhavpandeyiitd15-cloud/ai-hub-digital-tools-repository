import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Sparkles,
} from "lucide-react";
import { HubCardGrid } from "@/components/labs/HubCardGrid";
import { DesireLabHero } from "@/components/home/DesireLabHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import {
  HUB_TRANSITION_SOURCE_URL,
  hubTransitionContent,
} from "@/lib/content/hub-transition";
import { labBranches } from "@/lib/content/desire-lab";

export function HubTransitionPageContent() {
  const { legacy, today, timeline } = hubTransitionContent;

  return (
    <div>
      <DesireLabHero
        eyebrow="Our journey"
        title={hubTransitionContent.title}
        subtitle={hubTransitionContent.subtitle}
      />

      <section className="mx-auto max-w-3xl px-6 py-14 text-center">
        <ScrollReveal>
          <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
            {hubTransitionContent.intro}
          </p>
        </ScrollReveal>
      </section>

      {/* Then → Now */}
      <section className="border-y border-[var(--border)] bg-white/70 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="flex flex-col items-center gap-2 text-center">
              <GitBranch className="h-8 w-8 text-u-mint" aria-hidden />
              <h2 className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand sm:text-3xl">
                Then and now
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <ScrollReveal delay={80}>
              <article className="hub-card flex h-full flex-col overflow-hidden rounded-2xl p-0">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={legacy.image}
                    alt={legacy.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/80 via-brand/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-medium uppercase tracking-widest text-white/70">
                      Where we started
                    </p>
                    <h3 className="mt-1 font-[family-name:var(--font-barlow)] text-xl font-bold">
                      {legacy.name}
                    </h3>
                    <p className="text-sm text-white/85">{legacy.tagline}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <p className="text-[var(--text-secondary)]">{legacy.summary}</p>
                  <ul className="mt-5 space-y-2">
                    {legacy.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm text-[var(--text-primary)]"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <article className="hub-card flex h-full flex-col overflow-hidden rounded-2xl p-0">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={today.image}
                    alt={today.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/80 via-brand/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-medium uppercase tracking-widest text-u-sun">
                      Where we are today
                    </p>
                    <h3 className="mt-1 font-[family-name:var(--font-barlow)] text-xl font-bold">
                      {today.name}
                    </h3>
                    <p className="text-sm text-white/85">{today.tagline}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <p className="text-[var(--text-secondary)]">{today.summary}</p>
                  <ul className="mt-5 space-y-2">
                    {today.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm text-[var(--text-primary)]"
                      >
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-u-mint" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <ScrollReveal>
            <h2 className="text-center font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand sm:text-3xl">
              The transition
            </h2>
          </ScrollReveal>

          <ol className="relative mt-12 space-y-0 border-l-2 border-brand/20 pl-8">
            {timeline.map((step, index) => (
              <ScrollReveal key={step.title} delay={index * 80}>
                <li className="relative pb-10 last:pb-0">
                  <span className="absolute -left-[1.65rem] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-brand bg-white">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand">
                    {step.quarter ? `${step.quarter} ${step.year}` : step.year}
                  </p>
                  <h3 className="mt-1 font-[family-name:var(--font-barlow)] text-lg font-bold text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {step.body}
                  </p>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Continuity */}
      <section className="border-y border-[var(--border)] bg-white/70 py-14 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
              {hubTransitionContent.continuity}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-brand-dark py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-barlow)] text-3xl font-bold">
              Innovation in action
            </h2>
            <p className="mt-2 max-w-xl text-white/70">
              From agile innovation days to Desire Lab — people, data, and technology
              across {hubTransitionContent.regions}.
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {hubTransitionContent.gallery.map((img, i) => (
              <ScrollReveal key={img.src} delay={i * 100}>
                <figure className="overflow-hidden rounded-xl ring-1 ring-white/10">
                  <ParallaxImage>
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  </ParallaxImage>
                  <figcaption className="bg-white/5 px-3 py-2 text-xs text-white/80">
                    {img.caption}
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Explore labs CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <ScrollReveal>
          <h2 className="text-center font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand">
            Explore Desire Lab
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-[var(--text-secondary)]">
            Pick a lab to browse tools — the same catalog, organised for how you work.
          </p>
        </ScrollReveal>
        <div className="mt-10">
          <HubCardGrid
            featured
            centered
            items={labBranches.map((lab) => ({
              title: lab.name,
              description: lab.description,
              href: lab.href,
              available: lab.available,
              badge: "Available",
            }))}
          />
        </div>
      </section>

      {/* Source + CTAs */}
      <section className="border-t border-[var(--border)] bg-white/80 py-14 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/" className="btn-primary inline-flex items-center gap-2">
                Go to Desire Lab home
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={HUB_TRANSITION_SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2"
              >
                HUL News — AI Hub 2.0
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-8 text-xs text-[var(--text-secondary)]">
              Story adapted from{" "}
              <a
                href={HUB_TRANSITION_SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                HUL News — AI Hub 2.0
              </a>{" "}
              ({hubTransitionContent.published}). Images © Unilever/HUL.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
