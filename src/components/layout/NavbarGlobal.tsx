"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/navigation";
import { classNames } from "@/lib/utils";

export function NavbarGlobal({ home = false }: { home?: boolean }) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [staticMobileOpen, setStaticMobileOpen] = useState(false);
  const [mobileScrolled, setMobileScrolled] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const mobileItems = navigation
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);
  const desktopItems = mobileItems.filter(
    (item) => !home || item.label !== "Inicio"
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setStaticMobileOpen(false);
        setDesktopOpen(null);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setMobileOpen(false);
        setStaticMobileOpen(false);
        setDesktopOpen(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 12;
      setMobileScrolled(scrolled);
      if (!scrolled) {
        setMobileOpen(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const current = (href: string) =>
    href === "/#hero"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div
      className={classNames(
        "site-nav-shell",
        home ? "site-nav-shell--home" : "site-nav-shell--internal"
      )}
      ref={rootRef}
    >
      <div className="navbar-global hero__top container">
        <Link className="hero__logo" href="/#hero" aria-label="Casa Rosier">
          <img
            className="hero__logo-image"
            src="/img/logo-header.png"
            alt="Casa Rosier"
          />
        </Link>

        <nav className="hero__nav nav-desktop" aria-label="Principal">
          <ul className="hero__nav-list">
            {desktopItems.map((item, index) => {
              const children =
                item.children?.filter((child) => child.visible) ?? [];
              const open = desktopOpen === item.label;
              const submenuId = `desktop-submenu-${index}`;
              return (
                <li
                  className={classNames(
                    "hero__nav-item",
                    children.length > 0 && "hero__nav-item--has-children",
                    open && "hero__nav-item--open"
                  )}
                  key={item.label}
                  onMouseEnter={() =>
                    children.length > 0 && setDesktopOpen(item.label)
                  }
                  onMouseLeave={() => setDesktopOpen(null)}
                  onFocus={() =>
                    children.length > 0 && setDesktopOpen(item.label)
                  }
                >
                  <div className="hero__nav-group">
                    <Link
                      className="hero__nav-link"
                      href={item.href}
                      aria-current={current(item.href) ? "page" : undefined}
                      onClick={() => {
                        setMobileOpen(false);
                        setDesktopOpen(null);
                      }}
                    >
                      {item.label}
                    </Link>
                    {children.length > 0 && (
                      <button
                        className="hero__nav-toggle"
                        type="button"
                        aria-expanded={open}
                        aria-haspopup="menu"
                        aria-controls={submenuId}
                        aria-label={`Abrir submenu de ${item.label}`}
                        onClick={() =>
                          setDesktopOpen(open ? null : item.label)
                        }
                      >
                        <span className="hero__plus" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  {children.length > 0 && (
                    <ul className="nav-submenu" id={submenuId} role="menu">
                      {children.map((child) => (
                        <li
                          className="nav-submenu__item"
                          role="none"
                          key={child.href}
                        >
                          <Link
                            className="nav-submenu__link"
                            href={child.href}
                            role="menuitem"
                            aria-current={
                              current(child.href) ? "page" : undefined
                            }
                            onClick={() => setDesktopOpen(null)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {!home && (
        <div
          className={classNames(
            "mobile-static-nav",
            staticMobileOpen && "is-open"
          )}
        >
          <div className="mobile-static-nav__bar">
            <Link
              className="mobile-static-nav__logo"
              href="/#hero"
              aria-label="Casa Rosier"
              onClick={() => setStaticMobileOpen(false)}
            >
              <img
                className="mobile-static-nav__logo-image"
                src="/img/logo-header.png"
                alt="Casa Rosier"
              />
            </Link>
            <button
              className="mobile-static-nav__toggle"
              type="button"
              aria-expanded={staticMobileOpen}
              aria-controls="mobile-static-menu"
              aria-label={staticMobileOpen ? "Cerrar menu" : "Abrir menu"}
              onClick={() => setStaticMobileOpen((open) => !open)}
            >
              <span className="mobile-scroll-nav__icon" aria-hidden="true" />
            </button>
          </div>

          <nav
            id="mobile-static-menu"
            className="mobile-static-menu"
            aria-label="Principal movil"
            hidden={!staticMobileOpen}
          >
            <ul className="mobile-menu__list">
              {mobileItems.map((item, index) => {
                const children =
                  item.children?.filter((child) => child.visible) ?? [];
                const open = mobileAccordion === item.label;
                const submenuId = `mobile-static-submenu-${index}`;
                return (
                  <li
                    className={classNames(
                      "mobile-menu__item",
                      open && "mobile-menu__item--open"
                    )}
                    key={item.label}
                  >
                    <div className="mobile-menu__row">
                      <Link
                        className="mobile-menu__link"
                        href={item.href}
                        aria-current={current(item.href) ? "page" : undefined}
                        onClick={() => setStaticMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                      {children.length > 0 && (
                        <button
                          className="mobile-menu__toggle"
                          type="button"
                          aria-expanded={open}
                          aria-controls={submenuId}
                          aria-label={`Abrir submenu de ${item.label}`}
                          onClick={() =>
                            setMobileAccordion(open ? null : item.label)
                          }
                        >
                          <span aria-hidden="true">{open ? "x" : "+"}</span>
                        </button>
                      )}
                    </div>
                    {children.length > 0 && (
                      <div className="mobile-submenu" id={submenuId}>
                        <div className="mobile-submenu__inner">
                          <ul className="mobile-submenu__list">
                            {children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  className="mobile-submenu__link"
                                  href={child.href}
                                  aria-current={
                                    current(child.href) ? "page" : undefined
                                  }
                                  onClick={() => setStaticMobileOpen(false)}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}

      <div
        className={classNames(
          "mobile-scroll-nav",
          (mobileScrolled || mobileOpen) && "is-visible",
          mobileOpen && "is-open"
        )}
      >
        <div className="mobile-scroll-nav__bar">
          <Link
            className="mobile-scroll-nav__logo"
            href="/#hero"
            aria-label="Casa Rosier"
            onClick={() => setMobileOpen(false)}
          >
            <img
              className="mobile-scroll-nav__logo-image"
              src="/img/logo-header.png"
              alt="Casa Rosier"
            />
          </Link>
          <button
            className="mobile-scroll-nav__toggle"
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-scroll-menu"
            aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="mobile-scroll-nav__icon" aria-hidden="true" />
          </button>
        </div>

        <nav
          id="mobile-scroll-menu"
          className="mobile-scroll-menu"
          aria-label="Principal movil"
          hidden={!mobileOpen}
        >
          <ul className="mobile-menu__list">
            {mobileItems.map((item, index) => {
              const children =
                item.children?.filter((child) => child.visible) ?? [];
              const open = mobileAccordion === item.label;
              const submenuId = `mobile-submenu-${index}`;
              return (
                <li
                  className={classNames(
                    "mobile-menu__item",
                    open && "mobile-menu__item--open"
                  )}
                  key={item.label}
                >
                  <div className="mobile-menu__row">
                    <Link
                      className="mobile-menu__link"
                      href={item.href}
                      aria-current={current(item.href) ? "page" : undefined}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {children.length > 0 && (
                      <button
                        className="mobile-menu__toggle"
                        type="button"
                        aria-expanded={open}
                        aria-controls={submenuId}
                        aria-label={`Abrir submenu de ${item.label}`}
                        onClick={() =>
                          setMobileAccordion(open ? null : item.label)
                        }
                      >
                        <span aria-hidden="true">{open ? "x" : "+"}</span>
                      </button>
                    )}
                  </div>
                  {children.length > 0 && (
                    <div className="mobile-submenu" id={submenuId}>
                      <div className="mobile-submenu__inner">
                        <ul className="mobile-submenu__list">
                          {children.map((child) => (
                            <li key={child.href}>
                              <Link
                                className="mobile-submenu__link"
                                href={child.href}
                                aria-current={
                                  current(child.href) ? "page" : undefined
                                }
                                onClick={() => setMobileOpen(false)}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
