import Link from "@/components/admin/AdminLink"; import AdminShell from "@/components/admin/AdminShell"; import FootersTable from "@/components/admin/FootersTable"; import SectionEmptyState from "@/components/admin/SectionEmptyState"; import { getFooters } from "@/lib/cms/footers";

export default async function Page({ searchParams }: { searchParams?: { status?: string } }) {
  const items = await getFooters(); const status = searchParams?.status || "all";
  const filtered = items.filter((x) => (status === "all" || x.status === status) && x.status !== "deleted");
  return (<AdminShell><div className="section-head"><div><p className="auth-kicker">CMS</p><h2>Footers</h2></div><Link className="primary-btn inline" href="/admin/components/footers/new">Crear footer</Link></div>
    <div className="filters"><div className="filter-group">{["all","draft","published","archived"].map((s) => <Link key={s} className={s === status ? "chip active" : "chip"} href={`/admin/components/footers?status=${s}`}>{s === "all" ? "Todos" : s === "draft" ? "Borrador" : s === "published" ? "Publicado" : "Archivado"}</Link>)}</div></div>
    {filtered.length ? <FootersTable items={filtered} /> : <SectionEmptyState title="Aún no hay footers" description="Crea el primer footer." actionHref="/admin/components/footers/new" actionLabel="Crear footer" />}
  </AdminShell>);
}
