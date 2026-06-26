import type { Metadata } from "next";
import Link from "next/link";
import { SocialGallery } from "@/components/home/SocialGallery";
import { BodyClass } from "@/components/layout/BodyClass";
import { Footer } from "@/components/layout/Footer";
import { NavbarGlobal } from "@/components/layout/NavbarGlobal";
import { StudioGallery } from "@/components/studio/StudioGallery";

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
        <div className="studio-header__bg" aria-hidden="true" />
        <NavbarGlobal />
      </header>
      <main>
        <section
          className="studio-editorial-intro section is-visible"
          aria-labelledby="studio-lead-quote-title"
        >
          <div className="studio-editorial-intro__inner">
            <p className="studio-editorial-intro__eyebrow reveal-text is-visible">
              <span className="reveal-line">
                <span className="reveal-line-inner">El estudio</span>
              </span>
            </p>
            <h2
              className="studio-editorial-intro__text reveal-text is-visible"
              id="studio-lead-quote-title"
            >
              <span className="reveal-line">
                <span className="reveal-line-inner">
                  La ceramica no empieza cuando la pieza esta terminada.
                </span>
              </span>
              <span className="reveal-line">
                <span className="reveal-line-inner">
                  Empieza mucho antes: cuando una idea encuentra
                </span>
              </span>
              <span className="reveal-line">
                <span className="reveal-line-inner">
                  tiempo, materia y silencio.
                </span>
              </span>
            </h2>
          </div>
        </section>
        <section className="studio-narrative section">
          <div className="container studio-narrative__container">
            <div className="studio-narrative__media">
              <img
                src="/img/intro-e.jpg"
                alt="Zona de trabajo del estudio con piezas y herramientas"
              />
            </div>
            <div className="studio-narrative__copy">
              <h2>Rosa Guayanay</h2>
              <p className="studio-narrative__role">
                Ceramista y especialista en quimica ceramica
              </p>
              <p>
                Soy Rosa Guayanay, ceramista peruana afincada en Barcelona.
                Aqui encontre no solo una ciudad que me inspira, sino tambien
                el lugar donde seguir explorando y expandiendo mi universo
                creativo.
              </p>
              <p>
                Mi relacion con la ceramica va mas alla del taller: me apasiona
                la quimica que hay detras de cada esmalte y la forma en que los
                materiales se transforman con el fuego. Esa mezcla entre arte y
                ciencia es lo que me mueve a seguir experimentando, combinando
                elementos y descubriendo nuevas texturas y colores.
              </p>
              <p>
                Despues de anos de estudio, trabajo e investigacion, he
                aprendido que la ceramica no tiene secretos inalcanzables, solo
                procesos que merecen ser comprendidos. Por eso, mi proposito es
                compartir lo que se, ensenar con honestidad y acercar a mas
                personas a esa alquimia maravillosa que ocurre cuando la
                tierra, el fuego y la curiosidad se encuentran.
              </p>
            </div>
          </div>
        </section>
        <StudioGallery />
        <section className="studio-closing section">
          <div className="container studio-closing__container">
            <p className="studio-closing__text">
              Venir al estudio es dedicarle un rato a la materia, a las manos y
              a una forma distinta de estar presente.
            </p>
            <Link className="studio-closing__button" href="/clases">
              Ver clases
            </Link>
          </div>
        </section>
        <SocialGallery />
      </main>
      <Footer />
    </>
  );
}
