import { FeaturedSection } from "@/components/home/FeaturedSection";
import { IntroSlider } from "@/components/home/IntroSlider";
import { HeaderHome } from "@/components/layout/HeaderHome";
import { PromoEntry } from "@/components/ui/PromoEntry";
import { TestimonialSlider } from "@/components/home/TestimonialSlider";
import type { GiftCardItem } from "@/data/types";
import { getPublicExperienceItems } from "@/features/experiences/experienceDetailRouting";
import { HomeGiftCardSection } from "@/features/home/HomeGiftCardSection";
import { IdeaPromptSection } from "@/features/shared/contextual-sections/IdeaPromptSection";
import { SitePage } from "@/features/shared/layout/SitePage";
import { getPublicHomeContent } from "@/lib/cms/public-content";

export async function HomePage() {
  const [{ promoBanner, testimonials: cmsTestimonials }, experienceItems] = await Promise.all([
    getPublicHomeContent(),
    getPublicExperienceItems(),
  ]);
  const classes = experienceItems.filter((item) => item.kind === "class");
  const workshops = experienceItems.filter((item) => item.kind === "workshop");
  const giftCards = experienceItems.filter((item): item is GiftCardItem => item.kind === "gift-card");
  const testimonials = cmsTestimonials
    .map((item) => ({
      image: item.avatar_id || "/img/avatar-1.jpg",
      alt: `Foto de ${item.name}`,
      quote: item.text,
      author: item.role ? `${item.name} — ${item.role}` : item.name,
    }));

  return (
    <SitePage
      bodyClass=""
      beforeHeader={
        <PromoEntry
          promo={promoBanner ? {
            keyText: promoBanner.key_text || "Plazas limitadas",
            title: promoBanner.title,
            text: promoBanner.text || "Ven a probar el torno, tocar la arcilla y crear una pieza en el taller.",
            detailText: promoBanner.detail_text || "No necesitas experiencia previa. Solo ganas de venir al taller y probar algo distinto.",
            imageUrl: promoBanner.image_url || "/img/1766778567125-t8t5rt.png",
            buttonText: promoBanner.button_text || "Reservar plaza",
            href: promoBanner.link_url || "/clases",
          } : null}
        />
      }
      header={<HeaderHome />}
    >
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
      <HomeGiftCardSection items={giftCards} />
      <IdeaPromptSection context="home" />
      <TestimonialSlider testimonials={testimonials} />
    </SitePage>
  );
}
