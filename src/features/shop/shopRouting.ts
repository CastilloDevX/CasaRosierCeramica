import type { Metadata } from "next";
import { bySlug, published } from "@/data/shop";

export function generateShopStaticParams() {
  return published.map((item) => ({ slug: item.slug }));
}

export async function generateShopItemMetadata(
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

export async function getShopRouteItem(params: Promise<{ slug: string }>) {
  return bySlug((await params).slug) ?? null;
}
