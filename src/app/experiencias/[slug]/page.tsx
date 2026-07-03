import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperienceDetailPage } from "@/features/experiences/ExperienceDetailPage";
import {
  generateExperienceMetadata,
  generateExperienceStaticParams,
  getExperienceRouteItem
} from "@/features/experiences/experienceDetailRouting";

export function generateStaticParams() {
  return generateExperienceStaticParams("private-booking");
}

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
  const item = await getExperienceRouteItem(params, "private-booking");
  if (!item) notFound();
  return <ExperienceDetailPage item={item} />;
}
