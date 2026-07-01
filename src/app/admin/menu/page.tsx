import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import MenusTable from "@/components/admin/MenusTable";
import SectionEmptyState from "@/components/admin/SectionEmptyState";
import { getMenus } from "@/lib/cms/menus";
import type { MenuLocation, MenuStatus } from "@/lib/cms/types";

const locLabels: Record<"all" | MenuLocation, string> = { all: "Todos", main: "Principal", mobile: "Móvil", footer: "Footer" };
const statusLabels: Record<"all" | MenuStatus, string> = { all: "Todos", active: "Activo", draft: "Borrador", archived: "Archivado", deleted: "Papelera" };

export default async function MenuPage({ searchParams }: { searchParams?: { location?: string; status?: string } }) {
  const menus = await getMenus();
  const location = (searchParams?.location as keyof typeof locLabels) || "all";
  const status = (searchParams?.status as keyof typeof statusLabels) || "all";

  const filtered = menus.filter((m) => {
    const matchesLocation = location === "all" || m.location === location;
    const matchesStatus = status === "all" || m.status === status;
    return matchesLocation && matchesStatus && m.status !== "deleted";
  });

  return (
    <AdminShell>
      <div className="section-head">
        <div>
          <p className="auth-kicker">CMS</p>
          <h2>Menús</h2>
        </div>
        <Link className="primary-btn inline" href="/admin/menu/new">Crear menú</Link>
      </div>

      <div className="filters">
        <div className="filter-group">
          {(["all", "main", "mobile", "footer"] as const).map((item) => (
            <Link key={item} className={item === location ? "chip active" : "chip"} href={`/admin/menu?location=${item}&status=${status}`}>{locLabels[item]}</Link>
          ))}
        </div>
        <div className="filter-group">
          {(["all", "active", "draft", "archived"] as const).map((item) => (
            <Link key={item} className={item === status ? "chip active" : "chip"} href={`/admin/menu?location=${location}&status=${item}`}>{statusLabels[item]}</Link>
          ))}
        </div>
      </div>

      {filtered.length ? <MenusTable menus={filtered} /> : (
        <SectionEmptyState title="Aún no hay menús" description="Crea el primer menú de navegación para el sitio." actionHref="/admin/menu/new" actionLabel="Crear primer menú" />
      )}
    </AdminShell>
  );
}
