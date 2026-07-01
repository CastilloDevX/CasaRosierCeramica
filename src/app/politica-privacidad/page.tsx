import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/features/legal/PrivacyPolicyPage";

export const metadata: Metadata = {
  title: "Políticas de privacidad",
  description: "Políticas de privacidad de Casa Rosier."
};

export default function PrivacyPage() {
  return <PrivacyPolicyPage />;
}
