import type { Metadata } from "next";
import { ExperienceCollectionPage } from "@/features/experiences/ExperienceCollectionPage";
import { experienceCollections } from "@/features/experiences/experienceRoutes";

export const metadata: Metadata = {
  title: "Workshops de ceramica",
  description: "Workshops de ceramica de Casa Rosier en Barcelona."
};

export default function WorkshopsPage() {
  return <ExperienceCollectionPage config={experienceCollections.workshops} />;
}
