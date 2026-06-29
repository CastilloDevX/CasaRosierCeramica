import type { Metadata } from "next";
import {
  bySlug,
  classes,
  giftCards,
  privateExperiences,
  workshops
} from "@/data/classes";
import type { ExperienceItem, ExperienceKind } from "@/data/types";

const itemsByKind = {
  class: classes,
  workshop: workshops,
  "private-booking": privateExperiences,
  "gift-card": giftCards
} satisfies Record<ExperienceKind, readonly ExperienceItem[]>;

export function generateExperienceStaticParams(kind: ExperienceKind) {
  return itemsByKind[kind].map((item) => ({ slug: item.slug }));
}

export async function generateExperienceMetadata(
  params: Promise<{ slug: string }>
): Promise<Metadata> {
  const item = bySlug((await params).slug);
  return item
    ? {
        title: { absolute: item.seoTitle },
        description: item.seoDescription
      }
    : {};
}

export async function getExperienceRouteItem(
  params: Promise<{ slug: string }>,
  kind: ExperienceKind
) {
  const item = bySlug((await params).slug);
  return item?.kind === kind ? item : null;
}
