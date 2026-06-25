import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Layers,
  MapPin,
  Signal,
  Sparkles,
  Users,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { WaveBackground } from "@/components/ui/WaveBackground";
import {
  AI_HUB_SOURCE_URL,
  aiHubContent,
  aiHubImages,
} from "@/lib/content/ai-hub";

const capabilityIcons = {
  signal: Signal,
  sparkles: Sparkles,
  users: Users,
  layers: Layers,
} as const;

export function AiHubPageContent() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-light text-white">
        <WaveBackground />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="animate-fade-up">
            <p className="mb-3 text-xs font-medium tracking-[0.2em] uppercase text-white/70">
              Hindustan Unilever · {aiHubContent.location}
            </p>
            <h1 className="font-[family-name:var(--font-barlow)] text-4xl font-bold tracking-tight sm:text-5xl">
              {aiHubContent.title}
            </h1>
            <p className="mt-2 text-xl text-white/90">{aiHubContent.subtitle}</p>
            <p className="mt-6 leading-relaxed text-white/85">{aiHubContent.intro}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/" className="btn-primary inline-flex items-center gap-2 bg-white text-brand hover:bg-white/90">
                Explore tools
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={AI_HUB_SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Read on HUL.co.in
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <ParallaxImage className="animate-fade-up [animation-delay:200ms]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
              <Image
                src="/assets/ai-hub/hero-collaboration.jpg"
                alt="Teams collaborating at HUL AI Hub"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand/60 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-xs text-white/90">
                Published {aiHubContent.published} · Source: HUL News
              </p>
            </div>
          </ParallaxImage>
        </div>
      </section>

      {/* Vision strip */}
      <section className="border-b border-[var(--border)] bg-white py-14">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
              {aiHubContent.vision}
            </p>
            <p className="mt-6 text-[var(--text-primary)]">{aiHubContent.investment}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Capabilities grid */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-center font-[family-name:var(--font-barlow)] text-3xl font-bold text-brand">
              A platform designed to elevate decision-making
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--text-secondary)]">
              Integrated capabilities for everyday innovation workflows
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {aiHubContent.capabilities.map((cap, i) => {
              const Icon = capabilityIcons[cap.icon as keyof typeof capabilityIcons];
              return (
                <ScrollReveal key={cap.title} delay={i * 100}>
                  <div className="group h-full rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-[family-name:var(--font-barlow)] font-semibold text-brand">
                      {cap.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                      {cap.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Waterfall pillar sections */}
      {aiHubContent.pillars.map((pillar, index) => (
        <section
          key={pillar.heading}
          className={`py-16 ${index % 2 === 1 ? "bg-white" : "bg-surface"}`}
        >
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2">
            <ScrollReveal
              className={index % 2 === 1 ? "lg:order-2" : ""}
              delay={index * 50}
            >
              <h2 className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand sm:text-3xl">
                {pillar.heading}
              </h2>
              <p className="mt-4 leading-relaxed text-[var(--text-secondary)]">
                {pillar.body}
              </p>
            </ScrollReveal>

            <ScrollReveal
              delay={150 + index * 50}
              className={index % 2 === 1 ? "lg:order-1" : ""}
            >
              <ParallaxImage>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
                  <Image
                    src={pillar.image}
                    alt={pillar.imageAlt}
                    fill
                    className="object-cover transition duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </ParallaxImage>
            </ScrollReveal>
          </div>
        </section>
      ))}

      {/* Image mosaic — waterfall gallery */}
      <section className="bg-brand-dark py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-barlow)] text-3xl font-bold">
              Innovation in action
            </h2>
            <p className="mt-2 max-w-xl text-white/70">
              A glimpse of the Mumbai AI Hub ecosystem — where people, data, and
              technology come together.
            </p>
          </ScrollReveal>

          <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {aiHubImages.map((img, i) => (
              <ScrollReveal key={img.src} delay={i * 120}>
                <figure
                  className="mb-4 break-inside-avoid overflow-hidden rounded-xl ring-1 ring-white/10 transition hover:ring-success/40"
                  style={{ marginTop: i % 3 === 1 ? "1.5rem" : undefined }}
                >
                  <div className="relative">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={800}
                      height={i === 3 ? 500 : 450}
                      className="w-full object-cover transition duration-500 hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="bg-white/5 px-4 py-2 text-xs text-white/80">
                    {img.caption}
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mumbai campus */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <Image
            src={aiHubContent.campus.image}
            alt={aiHubContent.campus.imageAlt}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-brand/85" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center text-white">
          <ScrollReveal>
            <MapPin className="mx-auto h-8 w-8 text-success" />
            <h2 className="mt-4 font-[family-name:var(--font-barlow)] text-3xl font-bold">
              {aiHubContent.campus.heading}
            </h2>
            <p className="mt-4 leading-relaxed text-white/85">
              {aiHubContent.campus.body}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
              {aiHubContent.closing}
            </p>
            <Link
              href="/"
              className="btn-primary mt-8 inline-flex items-center gap-2"
            >
              Browse AI Hub tools
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-8 text-xs text-[var(--text-secondary)]">
              Content adapted from{" "}
              <a
                href={AI_HUB_SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                HUL News — AI Hub 2.0
              </a>{" "}
              (15 Jan 2026). Images © Unilever/HUL.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
