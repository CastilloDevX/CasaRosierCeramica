import Image from "next/image";
import { BlogDetail } from "@/components/blog/BlogDetail";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import type { BlogPost } from "@/data/types";
import { IdeaPromptSection } from "@/features/shared/contextual-sections/IdeaPromptSection";
import { SitePage } from "@/features/shared/layout/SitePage";
import { getBlogNeighbors, getPublicBlogData, getRelatedBlogPosts } from "@/lib/cms/blog-public";
import { formatDate } from "@/lib/utils";

export async function BlogPostPage({ post }: { post: BlogPost }) {
  const { published } = await getPublicBlogData();
  const adjacent = getBlogNeighbors(published, post);
  const relatedPosts = getRelatedBlogPosts(published, post, 3);
  const hero = post.hero;
  const heroVariant = hero?.heroVariant ?? "image";

  return (
    <SitePage
      bodyClass="blog-post-page"
      header={
        <HeaderInterno
          variant={heroVariant}
          image={hero?.heroImage || post.coverImage}
          height="small"
          overlayTitle
          heroMenuTone={hero?.heroMenuTone}
          heroMenuColor={hero?.heroMenuColor}
          heroMenuScale={hero?.heroMenuScale}
          heroLogoPositionX={hero?.heroLogoPositionX}
          heroLogoPositionY={hero?.heroLogoPositionY}
          heroLogoWidth={hero?.heroLogoWidth}
          heroLogoTabletPositionX={hero?.heroLogoTabletPositionX}
          heroLogoTabletPositionY={hero?.heroLogoTabletPositionY}
          heroLogoTabletWidth={hero?.heroLogoTabletWidth}
          heroLogoMobilePositionX={hero?.heroLogoMobilePositionX}
          heroLogoMobilePositionY={hero?.heroLogoMobilePositionY}
          heroLogoMobileWidth={hero?.heroLogoMobileWidth}
          heroMenuPositionY={hero?.heroMenuPositionY}
          heroMenuTabletPositionY={hero?.heroMenuTabletPositionY}
          heroMenuMobilePositionY={hero?.heroMenuMobilePositionY}
          className="blog-hero"
        >
          {heroVariant === "presentation" ? (
            <div className="page-hero__presentation">
              <div className="page-hero__presentation-text" style={{ color: hero?.heroPresentationTextColor || "#FFFFFF" }}>
                <MarkdownContent source={hero?.heroPresentationText || post.title} className="page-hero__presentation-copy" />
              </div>
              {hero?.heroPresentationImage ? (
                <div className="page-hero__presentation-image">
                  <Image src={hero.heroPresentationImage} alt={hero.heroTitle || post.title} fill sizes="420px" className="object-contain" unoptimized />
                </div>
              ) : null}
            </div>
          ) : (
            <>
            <p className="blog-post-hero__category">{post.category}</p>
            <h1 className="page-hero__title blog-hero__title">
              {hero?.heroTitle || post.title}
            </h1>
            <p className="blog-post-hero__meta">
              {post.author} · {formatDate(post.publishedAt)}
            </p>
            </>
          )}
        </HeaderInterno>
      }
    >
      <BlogDetail post={post} adjacent={adjacent} relatedPosts={relatedPosts} />
      <IdeaPromptSection context="blog-post" />
    </SitePage>
  );
}
