import { notFound, redirect } from "next/navigation";
import { PackLabToolPageContent } from "@/components/labs/PackLabToolPageContent";
import type { PackSectionSlug } from "@/lib/content/desire-lab";
import { getPackSection, SITE_NAME } from "@/lib/content/desire-lab";
import { packLabToolStaticParams } from "@/lib/content/pack-lab-tools";
import { getPackLabToolDetail } from "@/lib/tools";

type PageProps = {
  params: Promise<{ section: string; tool: string }>;
};

export function generateStaticParams() {
  return packLabToolStaticParams;
}

export async function generateMetadata({ params }: PageProps) {
  const { section, tool } = await params;
  const detail = await getPackLabToolDetail(section as PackSectionSlug, tool);
  const sectionConfig = getPackSection(section);

  return {
    title: detail
      ? `${detail.name} | ${sectionConfig?.name ?? "Pack Lab"} | ${SITE_NAME}`
      : `Pack Lab | ${SITE_NAME}`,
  };
}

export default async function PackLabToolPage({ params }: PageProps) {
  const { section, tool } = await params;
  if (section === "workflow-dashboard") {
    redirect("/labs/pack-lab/workflow");
  }
  const sectionConfig = getPackSection(section);
  if (!sectionConfig) notFound();

  const detail = await getPackLabToolDetail(section as PackSectionSlug, tool);
  if (!detail) notFound();

  return <PackLabToolPageContent tool={detail} />;
}
