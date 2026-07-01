"use client";

import { useRouter } from "next/navigation";
import type { PromoBanner, PromoStatus } from "@/lib/cms/types";

const statusLabels: Record<PromoStatus, string> = {
  draft: "Borrador",
  published: "Activo",
  archived: "Archivado",
  deleted: "Eliminado",
};

export default function PromoBannersTable({ items }: { items: PromoBanner[] }) {
  const router = useRouter();

  async function run(id: string, action: string) {
    if (action === "trash" && !window.confirm("¿Mover este banner a la papelera?")) return;
    const response = await fetch(`/api/admin/components/promo-banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (response.ok) router.refresh();
  }

  return (
    <div className="admin-card-list promo-card-list">
      {items.map((banner) => (
        <article key={banner.id} className="admin-list-card promo-admin-card">
          <div className="promo-admin-card__preview">
            {banner.image_url ? (
              <img src={banner.image_url} alt={banner.title} />
            ) : (
              <span>Sin imagen</span>
            )}
          </div>
          <div className="admin-list-card__body">
            <div className="admin-list-card__head">
              <div>
                <p className="auth-kicker">{banner.key_text || "Banner promocional"}</p>
                <h3>{banner.title}</h3>
                <p>{banner.text || "Sin descripción general."}</p>
              </div>
              <span className={`status-pill status-pill--${banner.status}`}>
                {statusLabels[banner.status]}
              </span>
            </div>
            {banner.detail_text ? (
              <p className="admin-list-card__copy">{banner.detail_text}</p>
            ) : null}
            <div className="admin-list-card__meta">
              <span>Botón: {banner.button_text || "Sin texto"}</span>
              <span>{banner.end_date ? `Finaliza ${new Date(banner.end_date).toLocaleDateString()}` : "Sin fecha de fin"}</span>
              <span>{banner.link_url || "Sin link"}</span>
            </div>
            <div className="row-actions admin-list-card__actions">
              <a className="link-btn" href={`/admin/components/promo-banners/${banner.id}/edit`}>
                Editar
              </a>
              <button className="secondary-btn" type="button" onClick={() => run(banner.id, "duplicate")}>
                Duplicar
              </button>
              {banner.status === "published" ? (
                <button className="secondary-btn" type="button" onClick={() => run(banner.id, "draft")}>
                  Desactivar
                </button>
              ) : (
                <button className="secondary-btn" type="button" onClick={() => run(banner.id, "publish")}>
                  Activar
                </button>
              )}
              <button className="danger-btn" type="button" onClick={() => run(banner.id, "trash")}>
                Papelera
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
