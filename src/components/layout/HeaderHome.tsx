import { NavbarGlobal } from "@/components/layout/NavbarGlobal";
import { getPublicNavigationItems } from "@/lib/cms/navigation-public";
import { getSettings } from "@/lib/cms/settings";

export async function HeaderHome() {
  const [navigationItems, settings] = await Promise.all([
    getPublicNavigationItems("main"),
    getSettings(),
  ]);

  return (
    <header
      id="hero"
      className="hero header-home header-home--ready"
      data-header-component="HeaderHome"
    >
      <div className="hero__bg" />
      <NavbarGlobal
        home
        navigationItems={navigationItems}
        logoUrl={settings.menu.header_logo_url}
        scrollMenuBackgroundColor={settings.menu.scroll_menu_background_color}
        scrollMenuTextColor={settings.menu.scroll_menu_text_color}
        scrollMenuIconColor={settings.menu.scroll_menu_icon_color}
        scrollMenuLogoTintEnabled={settings.menu.scroll_menu_logo_tint_enabled}
        scrollMenuLogoTintColor={settings.menu.scroll_menu_logo_tint_color}
      />
      <h1 className="hero__title">Casa Rosier</h1>
      <div className="hero__overlays" aria-hidden="true">
        <img
          className="hero__overlay hero__overlay--1"
          src="/img/hero-overlay-1.png"
          alt=""
          width={578}
          height={224}
          decoding="async"
        />
        <img
          className="hero__overlay hero__overlay--2"
          src="/img/hero-overlay-2.png"
          alt=""
          width={501}
          height={235}
          decoding="async"
        />
      </div>
    </header>
  );
}
