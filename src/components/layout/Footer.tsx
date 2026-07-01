import { Carousel } from "@/components/ui/Carousel";
import FooterContactForm from "./FooterContactForm";

export function Footer({ socialTrack = false }: { socialTrack?: boolean }) {
  const socialLoop = Array.from({ length: 12 }, (_, index) => (index % 4) + 1);

  return (
    <footer id="footer" className="site-footer">
      {socialTrack && (
        <Carousel
          items={socialLoop}
          ariaLabel="Galeria social continua"
          className="footer-social"
          viewportClassName="footer-social__viewport"
          trackClassName="footer-social__track is-animated"
          slideClassName="footer-social__slide"
          marquee
          renderItem={(index, { realIndex, isDuplicate }) => (
              <a
                className="footer-social__item"
                href="https://www.facebook.com/casarosier"
                target="_blank"
                rel="noreferrer"
                tabIndex={isDuplicate || realIndex > 3 ? -1 : undefined}
              >
                <img
                  src={
                    index === 4
                      ? "/img/social-4.jpeg"
                      : `/img/social-${index}.jpg`
                  }
                  alt={isDuplicate || realIndex > 3 ? "" : `Instagram ${index}`}
                  loading="lazy"
                  decoding="async"
                />
              </a>
          )}
        />
      )}
      <section id="contacto-footer" className="contact-footer">
        <div className="container contact-footer__container">
          <FooterContactForm />
          <div className="contact-info">
            <h2 className="contact-info__title">Contacto</h2>
            <p className="contact-info__text">+34 600 000 000</p>
            <p className="contact-info__line">Barcelona, Espana</p>
            <p className="contact-info__line">
              Lunes a Sabado - 10:00 a 20:00
            </p>
            <p className="contact-info__social-title">
              Siguenos en Nuestras Redes:
            </p>
            <div className="contact-info__social">
              <a
                className="contact-info__social-link"
                href="https://www.facebook.com/casarosier"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/img/icon-instagram.svg" alt="" loading="lazy" decoding="async" />
              </a>
              <a
                className="contact-info__social-link"
                href="https://www.facebook.com/casarosier"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/img/icon-facebook.svg" alt="" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="contact-info__legal-links" aria-label="Enlaces legales">
              <a className="contact-info__legal-link" href="/politica-privacidad">
                Política y privacidad
              </a>
              <a className="contact-info__legal-link" href="/auth">
                Administración
              </a>
            </div>
          </div>
        </div>
      </section>
      <div className="site-legal">
        <p className="site-legal__copy">&copy; Casa Rosier</p>
      </div>
    </footer>
  );
}
