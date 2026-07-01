"use client";

import { usePathname } from "next/navigation";
import { CookieBar } from "@/components/layout/CookieBar";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

export function SiteChrome() {
  const pathname = usePathname();
  if (pathname === "/auth" || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <CookieBar />
      {pathname !== "/politica-privacidad" && <WhatsAppFloat />}
    </>
  );
}
