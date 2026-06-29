import type { Metadata } from "next";
import { bySlug, published } from "@/data/blog";

export function generateBlogStaticParams() {
  return published.map((post) => ({ slug: post.slug }));
}

export async function generateBlogPostMetadata(
  params: Promise<{ slug: string }>
): Promise<Metadata> {
  const post = bySlug((await params).slug);
  return post
    ? {
        title: { absolute: post.seoTitle },
        description: post.seoDescription
      }
    : {};
}

export async function getBlogPostRouteItem(params: Promise<{ slug: string }>) {
  return bySlug((await params).slug) ?? null;
}
