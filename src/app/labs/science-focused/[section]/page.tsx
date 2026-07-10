import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ section: string }>;
};

export default async function ScienceSectionRedirect({ params }: PageProps) {
  const { section } = await params;
  redirect(`/labs/formulation-lab?from=${section}`);
}
