"use client";

import Link from "next/link";
import type { ExperienceItem } from "@/data/types";
import { assetPath } from "@/lib/assets";
import { experienceHref } from "@/lib/routes";
import { Carousel } from "@/components/ui/Carousel";

interface GiftCarouselProps {
  items: readonly ExperienceItem[];
}

export function GiftCarousel({ items }: GiftCarouselProps) {
  if (items.length === 0) return null;

  return (
    <Carousel
      items={items}
      ariaLabel="Experiencias en ceramica"
      className="gift-carousel"
      viewportClassName="gift-carousel__viewport"
      trackClassName="gift-carousel__track"
      slideClassName="gift-carousel__slide"
      arrowClassName="gift-carousel__arrow"
      previousArrowClassName="gift-carousel__arrow--prev"
      nextArrowClassName="gift-carousel__arrow--next"
      previousLabel="Experiencia anterior"
      nextLabel="Experiencia siguiente"
      showArrows
      renderItem={(item) => (
        <>
          <Link
            className="gift-carousel__media"
            href={experienceHref(item.kind, item.slug)}
          >
            <img src={assetPath(item.coverImage)} alt={item.title} />
          </Link>
          <div className="gift-carousel__body">
            <p className="gift-carousel__text">{item.excerpt}</p>
            <Link
              className="gift-carousel__cta"
              href={experienceHref(item.kind, item.slug)}
            >
              ver mas
            </Link>
          </div>
        </>
      )}
    />
  );
}
