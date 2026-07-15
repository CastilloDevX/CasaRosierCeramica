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

export default async function ExperienciaDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const item = await getExperienceRouteItem(Promise.resolve(resolvedParams), "private-booking");
  if (!item) {
    const legacySlug = await findLegacyExperienceSlug(resolvedParams.slug, "private-booking");
    if (legacySlug) redirect(`/experiencias/${legacySlug}`);
    notFound();
  }
  return <ExperienceDetailPage item={item} />;
}
