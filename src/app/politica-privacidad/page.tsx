import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/features/legal/PrivacyPolicyPage";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de Casa Rosier."
};

export default function PrivacyPage() {
  return <PrivacyPolicyPage />;
}
