export type ChatPrompt = {
  label: string;
  prompt: string;
};

type PromptContext = {
  id: string;
  match: (pathname: string) => boolean;
  prompts: ChatPrompt[];
};

const contexts: PromptContext[] = [
  {
    id: "pack-lab-tool-convotrack",
    match: (p) => p.includes("/pack-lab/insight/convotrack"),
    prompts: [
      { label: "What is Convotrack?", prompt: "What is Convotrack and when should I use it for packaging insight?" },
      { label: "Video social trends", prompt: "How can Convotrack help me find packaging trends from social video?" },
      { label: "Request training", prompt: "How do I request training for Convotrack?" },
    ],
  },
  {
    id: "pack-lab-tool-vurvey",
    match: (p) => p.includes("/pack-lab/insight/vurvey"),
    prompts: [
      { label: "What is Vurvey?", prompt: "What is Vurvey and how does it support packaging research?" },
      { label: "Video surveys", prompt: "How do Vurvey video surveys work for concept testing?" },
      { label: "POC contact", prompt: "Who is the POC for Vurvey?" },
    ],
  },
  {
    id: "pack-lab-insight",
    match: (p) => p === "/labs/pack-lab/insight" || p.startsWith("/labs/pack-lab/insight/"),
    prompts: [
      { label: "Insight tools", prompt: "Which Pack Lab insight tools are available and what are they for?" },
      { label: "Convotrack vs Vurvey", prompt: "When should I use Convotrack versus Vurvey?" },
      { label: "Start a project", prompt: "How do I start a new packaging project in Pack Lab?" },
    ],
  },
  {
    id: "pack-lab-tool-boltchat",
    match: (p) => p.includes("/pack-lab/screening/boltchat-ai"),
    prompts: [
      { label: "What is Boltchat?", prompt: "What is Boltchat and how does it support packaging screening?" },
      { label: "Qual at scale", prompt: "How fast can Boltchat deliver qualitative insights?" },
      { label: "Use cases", prompt: "What packaging screening use cases suit Boltchat?" },
    ],
  },
  {
    id: "pack-lab-tool-pactinstant",
    match: (p) => p.includes("/pack-lab/screening/pactinstant-ai"),
    prompts: [
      { label: "PactInstant AI", prompt: "What is PactInstant AI and how does pack benchmarking work?" },
      { label: "Shelf simulation", prompt: "How does PactInstant AI use virtual shelf testing?" },
      { label: "vs full PACT", prompt: "When should I use PactInstant AI versus full pack validation?" },
    ],
  },
  {
    id: "pack-lab-screening",
    match: (p) => p === "/labs/pack-lab/screening" || p.startsWith("/labs/pack-lab/screening/"),
    prompts: [
      { label: "Screening tools", prompt: "Which Pack Lab screening tools should I use first?" },
      { label: "Early concepts", prompt: "How do I screen early packaging concepts quickly?" },
      { label: "Boltchat vs PactInstant", prompt: "Compare Boltchat and PactInstant AI for my project." },
    ],
  },
  {
    id: "pack-lab-tool-kaedim",
    match: (p) => p.includes("/pack-lab/prototyping/kaedim"),
    prompts: [
      { label: "What is Kaedim?", prompt: "What is Kaedim and how do I turn pack images into 3D models?" },
      { label: "Export formats", prompt: "What file formats does Kaedim export for packaging CAD?" },
      { label: "Workflow fit", prompt: "Where does Kaedim fit in the Pack Lab prototyping workflow?" },
    ],
  },
  {
    id: "pack-lab-prototyping",
    match: (p) => p === "/labs/pack-lab/prototyping" || p.startsWith("/labs/pack-lab/prototyping/"),
    prompts: [
      { label: "Prototyping tools", prompt: "What prototyping tools are in Pack Lab?" },
      { label: "Image to 3D", prompt: "How can I prototype packaging from reference images?" },
      { label: "After screening", prompt: "What should I do after screening before simulation?" },
    ],
  },
  {
    id: "pack-lab-tool-fea",
    match: (p) => p.includes("/pack-lab/simulation/3dx-fea-simulator"),
    prompts: [
      { label: "3DX FEA Simulator", prompt: "What is the 3DX FEA Simulator used for in packaging?" },
      { label: "Drop & top load", prompt: "Can I simulate drop tests and top load on pack designs?" },
      { label: "Before physical tests", prompt: "When should I run FEA before physical pack testing?" },
    ],
  },
  {
    id: "pack-lab-simulation",
    match: (p) => p === "/labs/pack-lab/simulation" || p.startsWith("/labs/pack-lab/simulation/"),
    prompts: [
      { label: "Simulation tools", prompt: "What simulation capabilities exist in Pack Lab?" },
      { label: "Structural performance", prompt: "How do I validate pack structural performance virtually?" },
      { label: "Prototype to simulate", prompt: "How do I move from Kaedim prototypes to simulation?" },
    ],
  },
  {
    id: "pack-lab-data-capture",
    match: (p) => p === "/labs/pack-lab/data-capture" || p.startsWith("/labs/pack-lab/data-capture/"),
    prompts: [
      { label: "ELN vs LIMS", prompt: "What is the difference between ELN and LIMS in Pack Lab?" },
      { label: "Experiment logging", prompt: "How should packaging teams capture lab experiments digitally?" },
      { label: "Sample tracking", prompt: "How does LIMS support packaging sample and QC tracking?" },
    ],
  },
  {
    id: "pack-lab-workflow",
    match: (p) => p === "/labs/pack-lab/workflow" || p.startsWith("/labs/pack-lab/workflow"),
    prompts: [
      { label: "Project steps", prompt: "Walk me through the Pack Lab packaging project workflow." },
      { label: "Tools per stage", prompt: "Which tools should I use at each stage of a packaging project?" },
      { label: "Dashboard tool", prompt: "Tell me about the packaging project management workflow tool." },
    ],
  },
  {
    id: "pack-lab",
    match: (p) => p === "/labs/pack-lab" || p.startsWith("/labs/pack-lab/"),
    prompts: [
      { label: "Start a project", prompt: "How do I start a new packaging project in Pack Lab?" },
      { label: "All sections", prompt: "What are the Pack Lab sections and which tools are in each?" },
      { label: "Insight to delivery", prompt: "What is the end-to-end Pack Lab journey from insight to handoff?" },
    ],
  },
  {
    id: "formulation-lab",
    match: (p) => p.startsWith("/labs/formulation-lab"),
    prompts: [
      { label: "Coming soon", prompt: "What will Formulation Lab include when it launches?" },
      { label: "Pack vs formulation", prompt: "What is the difference between Pack Lab and Formulation Lab?" },
      { label: "Pack Lab tools", prompt: "Which Pack Lab tools are available now for packaging work?" },
    ],
  },
  {
    id: "about",
    match: (p) => p === "/about" || p.startsWith("/about/"),
    prompts: [
      { label: "Desire Lab journey", prompt: "How did Desire Lab evolve from AI Hub 2.0?" },
      { label: "Pack Lab structure", prompt: "How is Pack Lab organised today?" },
      { label: "Available tools", prompt: "What tools are currently available in Desire Lab?" },
    ],
  },
  {
    id: "home",
    match: (p) => p === "/",
    prompts: [
      { label: "Choose a lab", prompt: "Should I use Pack Lab or Formulation Lab for my work?" },
      { label: "Pack Lab overview", prompt: "Give me an overview of Pack Lab sections and tools." },
      { label: "Request training", prompt: "How do I request training for a Desire Lab tool?" },
    ],
  },
];

const defaultPrompts: ChatPrompt[] = [
  { label: "Pack Lab tools", prompt: "What tools are available in Pack Lab?" },
  { label: "Find a tool", prompt: "Help me find the right tool for packaging consumer insight." },
  { label: "Training request", prompt: "How do I book a training session for a tool?" },
];

export function getChatPromptsForPath(pathname: string): ChatPrompt[] {
  const normalized = pathname.split("?")[0] ?? pathname;
  for (const context of contexts) {
    if (context.match(normalized)) {
      return context.prompts;
    }
  }
  return defaultPrompts;
}

export function getChatWelcomeForPath(pathname: string): string {
  const normalized = pathname.split("?")[0] ?? pathname;
  if (normalized.startsWith("/labs/pack-lab/workflow")) {
    return "Hi! I can help you navigate the packaging project workflow and recommend tools for each stage.";
  }
  if (normalized.startsWith("/labs/pack-lab")) {
    return "Hi! Ask me about Pack Lab tools, sections, or how to start a new packaging project.";
  }
  if (normalized.startsWith("/labs/formulation-lab")) {
    return "Hi! Formulation Lab is coming soon — I can still help with Pack Lab tools and the Desire Lab catalog.";
  }
  if (normalized === "/about") {
    return "Hi! Ask me about Desire Lab's journey from AI Hub 2.0 or the current lab structure.";
  }
  return "Hi! I'm the Desire Lab assistant. Ask me about tools in Pack Lab or Formulation Lab — I'll cite the relevant tool pages.";
}
