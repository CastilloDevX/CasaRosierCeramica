"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const COOKIE_KEY = "casarosier_cookie_accept_v1";

export function CookieBar() {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const readPreference = () => {
      try {
        setVisible(!window.localStorage.getItem(COOKIE_KEY));
      } catch {
        setVisible(true);
      }
    };
    queueMicrotask(readPreference);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("cookiebar-visible", visible);
    document.body.style.setProperty(
      "--cookiebar-offset",
      visible ? `${barRef.current?.offsetHeight ?? 0}px` : "0px"
    );
    return () => {
      document.body.classList.remove("cookiebar-visible");
      document.body.style.removeProperty("--cookiebar-offset");
    };
  }, [visible]);

  const choose = (value: "accept" | "reject") => {
    try {
      window.localStorage.setItem(COOKIE_KEY, value);
    } catch {
      // The preference still applies for the current page.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div id="cookiebar" className="cookiebar" ref={barRef}>
      <div className="cookiebar__inner">
        <p className="cookiebar__text">
          Usamos cookies para mejorar tu experiencia. Consulta la{" "}
          <Link href="/politica-privacidad">política de privacidad</Link>.
        </p>
        <div className="cookiebar__actions">
          <button
            className="cookiebar__btn"
            type="button"
            onClick={() => choose("reject")}
          >
            rechazar
          </button>
          <button
            className="cookiebar__btn cookiebar__btn--primary"
            type="button"
            onClick={() => choose("accept")}
          >
            aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
