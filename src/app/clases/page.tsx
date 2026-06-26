import type { Metadata } from "next";
import { CollectionLanding } from "@/components/collections/CollectionLanding";
import { classes } from "@/data/classes";

export const metadata: Metadata = {
  title: "Cursos y talleres de ceramica",
  description:
    "Listado de clases y workshops de Casa Rosier Ceramica en Barcelona."
};

export default function ClassesPage() {
  return (
    <CollectionLanding
      bodyClass="collection-page classes-page"
      eyebrow="En Barcelona"
      title="Cursos y talleres de ceramica"
      lede="Un espacio para aprender ceramica con calma, explorar tecnicas, tocar la materia y encontrar una practica guiada que acompana cada proceso desde el primer gesto."
      items={classes}
    />
  );
}
