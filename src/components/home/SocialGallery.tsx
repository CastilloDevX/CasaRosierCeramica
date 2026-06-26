"use client";

import { useEffect, useRef, useState } from "react";

const posts = [
  {
    image: "/img/social-1.jpg",
    title: "Serie en proceso",
    body: "Pieza en estudio: pruebas de forma, secado y acabados de superficie.",
    date: "10 de enero de 2026"
  },
  {
    image: "/img/social-2.jpg",
    title: "Materia y ritmo",
    body: "Una mirada al proceso cotidiano dentro del taller.",
    date: "18 de enero de 2026"
  },
  {
    image: "/img/social-3.jpg",
    title: "Color y superficie",
    body: "Pruebas de esmaltes, capas y pequenas decisiones de acabado.",
    date: "24 de enero de 2026"
  },
  {
    image: "/img/social-4.jpeg",
    title: "El taller por dentro",
    body: "Herramientas, piezas y momentos de trabajo compartido.",
    date: "2 de febrero de 2026"
  }
];

export function SocialGallery() {
  const [active, setActive] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const current = active === null ? null : posts[active];

  useEffect(() => {
    if (active === null) return;
    document.body.classList.add("modal-open");
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") {
        setActive((value) =>
          value === null ? 0 : (value + 1) % posts.length
        );
      }
      if (event.key === "ArrowLeft") {
        setActive((value) =>
          value === null ? 0 : (value - 1 + posts.length) % posts.length
        );
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      <section id="galeria-social" className="social section">
        <div className="container social__container">
          <header className="social__head">
            <h2 className="social__title section-title">
              Y tu, cuando tuviste
              <br />
              tu ultima idea?
            </h2>
            <p className="social__subtitle">
              siguenos en instagram - @casarosier
            </p>
          </header>
          <div className="social__viewport">
            <div className="social__track">
              {posts.map((post, index) => (
                <button
                  className="social__item"
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Abrir post social ${index + 1}`}
                  key={post.image}
                >
                  <img src={post.image} alt={`Post social ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {current && (
        <div
          className="ig-modal is-open"
          id="ig-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ig-title"
        >
          <button
            className="ig-modal__backdrop"
            type="button"
            aria-label="Cerrar"
            onClick={() => setActive(null)}
          />
          <div className="ig-modal__panel" tabIndex={-1} ref={panelRef}>
            <section className="ig-modal__media">
              <img src={current.image} alt="" />
              <div className="ig-modal__overlay-text">Post</div>
            </section>
            <section className="ig-modal__content">
              <div className="ig-modal__topbar">
                <button
                  className="ig-modal__icon-btn"
                  type="button"
                  aria-label="Anterior"
                  onClick={() =>
                    setActive(
                      ((active ?? 0) - 1 + posts.length) % posts.length
                    )
                  }
                >
                  &lsaquo;
                </button>
                <button
                  className="ig-modal__icon-btn"
                  type="button"
                  aria-label="Siguiente"
                  onClick={() =>
                    setActive(((active ?? 0) + 1) % posts.length)
                  }
                >
                  &rsaquo;
                </button>
                <button
                  className="ig-modal__icon-btn ig-modal__icon-btn--close"
                  type="button"
                  aria-label="Cerrar"
                  onClick={() => setActive(null)}
                >
                  x
                </button>
              </div>
              <h3 id="ig-title" className="ig-modal__title">
                {current.title}
              </h3>
              <div className="ig-modal__body">{current.body}</div>
              <a
                className="ig-modal__link"
                href="https://www.instagram.com/casarosier/"
                target="_blank"
                rel="noreferrer"
              >
                Ver en Instagram
              </a>
              <p className="ig-modal__date">{current.date}</p>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
