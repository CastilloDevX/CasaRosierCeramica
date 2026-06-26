import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { HeaderHome } from "@/components/layout/HeaderHome";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { IntroSlider } from "@/components/home/IntroSlider";
import { SocialGallery } from "@/components/home/SocialGallery";
import { TestimonialSlider } from "@/components/home/TestimonialSlider";
import { PromoEntry } from "@/components/ui/PromoEntry";
import { classes, giftCards, workshops } from "@/data/classes";

export const metadata: Metadata = {
  title: "Casa Rosier",
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
            <div className="gift__grid">
              <FeaturedSectionCards />
            </div>
          </div>
        </section>
        <SocialGallery />
        <TestimonialSlider />
      </main>
      <Footer socialTrack />
    </>
  );
}

function FeaturedSectionCards() {
  return giftCards.map((item) => (
    <article className="content-card gift-card-item" key={item.id}>
      <a className="content-card__media" href={`/gift-card/${item.slug}`}>
        <img src={item.slug === "beginner-class" ? "/img/gift-1.jpg" : "/img/workshop-2.jpg"} alt={item.title} />
      </a>
      <div className="content-card__body">
        <p className="content-card__meta">{item.category}</p>
        <h3 className="content-card__title">{item.title}</h3>
        <p className="content-card__excerpt">{item.excerpt}</p>
        <a className="content-card__cta" href={`/gift-card/${item.slug}`}>
          leer mas
        </a>
      </div>
    </article>
  ));
}
