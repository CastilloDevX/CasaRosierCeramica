import type { Metadata } from "next";
import { HomePage as HomeScreen } from "@/features/home/HomePage";

export const metadata: Metadata = {
  title: "Casa Rosier Cerámica",
  description: "Studio de ceramica en Barcelona"
};

export default function HomePage() {
  return <HomeScreen />;
}
