import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ExperienceDetailPage } from "@/features/experiences/ExperienceDetailPage";
import {
  generateExperienceMetadata,
  findLegacyExperienceSlug,
  getExperienceRouteItem
} from "@/features/experiences/experienceDetailRouting";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return generateExperienceMetadata(params);
}

export default async function ClassDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const item = await getExperienceRouteItem(Promise.resolve(resolvedParams), "class");
  if (!item) {
    const legacySlug = await findLegacyExperienceSlug(resolvedParams.slug, "class");
    if (legacySlug) redirect(`/clases/${legacySlug}`);
    notFound();
  }
  return <ExperienceDetailPage item={item} />;
}
