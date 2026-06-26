import type { Metadata } from "next";
import { BodyClass } from "@/components/layout/BodyClass";
import { Footer } from "@/components/layout/Footer";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { ShopGrid } from "@/components/shop/ShopGrid";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Piezas ceramicas creadas en el estudio. Objetos unicos, series pequenas y piezas disponibles para compra."
};

export default function ShopPage() {
  return (
    <>
      <BodyClass className="shop-page" />
      <HeaderInterno />
      <main>
        <ShopGrid />
      </main>
      <Footer />
    </>
  );
}
