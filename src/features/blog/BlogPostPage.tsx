import { BlogDetail } from "@/components/blog/BlogDetail";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import type { BlogPost } from "@/data/types";
import { IdeaPromptSection } from "@/features/shared/contextual-sections/IdeaPromptSection";
import { SitePage } from "@/features/shared/layout/SitePage";
import { getBlogNeighbors, getPublicBlogData, getRelatedBlogPosts } from "@/lib/cms/blog-public";
import { formatDate } from "@/lib/utils";

export async function BlogPostPage({ post }: { post: BlogPost }) {
  const { published } = await getPublicBlogData();
  const adjacent = getBlogNeighbors(published, post);
  const relatedPosts = getRelatedBlogPosts(published, post, 3);

  return (
    <SitePage
      bodyClass="blog-post-page"
      header={
        <HeaderInterno
          image={post.coverImage}
          height="small"
          overlayTitle
          className="blog-hero"
        >
          <>
            <p className="blog-post-hero__category">{post.category}</p>
            <h1 className="page-hero__title blog-hero__title">
              {post.title}
            </h1>
            <p className="blog-post-hero__meta">
              {post.author} · {formatDate(post.publishedAt)}
            </p>
          </>
        </HeaderInterno>
      }
    >
      <BlogDetail post={post} adjacent={adjacent} relatedPosts={relatedPosts} />
      <IdeaPromptSection context="blog-post" />
    </SitePage>
  );
}
