"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function PromoEntry() {
  const [open, setOpen] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("promo-entrada-open");
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("promo-entrada-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <section
      className="promo-entrada is-visible"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-entrada-title"
    >
      <div className="promo-entrada__shell">
        <button
          className="promo-entrada__close"
          type="button"
          aria-label="Cerrar aviso promocional"
          onClick={() => setOpen(false)}
          ref={closeRef}
        >
          <span className="promo-entrada__close-mark" aria-hidden="true">
            &times;
          </span>
        </button>
        <div className="promo-entrada__content">
          <div className="promo-entrada__content-inner">
            <p className="promo-entrada__eyebrow">Plazas limitadas</p>
            <h2 className="promo-entrada__title" id="promo-entrada-title">
              Regalate un dia de ceramica
            </h2>
            <p className="promo-entrada__subtitle">
              Ven a probar el torno, tocar la arcilla y crear una pieza
              casarosierconcms\casarosierconcms.
            </p>
            <p className="promo-entrada__text">
              No necesitas experiencia previa. Solo ganas de venir al taller y
              probar algo distinto.
            </p>
            <div className="promo-entrada__actions">
              <Link className="promo-entrada__cta" href="/clases">
                Reservar plaza
              </Link>
            </div>
          </div>
        </div>
        <div className="promo-entrada__media">
          <figure className="promo-entrada__figure">
            <img
              className="promo-entrada__image"
              src="/img/1766778567125-t8t5rt.png"
              alt="Composicion promocional de piezas ceramicas y retrato editorial"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
