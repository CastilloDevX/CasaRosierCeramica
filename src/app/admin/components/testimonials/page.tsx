import Link from "next/link"; import AdminShell from "@/components/admin/AdminShell"; import TestimonialsTable from "@/components/admin/TestimonialsTable"; import SectionEmptyState from "@/components/admin/SectionEmptyState"; import { getTestimonials } from "@/lib/cms/testimonials";

export default async function Page({ searchParams }: { searchParams?: { status?: string } }) {
  const items = await getTestimonials(); const status = searchParams?.status || "all";
  const filtered = items.filter((x) => (status === "all" || x.status === status) && x.status !== "deleted");
  return (<AdminShell><div className="section-head"><div><p className="auth-kicker">CMS</p><h2>Testimonios</h2><p className="muted">Administra las reseñas visibles en la página principal.</p></div><Link className="primary-btn inline" href="/admin/components/testimonials/new">Crear testimonio</Link></div>
    <div className="filters"><div className="filter-group">{["all","draft","published","archived"].map((s) => <Link key={s} className={s === status ? "chip active" : "chip"} href={`/admin/components/testimonials?status=${s}`}>{s === "all" ? "Todos" : s === "draft" ? "Borrador" : s === "published" ? "Publicado" : "Archivado"}</Link>)}</div></div>
    {filtered.length ? <TestimonialsTable items={filtered} /> : <SectionEmptyState title="Aún no hay testimonios" description="Crea el primer testimonio." actionHref="/admin/components/testimonials/new" actionLabel="Crear testimonio" />}
  </AdminShell>);
}
