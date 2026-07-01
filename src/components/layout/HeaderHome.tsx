import { NavbarGlobal } from "@/components/layout/NavbarGlobal";

export function HeaderHome() {
  return (
    <header
      id="hero"
      className="hero header-home header-home--ready"
      data-header-component="HeaderHome"
    >
      <div className="hero__bg" />
      <NavbarGlobal home />
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
