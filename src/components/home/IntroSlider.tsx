"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { assetPath } from "@/lib/assets";

const slides = [
  {
    id: "intro-1",
    text: "Un espacio para tocar la arcilla, aprender con calma y crear piezas con una mirada propia.",
    buttonText: "Reserva una experiencia",
    buttonHref: "/clases",
    image: "img/1766778567125-t8t5rt.png",
    imageAlt:
      "Composicion visual de piezas ceramicas y retrato en Casa Rosier"
  },
  {
    id: "intro-2",
    text: "Ceramica, materia y tiempo para crear con las manos en Barcelona.",
    buttonText: "Ver clases",
    buttonHref: "/clases",
    image: "img/c0c8f2c3-1d13-4632-9fe8-1ad322e51abd.png",
    imageAlt: "Retrato editorial junto a piezas ceramicas claras"
  },
  {
    id: "intro-3",
    text: "Clases y workshops para explorar la ceramica desde la practica y el proceso.",
    buttonText: "Ver workshops",
    buttonHref: "/workshops",
    image: "img/0429e735-6642-4339-8e1b-72bdade5c8ad.png",
    imageAlt:
      "Piezas ceramicas esmaltadas en rojo y azul sobre pedestales"
  },
  {
    id: "intro-4",
    text: "Un taller para probar, equivocarse, volver a empezar y descubrir nuevas formas.",
    buttonText: "Conoce el estudio",
    buttonHref: "/el-estudio",
    image: "img/5fd27c84-15dd-43ef-b039-2e8458a3f1a6.png",
    imageAlt: "Coleccion de cuencos y piezas ceramicas en tonos claros"
  }
];

export function IntroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (
      paused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % slides.length),
      4000
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      id="intro"
      className="home-intro-slider section"
      aria-roledescription="carousel"
      aria-label="Introduccion visual Casa Rosier"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="container home-intro-slider__inner">
        <div className="home-intro-slider__viewport">
          <div
            className="home-intro-slider__slides"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide) => (
              <article
                className="home-intro-slider__slide"
                id={slide.id}
                key={slide.id}
              >
                <div className="intro-slider-image">
                  <img
                    src={assetPath(slide.image)}
                    alt={slide.imageAlt}
                    className={
                      assetPath(slide.image) !== `/${slide.image}`
                        ? "asset-fallback"
                        : undefined
                    }
                  />
                </div>
                <div className="intro-slider-content">
                  <div className="intro-slider-content__inner">
                    <p className="intro-slider-content__text">{slide.text}</p>
                    <Link
                      className="intro-slider-content__button"
                      href={slide.buttonHref}
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="home-intro-slider__dots">
          {slides.map((slide, slideIndex) => (
            <button
              className={`home-intro-slider__dot ${
                slideIndex === index ? "is-active" : ""
              }`}
              type="button"
              aria-label={`Ir al slide ${slideIndex + 1}`}
              aria-controls={slide.id}
              aria-pressed={slideIndex === index}
              onClick={() => setIndex(slideIndex)}
              key={slide.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
