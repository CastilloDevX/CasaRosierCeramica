import Link from "next/link"; import AdminShell from "@/components/admin/AdminShell"; import PromoBannersTable from "@/components/admin/PromoBannersTable"; import SectionEmptyState from "@/components/admin/SectionEmptyState"; import { getPromoBanners } from "@/lib/cms/promo-banners";

export default async function Page({ searchParams }: { searchParams?: { status?: string } }) {
  const items = await getPromoBanners(); const status = searchParams?.status || "all";
  const filtered = items.filter((x) => (status === "all" || x.status === status) && x.status !== "deleted");
  return (<AdminShell><div className="section-head"><div><p className="auth-kicker">CMS</p><h2>Banners promocionales</h2><p className="muted">Configura los modales promocionales que pueden mostrarse al entrar al sitio.</p></div><Link className="primary-btn inline" href="/admin/components/promo-banners/new">Crear banner</Link></div>
    <div className="filters"><div className="filter-group">{["all","draft","published","archived"].map((s) => <Link key={s} className={s === status ? "chip active" : "chip"} href={`/admin/components/promo-banners?status=${s}`}>{s === "all" ? "Todos" : s === "draft" ? "Borrador" : s === "published" ? "Publicado" : "Archivado"}</Link>)}</div></div>
    {filtered.length ? <PromoBannersTable items={filtered} /> : <SectionEmptyState title="Aún no hay banners" description="Crea el primer banner promocional." actionHref="/admin/components/promo-banners/new" actionLabel="Crear banner" />}
  </AdminShell>);
}
