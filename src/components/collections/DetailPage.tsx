"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Accordion } from "@/components/collections/Accordion";
import { Gallery } from "@/components/collections/Gallery";
import type { ExperienceItem } from "@/data/types";
import { addCartItem } from "@/lib/cart";

export function DetailPage({ item }: { item: ExperienceItem }) {
  const isGiftCard = item.kind === "gift-card";
  const [giftType, setGiftType] = useState("");
  const [added, setAdded] = useState(false);
  const defaultPrice = useMemo(
    () =>
      item.priceOptions.length <= 1
        ? item.priceOptions[0]?.price ?? ""
        : item.priceOptions
            .map((option) => `${option.label}: ${option.price}`)
            .join(" / "),
    [item.priceOptions]
  );

  const addGiftCard = () => {
    if (!giftType) return;
    addCartItem({
      cartItemId: `${item.id}-${Date.now()}`,
      productId: item.id,
      slug: item.slug,
      kind: item.kind,
      title: item.title,
      subtitle: item.subtitle,
      price: defaultPrice,
      quantity: 1,
      giftCardType: giftType,
      orderSummary: [
        { label: "Tarjeta digital o fisica", value: giftType }
      ],
      addedAt: new Date().toISOString()
    });
    setAdded(true);
  };

  return (
    <section className="class-detail section">
      <div className="container class-detail__container">
        <div className="class-detail__layout">
          <section className="class-detail__media-column">
            <Gallery
              images={item.galleryImages}
              title={item.title}
              videoImage={item.videoCardImage}
              videoLabel={item.videoCardLabel}
              ctaHref={item.ctaHref}
            />
            <div className="class-sidecard">
              <h3>Metodos de pago</h3>
              <p>Puedes pagar con cualquiera de estos medios</p>
              <ul>
                {item.paymentMethods.map((method) => (
                  <li key={method}>{method}</li>
                ))}
              </ul>
            </div>
            <div className="class-sidecard class-sidecard--soft">
              <h3>Informacion adicional</h3>
              <p>{item.additionalInfo}</p>
            </div>
          </section>

          <section className="class-detail__content-column">
            <header className="class-detail__head">
              <p className="class-detail__eyebrow">{item.category}</p>
              <h1 className="class-detail__title">{item.subtitle}</h1>
              <p className="class-detail__question">
                Te apasiona la creatividad y deseas explorar el mundo de la
                ceramica?
              </p>
              <p className="class-detail__highlight">{item.introHighlight}</p>
            </header>

            <div className="class-detail__copy">
              {item.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <section className="class-detail__facts">
              {isGiftCard ? (
                <div className="class-detail__fact-block class-detail__fact-block--selector">
                  <h2>Tipo de tarjeta</h2>
                  <div className="gift-card-selector">
                    <label
                      className="gift-card-selector__label"
                      htmlFor="gift-card-type-select"
                    >
                      {item.giftCardTypeLabel ??
                        "Tarjeta digital o fisica?"}
                    </label>
                    <div className="gift-card-selector__control">
                      <select
                        id="gift-card-type-select"
                        className="gift-card-selector__input"
                        value={giftType}
                        onChange={(event) => {
                          setGiftType(event.target.value);
                          setAdded(false);
                        }}
                      >
                        <option value="">Elige una opcion</option>
                        {item.giftCardTypeOptions?.map((option) => (
                          <option value={option} key={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="class-detail__fact-block">
                  <h2>Precio</h2>
                  <div className="class-detail__price-list">
                    {item.priceOptions.map((option) => (
                      <div
                        className="class-detail__price-row"
                        key={option.label}
                      >
                        <span>{option.label}</span>
                        <strong>{option.price}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="class-detail__fact-block">
                <h2>Duracion</h2>
                <p className="class-detail__duration">{item.duration}</p>
                <div className="class-detail__schedule">
                  {item.schedule.map((schedule) => (
                    <div
                      className="class-detail__schedule-item"
                      key={schedule.day}
                    >
                      <h4>{schedule.day}</h4>
                      {schedule.slots.map((slot) => (
                        <p key={slot}>{slot}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="class-detail__includes">
              <h2>Incluye</h2>
              <ul>
                {item.included.map((included) => (
                  <li key={included}>{included}</li>
                ))}
              </ul>
              <a
                className="class-detail__button"
                href={item.ctaHref}
                target="_blank"
                rel="noreferrer"
              >
                {isGiftCard ? "Comprar" : "Consultar"}
              </a>
            </section>

            <section className="class-detail__text-block">
              <h2>Que aprenderas?</h2>
              {item.whatYouWillLearn.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            <section className="class-detail__text-block">
              <h2>Quien puede participar?</h2>
              {item.whoCanJoin.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            <section className="class-detail__program">
              <h2>Contenido del curso</h2>
              <Accordion items={item.program} />
              {isGiftCard ? (
                <>
                  <button
                    className={`class-detail__button class-detail__button--primary ${
                      giftType ? "" : "class-detail__button--disabled"
                    }`}
                    type="button"
                    disabled={!giftType}
                    aria-disabled={!giftType}
                    onClick={addGiftCard}
                  >
                    Anadir al carrito
                  </button>
                  {(added || !giftType) && (
                    <div className="gift-card-cart-feedback">
                      <p className="gift-card-cart-feedback__message">
                        {added
                          ? `Tarjeta digital o fisica: ${giftType}`
                          : "Selecciona un tipo de tarjeta para continuar."}
                      </p>
                      {added && (
                        <div className="gift-card-cart-feedback__summary">
                          <div className="gift-card-cart-feedback__row">
                            <span>Producto</span>
                            <strong>{item.title}</strong>
                          </div>
                          {defaultPrice && (
                            <div className="gift-card-cart-feedback__row">
                              <span>Precio</span>
                              <strong>{defaultPrice}</strong>
                            </div>
                          )}
                          <div className="gift-card-cart-feedback__row">
                            <span>Tarjeta digital o fisica</span>
                            <strong>{giftType}</strong>
                          </div>
                        </div>
                      )}
                      <Link className="class-detail__button" href="/carrito">
                        Ver carrito
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <a
                  className="class-detail__button class-detail__button--primary"
                  href={item.ctaHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  Inscribirme
                </a>
              )}
            </section>
          </section>
        </div>
      </div>
    </section>
  );
}
