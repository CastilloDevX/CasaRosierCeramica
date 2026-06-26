import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BodyClass } from "@/components/layout/BodyClass";
import { Footer } from "@/components/layout/Footer";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { ShopDetail } from "@/components/shop/ShopDetail";
import { bySlug, published } from "@/data/shop";

export function generateStaticParams() {
  return published.map((item) => ({ slug: item.slug }));
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

export default async function ShopDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = bySlug((await params).slug);
  if (!item) notFound();
  return (
    <>
      <BodyClass className="shop-detail-page" />
      <HeaderInterno
        image={item.image}
        eyebrow={item.categoryLabel}
        title={item.name}
      />
      <main>
        <ShopDetail item={item} />
      </main>
      <Footer />
    </>
  );
}
