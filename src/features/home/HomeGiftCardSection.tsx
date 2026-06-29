import { GiftCarousel } from "@/components/home/GiftCarousel";
import type { GiftCardItem } from "@/data/types";

export function HomeGiftCardSection({
  items
}: {
  items: readonly GiftCardItem[];
}) {
  return (
    <section id="gift-card" className="gift section">
      <div className="container gift__container">
        <header className="gift__head">
          <h2 className="gift__title section-title">
            Experiencia en Ceramica
          </h2>
          <p className="gift__subtitle section-subtitle">
            Regala una Gift Card
          </p>
        </header>
        <GiftCarousel items={items} />
      </div>
    </section>
  );
}
