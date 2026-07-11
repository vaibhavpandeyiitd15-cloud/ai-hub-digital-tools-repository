import { AI_HUB_SOURCE_URL } from "@/lib/content/ai-hub";
import { SITE_NAME, SITE_REGION } from "@/lib/content/desire-lab";

export const HUB_TRANSITION_SOURCE_URL = AI_HUB_SOURCE_URL;

export const hubTransitionContent = {
  title: "From Agile Innovation Hub to Desire Lab",
  subtitle: "Same mission — a clearer home for innovation tools",
  published: "15 January 2026",
  regions: SITE_REGION,

  intro: `Desire Lab is the next chapter of our digital innovation story. We started with the Agile Innovation Hub and AI Hub 2.0 — bringing analytics, AI-assisted workflows, and collaboration to teams in ${SITE_REGION}. Desire Lab keeps that foundation and organises it around how you actually work: Packaging Lab and Formulation Lab, with every tool still requestable and supported.`,

  legacy: {
    name: "AI Hub 2.0 · Agile Innovation Hub",
    tagline: "Powering HUL's next era of innovation",
    summary: `AI Hub 2.0 deepened insight, improved decision-making, and accelerated product development. Cross-functional agile squads, real-time consumer signals, and digital prototyping came together at our innovation campuses — starting with Mumbai and expanding capability to teams in Bangalore.`,
    highlights: [
      "Real-time consumer signals and market intelligence",
      "AI-assisted concept generation and rapid validation",
      "Digital modelling and cross-functional collaboration",
      "A single catalog of digital tools with POC support",
    ],
    image: "/assets/ai-hub/hero-collaboration.jpg",
    imageAlt: "Teams collaborating at an agile innovation event",
  },

  today: {
    name: SITE_NAME,
    tagline: "Every U does good — organised by lab",
    summary: `Desire Lab restructures the tool portfolio into two innovation branches. Packaging Lab covers packaging — insight, screening, prototyping, simulation, data capture, and project workflow. Formulation Lab for R&D formulation tools is coming soon. Legacy AI Hub tools carry forward where relevant — managed in the CMS, bookable as before.`,
    highlights: [
      "Packaging Lab — insight, screening, prototyping, simulation, data capture, workflow",
      "Formulation Lab — formulation R&D (coming soon)",
      "Desire Lab assistant with catalog-grounded answers",
      "Admin CMS for POCs, tools, and training requests",
    ],
    image: "/assets/ai-hub/innovation-workspace.jpg",
    imageAlt: "Innovation workspace at Unilever",
  },

  timeline: [
    {
      year: "2026",
      quarter: "Jan",
      title: "AI Hub 2.0 launches",
      body: "HUL announces AI Hub 2.0 — an agile innovation platform for faster insight-to-action, featured on HUL News.",
    },
    {
      year: "2026",
      quarter: "H1",
      title: "Digital tools catalog",
      body: "A flat tool guide goes live: discover tools, request training, and ask the assistant — serving Mumbai and Bangalore teams.",
    },
    {
      year: "2026",
      quarter: "Mid",
      title: "Desire Lab restructure",
      body: "The catalog evolves into Desire Lab — Packaging Lab and Formulation Lab with clearer navigation and room to grow.",
    },
    {
      year: "Today",
      quarter: "",
      title: "One home for innovation tools",
      body: "All existing tools remain. New sections and science capabilities are added through the CMS without losing history.",
    },
  ],

  continuity: `Nothing you relied on in the AI Hub catalog disappears. Tool pages, POC contacts, training requests, and the chatbot all carry forward — Desire Lab is an evolution in structure, not a reset of content.`,

  gallery: [
    {
      src: "/assets/ai-hub/hero-collaboration.jpg",
      alt: "Agile innovation collaboration",
      caption: "Agile Innovation Hub — cross-functional teams",
    },
    {
      src: "/assets/ai-hub/digital-innovation.jpg",
      alt: "Digital innovation",
      caption: "AI-assisted workflows",
    },
    {
      src: "/assets/ai-hub/mumbai-campus.jpg",
      alt: "Innovation campus",
      caption: `Innovation hubs · ${SITE_REGION}`,
    },
    {
      src: "/assets/ai-hub/innovation-workspace.jpg",
      alt: "Desire Lab workspace",
      caption: "Desire Lab — future-fit ecosystem",
    },
  ],
} as const;
