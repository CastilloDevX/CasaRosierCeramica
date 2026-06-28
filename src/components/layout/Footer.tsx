import { Carousel } from "@/components/ui/Carousel";

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
                />
              </a>
          )}
        />
      )}
      <section id="contacto-footer" className="contact-footer">
        <div className="container contact-footer__container">
          <form className="contact-form" action="#">
            <div className="contact-form__row">
              <div>
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  className="contact-form__input"
                  name="nombre"
                  type="text"
                  placeholder="Nombre"
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Correo electronico *</label>
                <input
                  id="email"
                  className="contact-form__input"
                  name="email"
                  type="email"
                  placeholder="Correo electronico *"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="telefono">Numero de telefono</label>
              <input
                id="telefono"
                className="contact-form__input"
                name="telefono"
                type="tel"
                placeholder="Numero de telefono"
                required
              />
            </div>
            <div>
              <label htmlFor="comentario">Comentario</label>
              <textarea
                id="comentario"
                className="contact-form__textarea"
                name="comentario"
                placeholder="Comentario"
                required
              />
            </div>
            <button className="contact-form__submit" type="submit">
              Enviar
            </button>
          </form>
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
                <img src="/img/icon-instagram.svg" alt="" />
              </a>
              <a
                className="contact-info__social-link"
                href="https://www.facebook.com/casarosier"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/img/icon-facebook.svg" alt="" />
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
