import OfferingsCategoryPage from "@/components/admin/OfferingsCategoryPage";

export default function ClasesPage({ searchParams }: { searchParams?: { q?: string; sort?: string; page?: string } }) {
  return (
    <OfferingsCategoryPage
      title="Clases"
      subtitle="Administra únicamente clases"
      type="class"
      basePath="/admin/clases"
      typeLabel="Clase"
      emptyIcon="school"
      emptyTitle="No hay clases creadas todavía."
      emptyDescription="Crea la primera clase para empezar."
      createLabel="Crear nueva clase"
      searchParams={searchParams}
    />
  );
}
