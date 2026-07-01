import { BlogGrid } from "@/components/blog/BlogGrid";
import { FeaturedCarousel } from "@/components/blog/FeaturedCarousel";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { IdeaPromptSection } from "@/features/shared/contextual-sections/IdeaPromptSection";
import { SitePage } from "@/features/shared/layout/SitePage";
import { getPublicBlogData } from "@/lib/cms/blog-public";

export async function BlogIndexPage() {
  const { categories, featured, published } = await getPublicBlogData();

  return (
    <SitePage
      bodyClass="blog-page"
      header={<HeaderInterno className="blog-hero" />}
    >
      <section className="blog-intro section">
        <div className="container blog-intro__container">
          <h2>Bitacora ceramica</h2>
          <p>
            Un espacio para compartir procesos, tecnicas, reflexiones y
            pequenas historias alrededor de la ceramica contemporanea, el taller
            y la creacion con las manos.
          </p>
        </div>
      </section>
      <section className="blog-featured section">
        <div className="container blog-featured__container">
          <h2 className="blog-featured__title">Destacados</h2>
          <FeaturedCarousel posts={featured} />
        </div>
      </section>
      <section className="blog-listing section">
        <div className="container blog-listing__container">
          <BlogGrid posts={published} categories={categories} />
        </div>
      </section>
      <IdeaPromptSection context="blog" />
    </SitePage>
  );
}
