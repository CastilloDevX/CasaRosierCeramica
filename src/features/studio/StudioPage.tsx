import Image from "next/image";
import { TestimonialSlider } from "@/components/home/TestimonialSlider";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { IdeaPromptSection } from "@/features/shared/contextual-sections/IdeaPromptSection";
import { SitePage } from "@/features/shared/layout/SitePage";
import { StudioProfileBlock } from "@/features/studio/StudioProfileBlock";
import { getPublicTestimonials } from "@/lib/cms/public-content";
import { getStudioPageSettings } from "@/lib/cms/studio-page";
import { getTeachers } from "@/lib/cms/teachers";
import { assetPath } from "@/lib/assets";

export async function StudioPage() {
  const [cmsTestimonials, teachers, pageSettings] = await Promise.all([
    getPublicTestimonials(),
    getTeachers(),
    getStudioPageSettings(),
  ]);
  const testimonials = cmsTestimonials
    .map((item) => ({
      image: item.avatar_id || "/img/avatar-1.jpg",
      alt: `Foto de ${item.name}`,
      quote: item.text,
      author: item.role ? `${item.name} — ${item.role}` : item.name,
    }));
  const specialists = teachers
    .filter((teacher) => teacher.status === "published" && teacher.deleted_at === null)
    .sort((a, b) => a.sort_order - b.sort_order);
  const hero = pageSettings.hero;

  return (
    <SitePage
      bodyClass="studio-page"
      header={
        <HeaderInterno
          variant={hero.heroVariant}
          image={hero.heroImage}
          height="large"
          overlayTitle
          heroMenuTone={hero.heroMenuTone}
          heroMenuColor={hero.heroMenuColor}
          heroMenuScale={hero.heroMenuScale}
          heroLogoPositionX={hero.heroLogoPositionX}
          heroLogoPositionY={hero.heroLogoPositionY}
          heroLogoWidth={hero.heroLogoWidth}
          heroLogoTabletPositionX={hero.heroLogoTabletPositionX}
          heroLogoTabletPositionY={hero.heroLogoTabletPositionY}
          heroLogoTabletWidth={hero.heroLogoTabletWidth}
          heroLogoMobilePositionX={hero.heroLogoMobilePositionX}
          heroLogoMobilePositionY={hero.heroLogoMobilePositionY}
          heroLogoMobileWidth={hero.heroLogoMobileWidth}
          heroMenuPositionY={hero.heroMenuPositionY}
          heroMenuTabletPositionY={hero.heroMenuTabletPositionY}
          heroMenuMobilePositionY={hero.heroMenuMobilePositionY}
        >
          {hero.heroVariant === "presentation" ? (
            <div className="page-hero__presentation">
              <div className="page-hero__presentation-text" style={{ color: hero.heroPresentationTextColor || "#FFFFFF" }}>
                <MarkdownContent source={hero.heroPresentationText || hero.heroTitle || "El Estudio"} className="page-hero__presentation-copy" />
              </div>
              {hero.heroPresentationImage ? (
                <div className="page-hero__presentation-image">
                  <Image src={hero.heroPresentationImage} alt={hero.heroTitle || "El Estudio"} fill sizes="420px" className="object-contain" unoptimized />
                </div>
              ) : null}
            </div>
          ) : hero.heroVariant === "image" ? (
            <div className="page-hero__script-stack">
              {hero.titleImage ? (
                <Image src={hero.titleImage} alt={hero.heroTitle || "El Estudio"} fill sizes="520px" className="page-hero__script-image page-hero__script-image--back" unoptimized />
              ) : null}
              {hero.titleImageSecondary ? (
                <Image src={hero.titleImageSecondary} alt={hero.heroTitle || "El Estudio"} fill sizes="520px" className="page-hero__script-image page-hero__script-image--front" unoptimized />
              ) : null}
            </div>
          ) : (
            <div>
              <h1 className="page-hero__title">{hero.heroTitle || "El Estudio"}</h1>
              {hero.heroSubtitle ? <p className="page-hero__eyebrow">{hero.heroSubtitle}</p> : null}
            </div>
          )}
        </HeaderInterno>
      }
    >
      <section
        className="studio-editorial-intro section is-visible"
        aria-label="Introducción del estudio"
      >
        <div className="studio-editorial-intro__inner">
          <MarkdownContent className="studio-editorial-intro__lede" source={pageSettings.introContent} />
        </div>
      </section>
      <section
        className="studio-narrative section"
        aria-label="Equipo del estudio"
      >
        <div className="container studio-narrative__container">
          {specialists.map((specialist) => (
            <StudioProfileBlock
              key={specialist.id}
              name={specialist.name}
              role={specialist.specialty}
              image={assetPath(specialist.image_id || "/img/social-1.jpg")}
              intro={specialist.bio}
            />
          ))}
        </div>
      </section>
      {pageSettings.showIdeaPromptSection ? <IdeaPromptSection context="studio" /> : null}
      <TestimonialSlider testimonials={testimonials} />
    </SitePage>
  );
}
