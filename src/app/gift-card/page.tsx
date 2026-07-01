import type { Metadata } from "next";
import { ExperienceCollectionPage } from "@/features/experiences/ExperienceCollectionPage";
import { getExperienceCollectionConfig } from "@/features/experiences/experienceRoutes";

export const metadata: Metadata = {
  title: "Tarjetas de regalo",
  description:
    "Gift cards de Casa Rosier para regalar experiencias de ceramica en Barcelona."
};

export default async function GiftCardPage() {
  const config = await getExperienceCollectionConfig("giftCards");
  return <ExperienceCollectionPage config={config} />;
}
