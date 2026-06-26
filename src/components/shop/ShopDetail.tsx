"use client";

import { useState } from "react";
import type { ShopItem } from "@/data/types";
import { assetPath } from "@/lib/assets";
import { classNames } from "@/lib/utils";

export function ShopDetail({ item }: { item: ShopItem }) {
  const [active, setActive] = useState(0);
  return (
    <section className="shop-detail section">
      <div className="container shop-detail__container">
        <div className="shop-detail__layout">
          <section className="shop-detail__media-column">
            <div className="shop-gallery">
              <img
                className="shop-gallery__main"
                src={assetPath(item.gallery[active] ?? item.image)}
                alt={item.name}
              />
              <div className="shop-gallery__thumbs">
                {item.gallery.map((image, index) => (
                  <button
                    className={classNames(
                      "shop-gallery__thumb",
                      active === index && "is-active"
                    )}
                    type="button"
                    aria-label={`Ver imagen ${index + 1} de ${item.name}`}
                    onClick={() => setActive(index)}
                    key={`${image}-${index}`}
                  >
                    <img
                      src={assetPath(image)}
                      alt={`${item.name} ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="shop-sidecard">
              <h3>Disponibilidad</h3>
              <p>{item.availability}</p>
              <p>{item.availabilityNote}</p>
            </div>
          </section>

          <section className="shop-detail__content-column">
            <header className="shop-detail__head">
              <p className="shop-detail__eyebrow">{item.categoryLabel}</p>
              <h1 className="shop-detail__title">{item.name}</h1>
              <p className="shop-detail__price-main">{item.price}</p>
              <p className="shop-detail__highlight">{item.description}</p>
            </header>
            <section className="shop-detail__facts">
              <div className="shop-detail__fact-block">
                <h2>Detalles tecnicos</h2>
                <div className="shop-detail__specs">
                  {Object.entries(item.details).map(([label, value]) => (
                    <div className="shop-detail__spec-row" key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
              <div className="shop-detail__fact-block">
                <h2>Estado</h2>
                <p className="shop-detail__duration">{item.availability}</p>
                <div className="shop-detail__schedule">
                  <div className="shop-detail__schedule-item">
                    <h4>Informacion</h4>
                    <p>{item.availabilityNote}</p>
                  </div>
                </div>
              </div>
            </section>
            <section className="shop-detail__text-block">
              <h2>La pieza</h2>
              <p>{item.description}</p>
            </section>
            <section className="shop-detail__cta">
              <a
                className="shop-detail__button shop-detail__button--primary"
                href="https://wa.me/34633788860"
                target="_blank"
                rel="noreferrer"
              >
                Comprar
              </a>
            </section>
          </section>
        </div>
      </div>
    </section>
  );
}
