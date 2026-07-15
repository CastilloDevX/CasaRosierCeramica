import type { Metadata } from "next";
import { ExperienceCollectionPage } from "@/features/experiences/ExperienceCollectionPage";
import { getExperienceCollectionConfig } from "@/features/experiences/experienceRoutes";

export const metadata: Metadata = {
  title: "Experiencias",
  description:
    "Experiencias privadas de ceramica de Casa Rosier en Barcelona."
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExperienciasPage() {
  const config = await getExperienceCollectionConfig("privateBookings");
  return <ExperienceCollectionPage config={config} />;
}
