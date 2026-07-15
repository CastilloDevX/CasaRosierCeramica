import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { SocialGallery } from "@/components/home/SocialGallery";
import { getPublicSocialGallery } from "@/lib/cms/public-content";

export default async function NotFoundPage() {
  const gallery = await getPublicSocialGallery();
  const posts = gallery?.items
    .filter((item) => item.is_visible !== false && item.image_url)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      image: item.image_url,
      title: item.title,
      body: item.description,
      instagramUrl: item.instagram_url,
    }));

  return (
    <>
      <main className="not-found-page">
        <HeaderInterno
          variant="text"
          height="large"
          className="not-found-header"
          heroMenuTone="dark"
        >
          <div className="not-found-hero__copy">
            <h1 className="not-found-hero__title">404</h1>
            <h2 className="not-found-hero__subtitle">
              Pagina no encontrada
            </h2>
            <p className="not-found-hero__text">
              La pagina que buscas no esta disponible o cambio de direccion.
            </p>
            <Link className="not-found-hero__button" href="/">
              Volver al inicio
            </Link>
          </div>
        </HeaderInterno>

        <SocialGallery
          title="GALERIA SOCIAL"
          subtitle={gallery?.description || "siguenos en instagram - @casarosier"}
          posts={posts?.length ? posts : undefined}
          sourceHref={gallery?.cta_url || undefined}
        />
      </main>
      <Footer />
    </>
  );
}
