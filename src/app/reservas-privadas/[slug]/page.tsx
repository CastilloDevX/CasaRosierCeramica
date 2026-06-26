import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperienceDetailScreen } from "@/components/collections/ExperienceDetailScreen";
import { bySlug, privateExperiences } from "@/data/classes";

export function generateStaticParams() {
  return privateExperiences.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = bySlug((await params).slug);
  return item
    ? {
        title: { absolute: item.seoTitle },
        description: item.seoDescription
      }
    : {};
}

export default async function PrivateExperienceDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = bySlug((await params).slug);
  if (!item || item.kind !== "private-booking") notFound();
  return <ExperienceDetailScreen item={item} />;
}
