import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import BlogTable from "@/components/admin/BlogTable";
import SectionEmptyState from "@/components/admin/SectionEmptyState";
import { getBlogPosts } from "@/lib/cms/blog";

const statusLabels: Record<string, string> = {
  all: "Todos",
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
};

export default async function BitacoraPage({ searchParams }: { searchParams?: { status?: string } }) {
  const items = await getBlogPosts();
  const status = searchParams?.status || "all";
  const active = items
    .filter((p) => (status === "all" || p.status === status) && p.status !== "deleted")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || +new Date(b.updated_at) - +new Date(a.updated_at));

  return (
    <AdminShell>
      <div className="section-head">
        <div>
          <p className="auth-kicker">CMS</p>
          <h2>Bitácora</h2>
        </div>
        <Link className="primary-btn inline" href="/admin/bitacora/new">Nuevo artículo</Link>
      </div>

      <div className="filters">
        <div className="filter-group">
          {["all", "draft", "published", "archived"].map((item) => (
            <Link
              key={item}
              className={item === status ? "chip active" : "chip"}
              href={`/admin/bitacora?status=${item}`}
            >
              {statusLabels[item]}
            </Link>
          ))}
        </div>
      </div>

      {active.length ? (
        <BlogTable items={active} />
      ) : (
        <SectionEmptyState
          title="Aún no hay artículos"
          description="Crea la primera entrada de la bitácora."
          actionHref="/admin/bitacora/new"
          actionLabel="Crear artículo"
        />
      )}
    </AdminShell>
  );
}
