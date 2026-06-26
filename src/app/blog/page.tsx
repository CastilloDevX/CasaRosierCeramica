import type { Metadata } from "next";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { FeaturedCarousel } from "@/components/blog/FeaturedCarousel";
import { SocialGallery } from "@/components/home/SocialGallery";
import { BodyClass } from "@/components/layout/BodyClass";
import { Footer } from "@/components/layout/Footer";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { categories, featured, published } from "@/data/blog";

export const metadata: Metadata = {
  title: { absolute: "Blog | Casa Rosier Ceramica" },
  description:
    "Articulos, procesos y reflexiones sobre ceramica, talleres, tecnicas y creacion en Casa Rosier Ceramica Barcelona."
};

export default function BlogPage() {
  return (
    <>
      <BodyClass className="blog-page" />
      <HeaderInterno className="blog-hero" />
      <main>
        <section className="blog-intro section">
          <div className="container blog-intro__container">
            <h2>Bitacora ceramica</h2>
            <p>
              Un espacio para compartir procesos, tecnicas, reflexiones y
              pequenas historias alrededor de la ceramica contemporanea, el
              taller y la creacion con las manos.
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
        <SocialGallery />
      </main>
      <Footer />
    </>
  );
}
