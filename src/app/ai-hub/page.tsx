import { redirect } from "next/navigation";

/** Legacy URL — AI Hub about page now lives at /about */
export default function LegacyAiHubPage() {
  redirect("/about");
}
