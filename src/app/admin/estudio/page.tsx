import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import SectionEmptyState from "@/components/admin/SectionEmptyState";
import TeachersTable from "@/components/admin/TeachersTable";
import { getTeachers } from "@/lib/cms/teachers";

export default async function StudioAdminPage({ searchParams }: { searchParams?: { status?: string } }) {
  const items = await getTeachers();
  const status = searchParams?.status || "all";
  const filtered = items
    .filter((item) => (status === "all" || item.status === status) && item.status !== "deleted")
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <AdminShell>
      <div className="section-head">
        <div>
          <p className="auth-kicker">CMS</p>
          <h2>El estudio</h2>
        </div>
        <Link className="primary-btn" href="/admin/estudio/new">Crear especialista</Link>
      </div>
      <div className="filters"><div className="filter-group">{["all","draft","published","archived"].map((item) => <Link key={item} className={item === status ? "chip active" : "chip"} href={`/admin/estudio?status=${item}`}>{item === "all" ? "Todos" : item === "draft" ? "Borrador" : item === "published" ? "Publicado" : "Archivado"}</Link>)}</div></div>
      {filtered.length ? <TeachersTable items={filtered} basePath="/admin/estudio" /> : <SectionEmptyState title="Aún no hay especialistas" description="Crea el primer perfil del estudio." actionHref="/admin/estudio/new" actionLabel="Crear especialista" />}
    </AdminShell>
  );
}
