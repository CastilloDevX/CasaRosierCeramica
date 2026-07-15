import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ShopItemPage as ShopItemScreen } from "@/features/shop/ShopItemPage";
import {
  generateShopItemMetadata,
  generateShopStaticParams,
  findLegacyShopSlug,
  getShopRouteItem
} from "@/features/shop/shopRouting";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return generateShopStaticParams();
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return generateShopItemMetadata(params);
}

export default async function ShopDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const item = await getShopRouteItem(Promise.resolve(resolvedParams));
  if (!item) {
    const legacySlug = await findLegacyShopSlug(resolvedParams.slug);
    if (legacySlug) redirect(`/shop/${legacySlug}`);
    notFound();
  }
  return <ShopItemScreen item={item} />;
}
