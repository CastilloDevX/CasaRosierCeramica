import { FeaturedSection } from "@/components/home/FeaturedSection";
import { IntroSlider } from "@/components/home/IntroSlider";
import { HeaderHome } from "@/components/layout/HeaderHome";
import { PromoEntry } from "@/components/ui/PromoEntry";
import { TestimonialSlider } from "@/components/home/TestimonialSlider";
import { classes, giftCards, workshops } from "@/data/classes";
import { HomeGiftCardSection } from "@/features/home/HomeGiftCardSection";
import { IdeaPromptSection } from "@/features/shared/contextual-sections/IdeaPromptSection";
import { SitePage } from "@/features/shared/layout/SitePage";

export function HomePage() {
  return (
    <SitePage
      bodyClass=""
      beforeHeader={<PromoEntry />}
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
      <TestimonialSlider />
    </SitePage>
  );
}
