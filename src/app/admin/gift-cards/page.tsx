import OfferingsCategoryPage from "@/components/admin/OfferingsCategoryPage";

export default function GiftCardsPage({ searchParams }: { searchParams?: { q?: string; sort?: string; page?: string } }) {
  return (
    <OfferingsCategoryPage
      title="Gift Cards"
      subtitle="Administra únicamente gift cards"
      type="gift_card"
      basePath="/admin/gift-cards"
      typeLabel="Gift Card"
      emptyIcon="card_giftcard"
      emptyTitle="No hay gift cards creadas todavía."
      emptyDescription="Crea la primera gift card para empezar."
      createLabel="Crear nueva gift card"
      searchParams={searchParams}
    />
  );
}
