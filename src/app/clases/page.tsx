import type { Metadata } from "next";
import { ExperienceCollectionPage } from "@/features/experiences/ExperienceCollectionPage";
import { experienceCollections } from "@/features/experiences/experienceRoutes";

export const metadata: Metadata = {
  title: "Cursos y talleres de ceramica",
  description:
    "Listado de clases y workshops de Casa Rosier Ceramica en Barcelona."
};

export default function ClassesPage() {
  return <ExperienceCollectionPage config={experienceCollections.classes} />;
}
