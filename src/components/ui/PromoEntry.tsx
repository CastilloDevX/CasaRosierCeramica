"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MarkdownContent } from "./MarkdownContent";

export interface PromoEntryData {
  keyText: string;
  title: string;
  text: string;
  detailText: string;
  imageUrl: string;
  buttonText: string;
  href: string;
}

const defaultPromo: PromoEntryData = {
  keyText: "Plazas limitadas",
  title: "Regalate un dia de ceramica",
  text: "Ven a probar el torno, tocar la arcilla y crear una pieza en el taller.",
  detailText: "No necesitas experiencia previa. Solo ganas de venir al taller y probar algo distinto.",
  imageUrl: "/img/1766778567125-t8t5rt.png",
  buttonText: "Reservar plaza",
  href: "/clases",
};

export function PromoEntry({ promo = defaultPromo }: { promo?: PromoEntryData | null }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!promo) return;
    const timeout = window.setTimeout(() => setOpen(true), 0);
    return () => window.clearTimeout(timeout);
  }, [promo]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("promo-entrada-open");
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("promo-entrada-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open || !promo) return null;

  return (
    <section
      className="promo-entrada is-visible"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-entrada-title"
      ref={dialogRef}
    >
      <div className="promo-entrada__shell">
        <button
          className="promo-entrada__close"
          type="button"
          aria-label="Cerrar promocion"
          title="Cerrar promocion"
          onClick={() => setOpen(false)}
          ref={closeRef}
        >
          <span className="promo-entrada__close-mark" aria-hidden="true">
            &times;
          </span>
        </button>
        <div className="promo-entrada__content">
          <div className="promo-entrada__content-inner">
            <p className="promo-entrada__eyebrow">{promo.keyText}</p>
            <h2 className="promo-entrada__title" id="promo-entrada-title">
              {promo.title}
            </h2>
            <MarkdownContent className="promo-entrada__subtitle" source={promo.text} />
            <MarkdownContent className="promo-entrada__text" source={promo.detailText} />
            <div className="promo-entrada__actions">
              <Link className="promo-entrada__cta" href={promo.href || "/clases"}>
                {promo.buttonText}
              </Link>
            </div>
          </div>
        </div>
        <div className="promo-entrada__media">
          <figure className="promo-entrada__figure">
            <img
              className="promo-entrada__image"
              src={promo.imageUrl}
              alt="Composicion promocional de piezas ceramicas y retrato editorial"
              width={604}
              height={516}
              loading="eager"
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
