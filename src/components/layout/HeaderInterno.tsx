import type { CSSProperties, ReactNode } from "react";
import { NavbarGlobal } from "@/components/layout/NavbarGlobal";
import { getPublicNavigationItems } from "@/lib/cms/navigation-public";
import { getSettings } from "@/lib/cms/settings";
import { assetPath } from "@/lib/assets";
import { classNames } from "@/lib/utils";

interface HeaderInternoProps {
  image?: string;
  variant?: "image" | "text";
  eyebrow?: string;
  title?: string;
  height?: "small" | "medium" | "large";
  overlayTitle?: boolean;
  heroMenuTone?: "light" | "dark";
  heroLogoPositionX?: string;
  heroLogoPositionY?: string;
  heroLogoWidth?: string;
  heroLogoTabletPositionX?: string;
  heroLogoTabletPositionY?: string;
  heroLogoTabletWidth?: string;
  heroLogoMobilePositionX?: string;
  heroLogoMobilePositionY?: string;
  heroLogoMobileWidth?: string;
  heroMenuPositionY?: string;
  heroMenuTabletPositionY?: string;
  heroMenuMobilePositionY?: string;
  className?: string;
  children?: ReactNode;
}

export async function HeaderInterno({
  image = "img/hero-bg.jpg",
  variant = "text",
  eyebrow,
  title,
  height = "medium",
  overlayTitle = false,
  heroMenuTone,
  heroLogoPositionX,
  heroLogoPositionY,
  heroLogoWidth,
  heroLogoTabletPositionX,
  heroLogoTabletPositionY,
  heroLogoTabletWidth,
  heroLogoMobilePositionX,
  heroLogoMobilePositionY,
  heroLogoMobileWidth,
  heroMenuPositionY,
  heroMenuTabletPositionY,
  heroMenuMobilePositionY,
  className,
  children
}: HeaderInternoProps) {
  const [navigationItems, settings] = await Promise.all([
    getPublicNavigationItems("main"),
    getSettings(),
  ]);
  const style = {
    "--page-hero-image": `url("${assetPath(image)}")`,
    "--hero-logo-position-x": heroLogoPositionX ?? "50%",
    "--hero-logo-position-y": heroLogoPositionY ?? "46px",
    "--hero-logo-width": heroLogoWidth ?? "118px",
    "--hero-logo-tablet-position-x": heroLogoTabletPositionX ?? heroLogoPositionX ?? "50%",
    "--hero-logo-tablet-position-y": heroLogoTabletPositionY ?? heroLogoPositionY ?? "42px",
    "--hero-logo-tablet-width": heroLogoTabletWidth ?? heroLogoWidth ?? "106px",
    "--hero-logo-mobile-position-x": heroLogoMobilePositionX ?? heroLogoPositionX ?? "50%",
    "--hero-logo-mobile-position-y": heroLogoMobilePositionY ?? "34px",
    "--hero-logo-mobile-width": heroLogoMobileWidth ?? "92px",
    "--hero-menu-position-y": heroMenuPositionY ?? "132px",
    "--hero-menu-tablet-position-y": heroMenuTabletPositionY ?? heroMenuPositionY ?? "118px",
    "--hero-menu-mobile-position-y": heroMenuMobilePositionY ?? "96px",
  } as CSSProperties;
  const scrollThreshold = Number.parseInt(heroMenuPositionY ?? "", 10) || 132;
  const tabletScrollThreshold = Number.parseInt(heroMenuTabletPositionY ?? "", 10) || scrollThreshold;
  const mobileScrollThreshold = Number.parseInt(heroMenuMobilePositionY ?? "", 10) || 96;
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
          variant === "image" ? "header-interno--image-hero" : "header-interno--text-hero",
          `header-interno--menu-${heroMenuTone ?? (variant === "image" ? "light" : "dark")}`,
          `header-interno--${height}`,
          !overlayTitle && Boolean(titleContent) && "page-hero--nav-only",
          className
        )}
        style={style}
        data-header-height={height}
        data-header-alignment="center"
        data-header-overlay="warm"
      >
        <NavbarGlobal
          navigationItems={navigationItems}
          logoUrl={settings.menu.header_logo_url}
          scrollMenuBackgroundColor={settings.menu.scroll_menu_background_color}
          scrollMenuTextColor={settings.menu.scroll_menu_text_color}
          scrollMenuIconColor={settings.menu.scroll_menu_icon_color}
          scrollMenuLogoTintEnabled={settings.menu.scroll_menu_logo_tint_enabled}
          scrollMenuLogoTintColor={settings.menu.scroll_menu_logo_tint_color}
          scrollThreshold={scrollThreshold}
          tabletScrollThreshold={tabletScrollThreshold}
          mobileScrollThreshold={mobileScrollThreshold}
        />
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
