import { TestimonialSlider } from "@/components/home/TestimonialSlider";
import { NavbarGlobal } from "@/components/layout/NavbarGlobal";
import { IdeaPromptSection } from "@/features/shared/contextual-sections/IdeaPromptSection";
import { SitePage } from "@/features/shared/layout/SitePage";
import { StudioProfileBlock } from "@/features/studio/StudioProfileBlock";

export function StudioPage() {
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
          <StudioProfileBlock
            name="Rosa Guayanay"
            image="/img/social-1.jpg"
            intro="Soy Rosa Guayanay, ceramista peruana afincada en Barcelona. Aqui encontre no solo una ciudad que me inspira, sino tambien el lugar donde seguir explorando y expandiendo mi universo creativo."
          />
          <StudioProfileBlock
            name="Julio Andrade"
            image="/img/social-1.jpg"
            intro="Soy Julio Andrade, ceramista y acompanante de procesos en el taller. Aqui encontre un espacio para compartir tecnica, observacion y una manera cercana de trabajar con la materia."
          />
        </div>
      </section>
      <IdeaPromptSection context="studio" />
      <TestimonialSlider />
    </SitePage>
  );
}
