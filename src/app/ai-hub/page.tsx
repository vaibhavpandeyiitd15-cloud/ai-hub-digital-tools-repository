import type { Metadata } from "next";
import { AiHubPageContent } from "@/components/ai-hub/AiHubPageContent";

export const metadata: Metadata = {
  title: "About AI Hub 2.0 | AI Hub Tool Guide",
  description:
    "Learn about AI Hub 2.0 at HUL Mumbai — advanced analytics, AI-assisted workflows, and innovation capabilities powering Unilever's next era of growth.",
};

export default function AiHubPage() {
  return <AiHubPageContent />;
}
