import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { HeaderHome } from "@/components/layout/HeaderHome";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { GiftCarousel } from "@/components/home/GiftCarousel";
import { IntroSlider } from "@/components/home/IntroSlider";
import { SocialGallery } from "@/components/home/SocialGallery";
import { TestimonialSlider } from "@/components/home/TestimonialSlider";
import { PromoEntry } from "@/components/ui/PromoEntry";
import { classes, giftCards, workshops } from "@/data/classes";

export const metadata: Metadata = {
  title: "Casa Rosier Cerámica",
  description: "Studio de ceramica en Barcelona"
};

export default function HomePage() {
  return (
    <>
      <PromoEntry />
      <HeaderHome />
      <main>
        <IntroSlider />
        <FeaturedSection
          id="clases-destacadas"
          title="Cursos y Talleres de Ceramica"
          subtitle="En Barcelona"
          items={classes}
          variant="classes"
        />
        <FeaturedSection
          id="workshops-destacados"
          title="Workshops de Especializacion"
          subtitle="En Barcelona"
          items={workshops}
          variant="workshops"
        />
        <section id="gift-card" className="gift section">
          <div className="container gift__container">
            <header className="gift__head">
              <h2 className="gift__title section-title">
                Experiencia en Ceramica
              </h2>
              <p className="gift__subtitle section-subtitle">
                Regala una Gift Card
              </p>
            </header>
            <GiftCarousel items={giftCards} />
          </div>
        </section>
        <SocialGallery />
        <TestimonialSlider />
      </main>
      <Footer />
    </>
  );
}
