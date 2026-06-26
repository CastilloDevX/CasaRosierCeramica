import type { CSSProperties, ReactNode } from "react";
import { NavbarGlobal } from "@/components/layout/NavbarGlobal";
import { assetPath } from "@/lib/assets";
import { classNames } from "@/lib/utils";

interface HeaderInternoProps {
  image?: string;
  eyebrow?: string;
  title?: string;
  height?: "small" | "medium" | "large";
  overlayTitle?: boolean;
  className?: string;
  children?: ReactNode;
}

export function HeaderInterno({
  image = "img/hero-bg.jpg",
  eyebrow,
  title,
  height = "medium",
  overlayTitle = false,
  className,
  children
}: HeaderInternoProps) {
  const style = {
    "--page-hero-image": `url("${assetPath(image)}")`
  } as CSSProperties;
  const titleContent =
    children ??
    (title ? (
      <div>
        {eyebrow && <p className="page-hero__eyebrow">{eyebrow}</p>}
        <h1 className="page-hero__title">{title}</h1>
      </div>
    ) : null);

  return (
    <>
      <header
        className={classNames(
          "header-interno page-hero header-interno--ready header-interno--center header-interno--overlay-warm",
          `header-interno--${height}`,
          !overlayTitle && Boolean(titleContent) && "page-hero--nav-only",
          className
        )}
        style={style}
        data-header-height={height}
        data-header-alignment="center"
        data-header-overlay="warm"
      >
        <NavbarGlobal />
        {overlayTitle && titleContent && (
          <div
            className="header-interno__inner page-hero__inner container"
            aria-hidden="true"
          >
            {titleContent}
          </div>
        )}
        {!titleContent && (
          <div
            className="header-interno__inner page-hero__inner container"
            aria-hidden="true"
          />
        )}
      </header>
      {!overlayTitle && titleContent && (
        <section
          className={classNames(
            "page-title-block page-title-block--center",
            `page-title-block--${height}`
          )}
        >
          <div className="page-title-block__inner container">{titleContent}</div>
        </section>
      )}
    </>
  );
}
