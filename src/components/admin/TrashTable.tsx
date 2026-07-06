"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { TrashItem } from "@/lib/cms/types";

const apiMap: Record<string, { restore: string; del: string; method?: string; body?: (id: string, action: string) => string }> = {
  offering: { restore: `/api/admin/offerings/`, del: `/api/admin/offerings/` },
  media: { restore: "/api/admin/media/delete", del: "/api/admin/media/delete", method: "POST", body: (id, action) => JSON.stringify({ id, action }) },
  header: { restore: `/api/admin/headers/`, del: `/api/admin/headers/` },
  menu: { restore: `/api/admin/menus/`, del: `/api/admin/menus/` },
  page: { restore: `/api/admin/pages/`, del: `/api/admin/pages/` },
  social_gallery: { restore: `/api/admin/components/social-galleries/`, del: `/api/admin/components/social-galleries/` },
  testimonial: { restore: `/api/admin/components/testimonials/`, del: `/api/admin/components/testimonials/` },
  footer: { restore: `/api/admin/components/footers/`, del: `/api/admin/components/footers/` },
  promo_banner: { restore: `/api/admin/components/promo-banners/`, del: `/api/admin/components/promo-banners/` },
  faq: { restore: `/api/admin/components/faqs/`, del: `/api/admin/components/faqs/` },
  teacher: { restore: `/api/admin/components/teachers/`, del: `/api/admin/components/teachers/` },
  landing_page: { restore: `/api/admin/landing-pages/`, del: `/api/admin/landing-pages/` },
  reservation: { restore: `/api/admin/reservas/`, del: `/api/admin/reservas/` },
  form: { restore: `/api/admin/formularios/`, del: `/api/admin/formularios/` },
  form_submission: { restore: `/api/admin/mensajes/`, del: `/api/admin/mensajes/` },
  blog_post: { restore: `/api/admin/bitacora/`, del: `/api/admin/bitacora/` },
  product: { restore: `/api/admin/shop/products/`, del: `/api/admin/shop/products/` },
  product_category: { restore: `/api/admin/shop/categories/`, del: `/api/admin/shop/categories/` },
  order: { restore: `/api/admin/shop/orders/`, del: `/api/admin/shop/orders/` },
  coupon: { restore: `/api/admin/shop/coupons/`, del: `/api/admin/shop/coupons/` },
  shipping_method: { restore: `/api/admin/shop/shipping`, del: `/api/admin/shop/shipping`, method: "POST", body: (id: string, action: string) => JSON.stringify({ id, action }) },
  redirect: { restore: `/api/admin/redirecciones/`, del: `/api/admin/redirecciones/` },
};

type DateSort = "newest" | "oldest";
type DeleteModalState = {
  item: TrashItem;
  status: "confirm" | "loading" | "success" | "error";
  message?: string;
} | null;

function deletedTime(item: TrashItem) {
  const time = new Date(item.deleted_at).getTime();
  return Number.isFinite(time) ? time : 0;
}

function normalized(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function TrashTable({ items }: { items: TrashItem[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [dateSort, setDateSort] = useState<DateSort>("newest");
  const [entityFilter, setEntityFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>(null);

  const entityOptions = useMemo(() => Array.from(new Set(items.map((item) => item.entity_type))).sort(), [items]);

  const visibleItems = useMemo(() => {
    const search = normalized(query.trim());
    return [...items]
      .filter((item) => {
        if (entityFilter !== "all" && item.entity_type !== entityFilter) return false;
        if (!search) return true;
        const deletedAt = new Date(item.deleted_at);
        const haystack = normalized([
          item.title,
          item.entity_type,
          item.deleted_by,
          Number.isFinite(deletedAt.getTime()) ? deletedAt.toLocaleString() : item.deleted_at,
        ].join(" "));
        return haystack.includes(search);
      })
      .sort((a, b) => {
        const direction = dateSort === "newest" ? -1 : 1;
        return (deletedTime(a) - deletedTime(b)) * direction;
      });
  }, [dateSort, entityFilter, items, query]);

  async function action(item: TrashItem, type: "restore" | "del") {
    const cfg = apiMap[item.entity_type];
    if (!cfg) throw new Error("No hay una ruta configurada para este tipo de elemento.");
    const url = type === "restore" ? cfg.restore : cfg.del;
    const method = cfg.method || "PATCH";
    const body = cfg.body ? cfg.body(item.entity_id, type === "restore" ? "restore" : "permanent") :
      method === "DELETE" ? undefined :
      JSON.stringify({ action: type === "restore" ? "restore" : "trash" });
    const res = await fetch(method === "DELETE" ? `${url}${item.entity_id}` : url === `/api/admin/media/delete` ? url : `${url}${item.entity_id}`, {
      method: cfg.method || (type === "del" ? "DELETE" : "PATCH"),
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { error?: string };
      throw new Error(data.error || "No se pudo completar la acción.");
    }
    router.refresh();
  }

  async function confirmPermanentDelete() {
    if (!deleteModal || deleteModal.status === "loading") return;

    const item = deleteModal.item;
    setDeleteModal({ item, status: "loading" });

    try {
      await action(item, "del");
      setDeleteModal({
        item,
        status: "success",
        message: "Tu elemento se ha eliminado definitivamente. No hay recuperación.",
      });
    } catch (error) {
      setDeleteModal({
        item,
        status: "error",
        message: error instanceof Error ? error.message : "No se pudo eliminar el elemento definitivamente.",
      });
    }
  }

  return (
    <>
      <div className="table-card">
        <div className="trash-table-head">
        <div className="trash-table-head__controls" aria-label="Controles de papelera">
          <label className="trash-table-head__field">
            <span>Entidad</span>
            <select value={entityFilter} onChange={(event) => setEntityFilter(event.target.value)}>
              <option value="all">Todas las entidades</option>
              {entityOptions.map((entity) => (
                <option key={entity} value={entity}>{entity}</option>
              ))}
            </select>
          </label>
          <label className="trash-table-head__field">
            <span>Fecha</span>
            <select value={dateSort} onChange={(event) => setDateSort(event.target.value as DateSort)}>
              <option value="newest">Más recientes primero</option>
              <option value="oldest">Más antiguos primero</option>
            </select>
          </label>
          <label className="trash-table-head__field trash-table-head__field--search">
            <span>Buscador</span>
            <input
              type="search"
              value={query}
              placeholder="Buscar en papelera"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Entidad</th>
              <th>Título</th>
              <th>Eliminado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((item) => (
              <tr key={item.id}>
                <td><span className="entity-badge">{item.entity_type}</span></td>
                <td>{item.title}</td>
                <td>{new Date(item.deleted_at).toLocaleString()}</td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="secondary-btn" onClick={() => action(item, "restore")}>Restaurar</button>
                    <button type="button" className="danger-btn" onClick={() => setDeleteModal({ item, status: "confirm" })}>Eliminar definitivamente</button>
                  </div>
                </td>
              </tr>
            ))}
            {!visibleItems.length ? (
              <tr>
                <td colSpan={4} className="trash-table-empty">
                  No hay resultados para la búsqueda actual.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {deleteModal ? (
        <div className="admin-action-modal trash-delete-modal" role="dialog" aria-modal="true" aria-labelledby="trash-delete-modal-title">
          <button
            type="button"
            className="admin-action-modal__backdrop"
            aria-label="Cerrar modal"
            disabled={deleteModal.status === "loading"}
            onClick={() => {
              if (deleteModal.status !== "loading") setDeleteModal(null);
            }}
          />
          <div className={`admin-action-modal__panel admin-action-modal__panel--${deleteModal.status === "success" ? "success" : deleteModal.status === "error" ? "error" : "confirm"}`}>
            <div className={`admin-action-modal__icon ${deleteModal.status === "loading" ? "admin-action-modal__icon--loading" : ""}`} aria-hidden="true">
              <span className="material-symbols-outlined">
                {deleteModal.status === "success" ? "check_circle" : deleteModal.status === "error" ? "error" : deleteModal.status === "loading" ? "progress_activity" : "warning"}
              </span>
            </div>
            <div className="admin-action-modal__body">
              <h3 id="trash-delete-modal-title">
                {deleteModal.status === "success"
                  ? "Eliminación definitiva completada"
                  : deleteModal.status === "error"
                    ? "No se pudo eliminar"
                    : deleteModal.status === "loading"
                      ? "Eliminando definitivamente"
                      : "Eliminar definitivamente"}
              </h3>
              <p>
                {deleteModal.message || (deleteModal.status === "loading"
                  ? "Estamos eliminando el elemento. Mantén esta ventana abierta."
                  : `Se eliminará "${deleteModal.item.title}" de forma permanente.`)}
              </p>
              {deleteModal.status === "confirm" ? (
                <ul className="admin-action-modal__details">
                  <li>Esta acción no se puede deshacer.</li>
                  <li>El elemento no podrá restaurarse desde la papelera.</li>
                </ul>
              ) : null}
            </div>
            <div className="admin-action-modal__actions">
              {deleteModal.status === "confirm" ? (
                <button type="button" className="secondary-btn" onClick={() => setDeleteModal(null)}>
                  Cancelar
                </button>
              ) : null}
              {deleteModal.status === "confirm" ? (
                <button type="button" className="danger-btn" onClick={confirmPermanentDelete}>
                  Eliminar definitivamente
                </button>
              ) : null}
              {deleteModal.status === "success" || deleteModal.status === "error" ? (
                <button type="button" className={deleteModal.status === "error" ? "danger-btn" : "primary-btn"} onClick={() => setDeleteModal(null)}>
                  Entendido
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
