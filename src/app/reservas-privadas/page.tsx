import type { Metadata } from "next";
import { ExperienceCollectionPage } from "@/features/experiences/ExperienceCollectionPage";
import { experienceCollections } from "@/features/experiences/experienceRoutes";

export const metadata: Metadata = {
  title: "Experiencias",
  description:
    "Reservas privadas y experiencias de ceramica de Casa Rosier en Barcelona."
};

export default function PrivateExperiencesPage() {
  return (
    <ExperienceCollectionPage config={experienceCollections.privateBookings} />
  );
}
