"use client";

import Link from "next/link";
import { useState } from "react";
import { published, shopCategories } from "@/data/shop";
import { assetPath } from "@/lib/assets";
import { classNames } from "@/lib/utils";

export function ShopGrid() {
  const [category, setCategory] = useState("all");
  const items =
    category === "all"
      ? published
      : published.filter((item) => item.category === category);

  return (
    <section className="shop-listing section">
      <div className="container shop-listing__container">
        <div className="shop-filters">
          {shopCategories.map((filter) => (
            <button
              className={classNames(
                "shop-filter",
                category === filter.key && "is-active"
              )}
              type="button"
              aria-pressed={category === filter.key}
              onClick={() => setCategory(filter.key)}
              key={filter.key}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="cards-grid shop-grid">
          {items.map((item) => (
            <article
              className="content-card classes-card shop-card"
              key={item.id}
            >
              <Link
                className="content-card__media shop-card__media"
                href={`/shop/${item.slug}`}
                aria-label={`Ver pieza ${item.name}`}
              >
                <img src={assetPath(item.image)} alt={item.name} />
              </Link>
              <div className="content-card__body shop-card__body">
                <p className="content-card__meta shop-card__meta">
                  {item.categoryLabel}
                </p>
                <h3 className="content-card__title card__title">{item.name}</h3>
                <div className="shop-card__facts">
                  <p className="shop-card__price">{item.price}</p>
                  <p className="shop-card__availability">
                    {item.availability}
                  </p>
                </div>
                <Link
                  className="content-card__cta shop-card__cta"
                  href={`/shop/${item.slug}`}
                >
                  Ver pieza
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
