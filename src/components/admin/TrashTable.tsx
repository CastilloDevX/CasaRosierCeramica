"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AdminActionModal from "./AdminActionModal";
import AdminPagination from "./AdminPagination";
import { getTrashEntityLabel, type TrashEntityOption } from "@/lib/cms/trash-entity-labels";
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
type TrashResponse = {
  items: TrashItem[];
  entityOptions: TrashEntityOption[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sort: DateSort;
  entityType: string;
  query: string;
  error?: string;
};
type DeleteModalState = {
  item: TrashItem;
  status: "confirm" | "success" | "error";
  message?: string;
} | null;

function deletedTime(item: TrashItem) {
  const time = new Date(item.deleted_at).getTime();
  return Number.isFinite(time) ? time : 0;
}

export default function TrashTable({
  initialItems,
  initialEntityOptions,
  initialTotal,
  initialPage,
  initialPageSize,
  initialTotalPages,
  initialSort,
}: {
  initialItems: TrashItem[];
  initialEntityOptions: TrashEntityOption[];
  initialTotal: number;
  initialPage: number;
  initialPageSize: number;
  initialTotalPages: number;
  initialSort: DateSort;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [dateSort, setDateSort] = useState<DateSort>(initialSort);
  const [entityFilter, setEntityFilter] = useState("all");
  const [entityOptions, setEntityOptions] = useState(initialEntityOptions);
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>(null);
  const isDeletingPermanently = pendingAction?.startsWith("del:");
  const isBusy = isLoading || Boolean(pendingAction);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    async function loadPage() {
      setIsLoading(true);
      setError("");
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
        sort: dateSort,
        entity_type: entityFilter,
      });
      if (debouncedQuery) params.set("q", debouncedQuery);
      const response = await fetch(`/api/admin/trash?${params.toString()}`, { cache: "no-store" });
      const data = await response.json().catch(() => ({})) as TrashResponse;
      if (cancelled) return;
      if (!response.ok) {
        setError(data.error || "No se pudo cargar la papelera.");
      } else {
        setItems(data.items);
        setEntityOptions(data.entityOptions);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        if (page > data.totalPages) setPage(data.totalPages);
      }
      setIsLoading(false);
    }
    void loadPage();
    return () => {
      cancelled = true;
    };
  }, [dateSort, debouncedQuery, entityFilter, page, pageSize]);

  const visibleItems = useMemo(() => [...items].sort((a, b) => {
    const direction = dateSort === "newest" ? -1 : 1;
    return (deletedTime(a) - deletedTime(b)) * direction;
  }), [dateSort, items]);

  async function reloadCurrentPage() {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
      sort: dateSort,
      entity_type: entityFilter,
    });
    if (debouncedQuery) params.set("q", debouncedQuery);
    const response = await fetch(`/api/admin/trash?${params.toString()}`, { cache: "no-store" });
    const data = await response.json().catch(() => ({})) as TrashResponse;
    if (!response.ok) return;
    setItems(data.items);
    setEntityOptions(data.entityOptions);
    setTotal(data.total);
    setTotalPages(data.totalPages);
    if (!data.items.length && page > 1) setPage(page - 1);
  }

  async function action(item: TrashItem, type: "restore" | "del") {
    const cfg = apiMap[item.entity_type];
    if (!cfg) throw new Error("No hay una ruta configurada para este tipo de elemento.");
    setPendingAction(`${type}:${item.id}`);
    const url = type === "restore" ? cfg.restore : cfg.del;
    const requestMethod = cfg.method || (type === "del" ? "DELETE" : "PATCH");
    const body = cfg.body
      ? cfg.body(item.entity_id, type === "restore" ? "restore" : "permanent")
      : requestMethod === "DELETE"
        ? undefined
        : JSON.stringify({ action: "restore" });

    try {
      const res = await fetch(url === "/api/admin/media/delete" || url === "/api/admin/shop/shipping" ? url : `${url}${item.entity_id}`, {
        method: requestMethod,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error || "No se pudo completar la acción.");
      }
      await reloadCurrentPage();
      router.refresh();
    } finally {
      setPendingAction(null);
    }
  }

  async function confirmPermanentDelete() {
    if (!deleteModal || pendingAction) return;

    const item = deleteModal.item;

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
            <select value={entityFilter} disabled={isBusy} onChange={(event) => { setEntityFilter(event.target.value); setPage(1); }}>
              <option value="all">Todas las entidades</option>
              {entityOptions.map((entity) => (
                <option key={entity.value} value={entity.value}>{entity.label}</option>
              ))}
            </select>
          </label>
          <label className="trash-table-head__field">
            <span>Fecha</span>
            <select value={dateSort} disabled={isBusy} onChange={(event) => { setDateSort(event.target.value as DateSort); setPage(1); }}>
              <option value="newest">Más recientes primero</option>
              <option value="oldest">Más antiguos primero</option>
            </select>
          </label>
          <label className="trash-table-head__field trash-table-head__field--search">
            <span>Buscador</span>
            <input
              type="search"
              value={query}
              disabled={isBusy}
              placeholder="Buscar en papelera"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        </div>
        <div className="paginated-table-meta">
          <p className="paginated-table-summary">{total} elementos en papelera</p>
          {isLoading ? <span className="paginated-table-loading">Cargando...</span> : null}
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <div className={isBusy ? "paginated-table is-loading" : "paginated-table"}>
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
                <td><span className="entity-badge">{getTrashEntityLabel(item)}</span></td>
                <td>{item.title}</td>
                <td>{new Date(item.deleted_at).toLocaleString()}</td>
                <td>
                  <div className="row-actions trash-row-actions">
                    <button type="button" className="secondary-btn" disabled={isBusy} onClick={() => action(item, "restore")}>
                      {pendingAction === `restore:${item.id}` ? "Restaurando..." : "Restaurar"}
                    </button>
                    <button type="button" className="danger-btn" disabled={isBusy} onClick={() => setDeleteModal({ item, status: "confirm" })}>
                      Eliminar definitivamente
                    </button>
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
        <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} disabled={isBusy} />
      </div>

      <AdminActionModal
        open={Boolean(deleteModal) || Boolean(isDeletingPermanently)}
        type={isDeletingPermanently ? "info" : deleteModal?.status === "success" ? "success" : deleteModal?.status === "error" ? "error" : "confirm"}
        title={isDeletingPermanently ? "Eliminando definitivamente" : deleteModal?.status === "success" ? "Eliminación completada" : deleteModal?.status === "error" ? "No se pudo eliminar" : "Eliminar definitivamente"}
        message={
          isDeletingPermanently
            ? "Estamos eliminando el elemento. Mantén esta ventana abierta."
            : deleteModal?.message || (deleteModal ? `Se eliminará "${deleteModal.item.title}" de forma permanente. Esta acción no se puede deshacer.` : "")
        }
        details={deleteModal?.status === "confirm" ? ["El elemento no podrá restaurarse desde la papelera."] : undefined}
        confirmLabel={isDeletingPermanently ? "Eliminando..." : deleteModal?.status === "confirm" ? "Eliminar" : "Entendido"}
        cancelLabel="Cancelar"
        confirmDisabled={Boolean(isDeletingPermanently)}
        cancelDisabled={Boolean(isDeletingPermanently)}
        closeOnConfirm={deleteModal?.status !== "confirm"}
        onConfirm={() => {
          if (isDeletingPermanently) return;
          if (deleteModal?.status === "confirm") void confirmPermanentDelete();
        }}
        onClose={() => {
          if (!isDeletingPermanently) setDeleteModal(null);
        }}
      />
    </>
  );
}
