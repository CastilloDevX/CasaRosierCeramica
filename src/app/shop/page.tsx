import type { Metadata } from "next";
import { ShopIndexPage } from "@/features/shop/ShopIndexPage";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Piezas ceramicas creadas en el estudio. Objetos unicos, series pequenas y piezas disponibles para compra."
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ShopPage() {
  return <ShopIndexPage />;
}
