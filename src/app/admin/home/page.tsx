import AdminShell from "@/components/admin/AdminShell";
import HomePageEditor from "@/components/admin/HomePageEditor";
import { getPublicExperienceItems } from "@/features/experiences/experienceDetailRouting";
import { getHomePageSettings } from "@/lib/cms/home-page";
import type { GiftCardItem } from "@/data/types";

export default async function HomeAdminPage() {
  const [page, experienceItems] = await Promise.all([
    getHomePageSettings(),
    getPublicExperienceItems(),
  ]);
  const classes = experienceItems.filter((item) => item.kind === "class");
  const workshops = experienceItems.filter((item) => item.kind === "workshop");
  const giftCards = experienceItems.filter((item): item is GiftCardItem => item.kind === "gift-card");

  return (
    <AdminShell>
      <HomePageEditor page={page} classes={classes} workshops={workshops} giftCards={giftCards} />
    </AdminShell>
  );
}
