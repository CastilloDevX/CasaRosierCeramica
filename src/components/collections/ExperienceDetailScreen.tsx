import { DetailPage } from "@/components/collections/DetailPage";
import { SocialGallery } from "@/components/home/SocialGallery";
import { BodyClass } from "@/components/layout/BodyClass";
import { Footer } from "@/components/layout/Footer";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import type { ExperienceItem } from "@/data/types";

export function ExperienceDetailScreen({
  item
}: {
  item: ExperienceItem;
}) {
  const promoPage =
    item.kind === "private-booking" ? undefined : item.kind.replace("-card", "");
  return (
    <>
      <BodyClass
        className="class-detail-page"
        data={promoPage ? { promoPage } : {}}
      />
      <HeaderInterno
        image={item.heroImage}
        eyebrow={item.category}
        title={item.heroTitle}
      />
      <main>
        <DetailPage item={item} />
        <SocialGallery />
      </main>
      <Footer />
    </>
  );
}
