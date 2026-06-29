import type { Metadata } from "next";
import { ExperienceCollectionPage } from "@/features/experiences/ExperienceCollectionPage";
import { experienceCollections } from "@/features/experiences/experienceRoutes";

export const metadata: Metadata = {
  title: "Tarjetas de regalo",
  description:
    "Gift cards de Casa Rosier para regalar experiencias de ceramica en Barcelona."
};

export default function GiftCardPage() {
  return <ExperienceCollectionPage config={experienceCollections.giftCards} />;
}
