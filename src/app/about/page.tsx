import { HubTransitionPageContent } from "@/components/about/HubTransitionPageContent";
import { SITE_NAME } from "@/lib/content/desire-lab";

export const metadata = {
  title: `Our journey | ${SITE_NAME}`,
  description:
    "How Desire Lab evolved from the Agile Innovation Hub and AI Hub 2.0 — same tools, organised for Pack Lab and Formulation Lab in Mumbai and Bangalore.",
};

export default function AboutPage() {
  return <HubTransitionPageContent />;
}
