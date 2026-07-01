"use client";

import { useRouter } from "next/navigation";
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

export default function TrashTable({ items }: { items: TrashItem[] }) {
  const router = useRouter();

  async function action(item: TrashItem, type: "restore" | "del") {
    const cfg = apiMap[item.entity_type];
    if (!cfg) return;
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
    if (res.ok) router.refresh();
  }

  return (
    <div className="table-card">
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
          {items.map((item) => (
            <tr key={item.id}>
              <td><span className="entity-badge">{item.entity_type}</span></td>
              <td>{item.title}</td>
              <td>{new Date(item.deleted_at).toLocaleString()}</td>
              <td>
                <div className="row-actions">
                  <button type="button" className="secondary-btn" onClick={() => action(item, "restore")}>Restaurar</button>
                  <button type="button" className="danger-btn" onClick={() => action(item, "del")}>Eliminar definitivamente</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
