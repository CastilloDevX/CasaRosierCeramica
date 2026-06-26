import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { SocialGallery } from "@/components/home/SocialGallery";
import { BodyClass } from "@/components/layout/BodyClass";
import { Footer } from "@/components/layout/Footer";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import type { ExperienceItem } from "@/data/types";

export function CollectionLanding({
  bodyClass,
  eyebrow,
  title,
  lede,
  items
}: {
  bodyClass: string;
  eyebrow: string;
  title: string;
  lede: string;
  items: readonly ExperienceItem[];
}) {
  return (
    <>
      <BodyClass className={bodyClass} />
      <HeaderInterno eyebrow={eyebrow} title={title} />
      <main>
        <CollectionGrid items={items} lede={lede} />
        <SocialGallery />
      </main>
      <Footer />
    </>
  );
}
