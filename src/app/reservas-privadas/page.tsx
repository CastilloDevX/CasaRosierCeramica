import type { Metadata } from "next";
import { CollectionLanding } from "@/components/collections/CollectionLanding";
import { privateExperiences } from "@/data/classes";

export const metadata: Metadata = {
  title: "Experiencias",
  description:
    "Reservas privadas y experiencias de ceramica de Casa Rosier en Barcelona."
};

export default function PrivateExperiencesPage() {
  return (
    <CollectionLanding
      bodyClass="collection-page experiences-page"
      eyebrow="Experiencias en Barcelona"
      title="Experiencias"
      lede="Sesiones privadas y encuentros de taller pensados para compartir la ceramica con calma, acompanamiento cercano y una experiencia cuidada desde el primer momento."
      items={privateExperiences}
    />
  );
}
