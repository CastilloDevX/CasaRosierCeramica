import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperienceDetailScreen } from "@/components/collections/ExperienceDetailScreen";
import { bySlug, workshops } from "@/data/classes";

export function generateStaticParams() {
  return workshops.map((item) => ({ slug: item.slug }));
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

export default async function WorkshopDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = bySlug((await params).slug);
  if (!item || item.kind !== "workshop") notFound();
  return <ExperienceDetailScreen item={item} />;
}
