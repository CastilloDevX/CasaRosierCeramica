import type { Metadata } from "next";
import { CollectionLanding } from "@/components/collections/CollectionLanding";
import { workshops } from "@/data/classes";

export const metadata: Metadata = {
  title: "Workshops de ceramica",
  description: "Workshops de ceramica de Casa Rosier en Barcelona."
};

export default function WorkshopsPage() {
  return (
    <CollectionLanding
      bodyClass="collection-page classes-page"
      eyebrow="En Barcelona"
      title="Workshops de ceramica"
      lede="Un espacio para aprender ceramica con calma, explorar tecnicas, tocar la materia y encontrar una practica guiada que acompana cada proceso desde el primer gesto."
      items={workshops}
    />
  );
}
