import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperienceDetailScreen } from "@/components/collections/ExperienceDetailScreen";
import { bySlug, classes } from "@/data/classes";

export function generateStaticParams() {
  return classes.map((item) => ({ slug: item.slug }));
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

export default async function ClassDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = bySlug((await params).slug);
  if (!item || item.kind !== "class") notFound();
  return <ExperienceDetailScreen item={item} />;
}
