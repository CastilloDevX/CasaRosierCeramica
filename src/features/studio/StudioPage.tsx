import { TestimonialSlider } from "@/components/home/TestimonialSlider";
import { NavbarGlobal } from "@/components/layout/NavbarGlobal";
import { IdeaPromptSection } from "@/features/shared/contextual-sections/IdeaPromptSection";
import { SitePage } from "@/features/shared/layout/SitePage";
import { StudioProfileBlock } from "@/features/studio/StudioProfileBlock";
import { getPublicTestimonials } from "@/lib/cms/public-content";
import { getTeachers } from "@/lib/cms/teachers";
import { assetPath } from "@/lib/assets";

export async function StudioPage() {
  const [cmsTestimonials, teachers] = await Promise.all([getPublicTestimonials(), getTeachers()]);
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

  return (
    <SitePage
      bodyClass="studio-page"
      header={
        <header className="studio-header">
          <NavbarGlobal />
        </header>
      }
    >
      <section
        className="studio-editorial-intro section is-visible"
        aria-labelledby="studio-lead-quote-title"
      >
        <div className="studio-editorial-intro__inner">
          <h2
            className="studio-editorial-intro__text reveal-text is-visible"
            id="studio-lead-quote-title"
          >
            <span className="reveal-line">
              <span className="reveal-line-inner">Somos lo</span>
            </span>
            <span className="reveal-line">
              <span className="reveal-line-inner">que somos y</span>
            </span>
            <span className="reveal-line">
              <span className="reveal-line-inner">aqui estamos</span>
            </span>
          </h2>
          <p className="studio-editorial-intro__eyebrow reveal-text is-visible">
            <span className="reveal-line">
              <span className="reveal-line-inner">En Barcelona</span>
            </span>
          </p>
          <p className="studio-editorial-intro__lede">
            Un espacio para aprender ceramica con calma, explorar tecnicas,
            tocar la materia y encontrar una practica guiada que acompana cada
            profe el primer gesto.
          </p>
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
      <IdeaPromptSection context="studio" />
      <TestimonialSlider testimonials={testimonials} />
    </SitePage>
  );
}
