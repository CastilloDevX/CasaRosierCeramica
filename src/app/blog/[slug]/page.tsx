import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetail } from "@/components/blog/BlogDetail";
import { SocialGallery } from "@/components/home/SocialGallery";
import { BodyClass } from "@/components/layout/BodyClass";
import { Footer } from "@/components/layout/Footer";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { bySlug, published } from "@/data/blog";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return published.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = bySlug((await params).slug);
  return post
    ? {
        title: { absolute: post.seoTitle },
        description: post.seoDescription
      }
    : {};
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = bySlug((await params).slug);
  if (!post) notFound();

  return (
    <>
      <BodyClass className="blog-post-page" />
      <HeaderInterno
        image={post.coverImage}
        height="small"
        overlayTitle
        className="blog-hero"
      >
        <>
          <p className="blog-post-hero__category">{post.category}</p>
          <h1 className="page-hero__title blog-hero__title">{post.title}</h1>
          <p className="blog-post-hero__meta">
            {post.author} · {formatDate(post.publishedAt)}
          </p>
        </>
      </HeaderInterno>
      <main>
        <BlogDetail post={post} />
        <SocialGallery />
      </main>
      <Footer />
    </>
  );
}
