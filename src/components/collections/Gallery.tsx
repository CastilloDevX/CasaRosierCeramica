"use client";

import { useState } from "react";
import { assetPath } from "@/lib/assets";
import { classNames } from "@/lib/utils";

export function Gallery({
  images,
  title,
  videoImage,
  videoLabel,
  ctaHref
}: {
  images: string[];
  title: string;
  videoImage: string;
  videoLabel: string;
  ctaHref: string;
}) {
  const [active, setActive] = useState(0);
  return (
    <div className="class-gallery">
      <img
        className="class-gallery__main"
        src={assetPath(images[active])}
        alt={title}
      />
      <div className="class-gallery__thumbs">
        {images.map((image, index) => (
          <button
            className={classNames(
              "class-gallery__thumb",
              index === active && "is-active"
            )}
            type="button"
            aria-label={`Ver imagen ${index + 1} de ${title}`}
            onClick={() => setActive(index)}
            key={`${image}-${index}`}
          >
            <img src={assetPath(image)} alt={`${title} ${index + 1}`} />
          </button>
        ))}
      </div>
      <a
        className="class-gallery__video-card"
        href={ctaHref}
        target="_blank"
        rel="noreferrer"
      >
        <img src={assetPath(videoImage)} alt={title} />
        <span>{videoLabel}</span>
      </a>
    </div>
  );
}
