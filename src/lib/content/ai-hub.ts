export const AI_HUB_SOURCE_URL =
  "https://www.hul.co.in/news/news-search/2026/ai-hub-2-0-powering-huls-next-era-of-innovation/";

export const aiHubContent = {
  title: "AI Hub 2.0",
  subtitle: "Powering HUL's next era of innovation",
  published: "15 January 2026",
  location: "HUL Campus, Mumbai",

  intro: `AI Hub 2.0 marks a decisive step in strengthening how we innovate and how quickly we respond to the market. Designed to deepen insight, improve decision-making, and accelerate product development, the platform reflects our commitment to building a future-fit organisation powered by people and enhanced by technology.`,

  vision: `In a marketplace shaped by shifting consumer expectations, rapid category evolution, and intensifying competition, staying ahead requires the ability to anticipate change, shorten decision cycles, and turn insight into innovation with greater precision than ever before.`,

  investment: `Housed in the HUL Campus in Mumbai, AI Hub 2.0 brings together advanced analytics, AI-assisted workflows, and real-time collaboration tools to help teams work smarter and move faster.`,

  capabilities: [
    {
      title: "Real-time consumer signals",
      description:
        "Identify emerging needs and behavioural shifts from consumers and the market as they happen.",
      icon: "signal",
    },
    {
      title: "AI-assisted concept generation",
      description:
        "Explore scenarios, test hypotheses, and highlight whitespace with greater clarity.",
      icon: "sparkles",
    },
    {
      title: "Rapid consumer validation",
      description:
        "Refine ideas at scale before significant investment through early validation.",
      icon: "users",
    },
    {
      title: "Digital modelling & prototyping",
      description:
        "Compress development timelines with high-fidelity modelling and quick-turn prototypes.",
      icon: "layers",
    },
  ],

  pillars: [
    {
      heading: "Elevate decision-making",
      body: `Modern product development requires more data, faster iteration, and earlier validation. AI Hub 2.0 integrates these capabilities into everyday workflows — helping teams move from insight to action with confidence.`,
      image: "/assets/ai-hub/hero-collaboration.jpg",
      imageAlt: "Teams collaborating at an innovation event at HUL",
    },
    {
      heading: "Respond to the market",
      body: `Digital capabilities amplify operational excellence. With faster feedback loops and more reliable modelling of consumer behaviour, we strengthen forecasting, minimise iterations, and bring winning products to market with greater efficiency.`,
      image: "/assets/ai-hub/innovation-workspace.jpg",
      imageAlt: "Innovation workspace at HUL Mumbai campus",
    },
    {
      heading: "Technology that amplifies people",
      body: `While technology accelerates workflows, the true edge comes from people. AI Hub 2.0 gives teams room to think bigger, experiment more confidently, and collaborate without silos — human capability strengthened by digital intelligence.`,
      image: "/assets/ai-hub/digital-innovation.jpg",
      imageAlt: "Digital innovation and technology at HUL",
    },
  ],

  campus: {
    heading: "Mumbai — central node of innovation",
    body: `The Mumbai AI Hub is a central node in our capability-building journey. As markets shift, our teams are equipped to respond proactively — guided by sharper insight and supported by tools that make decision-making more robust.`,
    image: "/assets/ai-hub/mumbai-campus.jpg",
    imageAlt: "HUL R&D and innovation campus, Mumbai, India",
  },

  closing: `AI Hub 2.0 is one step in our journey toward digital-led growth — a platform designed to accelerate our pace, sharpen our insights, and expand what teams can achieve. Faster, smarter, and more connected than ever before.`,
};

export const aiHubImages = [
  {
    src: "/assets/ai-hub/hero-collaboration.jpg",
    alt: "Collaboration at AI Hub — Agile innovation day",
    caption: "Cross-functional collaboration",
  },
  {
    src: "/assets/ai-hub/innovation-workspace.jpg",
    alt: "Innovation workspace",
    caption: "Future-fit innovation ecosystem",
  },
  {
    src: "/assets/ai-hub/digital-innovation.jpg",
    alt: "Digital tools and analytics",
    caption: "AI-assisted workflows",
  },
  {
    src: "/assets/ai-hub/mumbai-campus.jpg",
    alt: "HUL Mumbai campus",
    caption: "HUL Campus, Mumbai",
  },
] as const;
