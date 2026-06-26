import type { Metadata } from "next";
import { CollectionLanding } from "@/components/collections/CollectionLanding";
import { giftCards } from "@/data/classes";

export const metadata: Metadata = {
  title: "Tarjetas de regalo",
  description:
    "Gift cards de Casa Rosier para regalar experiencias de ceramica en Barcelona."
};

export default function GiftCardPage() {
  return (
    <CollectionLanding
      bodyClass="collection-page classes-page"
      eyebrow="Experiencias regalo"
      title="Tarjetas de regalo"
      lede="Gift cards para regalar tiempo de taller, materia y una experiencia ceramica serena, pensada para compartir algo manual, sensible y verdaderamente memorable."
      items={giftCards}
    />
  );
}
