import type { Metadata } from "next";
import { SocialGallery } from "@/components/home/SocialGallery";
import { TestimonialSlider } from "@/components/home/TestimonialSlider";
import { BodyClass } from "@/components/layout/BodyClass";
import { Footer } from "@/components/layout/Footer";
import { NavbarGlobal } from "@/components/layout/NavbarGlobal";

export const metadata: Metadata = {
  title: { absolute: "El estudio | Casa Rosier Ceramica" },
  description:
    "Conoce el estudio de ceramica Casa Rosier en Barcelona: un espacio para aprender, practicar y desarrollar proyectos con arcilla, torno, modelado y esmaltes."
};

export default function StudioPage() {
  return (
    <>
      <BodyClass className="studio-page" />
      <header className="studio-header">
        <NavbarGlobal />
      </header>
      <main>
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
                <span className="reveal-line-inner">
                  Somos lo
                </span>
              </span>
              <span className="reveal-line">
                <span className="reveal-line-inner">
                  que somos y
                </span>
              </span>
              <span className="reveal-line">
                <span className="reveal-line-inner">
                  aqui estamos
                </span>
              </span>
            </h2>
            <p className="studio-editorial-intro__eyebrow reveal-text is-visible">
              <span className="reveal-line">
                <span className="reveal-line-inner">En Barcelona</span>
              </span>
            </p>
            <p className="studio-editorial-intro__lede">
              Un espacio para aprender ceramica con calma, explorar tecnicas,
              tocar la materia y encontrar una practica guiada que acompana
              cada profe el primer gesto.
            </p>
          </div>
        </section>
        <section className="studio-narrative section" aria-label="Equipo del estudio">
          <div className="container studio-narrative__container">
            <ProfileBlock
              name="Rosa Guayanay"
              image="/img/social-1.jpg"
              intro="Soy Rosa Guayanay, ceramista peruana afincada en Barcelona. Aqui encontre no solo una ciudad que me inspira, sino tambien el lugar donde seguir explorando y expandiendo mi universo creativo."
            />
            <ProfileBlock
              name="Julio Andrade"
              image="/img/social-1.jpg"
              intro="Soy Julio Andrade, ceramista y acompanante de procesos en el taller. Aqui encontre un espacio para compartir tecnica, observacion y una manera cercana de trabajar con la materia."
            />
          </div>
        </section>
        <SocialGallery />
        <TestimonialSlider />
      </main>
      <Footer />
    </>
  );
}

function ProfileBlock({
  name,
  image,
  intro
}: {
  name: string;
  image: string;
  intro: string;
}) {
  return (
    <article className="studio-profile">
      <div className="studio-profile__media">
        <img src={image} alt={`${name} en el estudio de ceramica`} />
      </div>
      <div className="studio-profile__copy">
        <h2>{name}</h2>
        <p className="studio-profile__role">
          Ceramista y especialista en quimica ceramica
        </p>
        <p>{intro}</p>
        <p>
          Mi relacion con la ceramica va mas alla del taller: me apasiona la
          quimica que hay detras de cada esmalte y la forma en que los
          materiales se transforman con el fuego. Esa mezcla entre arte y
          ciencia es lo que me mueve a seguir experimentando, combinando
          elementos y descubriendo nuevas texturas y colores.
        </p>
        <p>
          Despues de anos de estudio, trabajo e investigacion, he aprendido que
          la ceramica no tiene secretos inalcanzables, solo procesos que merecen
          ser comprendidos. Por eso, mi proposito es compartir lo que se,
          ensenar con honestidad y acercar a mas personas a esa alquimia
          maravillosa que ocurre cuando la tierra, el fuego y la curiosidad se
          encuentran.
        </p>
      </div>
    </article>
  );
}
