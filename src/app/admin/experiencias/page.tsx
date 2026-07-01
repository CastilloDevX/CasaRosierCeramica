import OfferingsCategoryPage from "@/components/admin/OfferingsCategoryPage";

export default function ExperienciasPage({ searchParams }: { searchParams?: { q?: string; sort?: string; page?: string } }) {
  return (
    <OfferingsCategoryPage
      title="Experiencias"
      subtitle="Administra únicamente experiencias"
      type="experience"
      basePath="/admin/experiencias"
      typeLabel="Experiencia"
      emptyIcon="local_activity"
      emptyTitle="No hay experiencias creadas todavía."
      emptyDescription="Crea la primera experiencia para empezar."
      createLabel="Crear nueva experiencia"
      searchParams={searchParams}
    />
  );
}
