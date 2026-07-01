import OfferingsCategoryPage from "@/components/admin/OfferingsCategoryPage";

export default function WorkshopsPage({ searchParams }: { searchParams?: { q?: string; sort?: string; page?: string } }) {
  return (
    <OfferingsCategoryPage
      title="Workshops"
      subtitle="Administra únicamente workshops"
      type="workshop"
      basePath="/admin/workshops"
      typeLabel="Workshop"
      emptyIcon="school"
      emptyTitle="No hay workshops creados todavía."
      emptyDescription="Crea el primer workshop para empezar."
      createLabel="Crear nuevo workshop"
      searchParams={searchParams}
    />
  );
}
