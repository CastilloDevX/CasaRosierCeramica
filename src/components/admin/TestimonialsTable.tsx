"use client";

import { useRouter } from "next/navigation";
import type { Testimonial, TestimonialStatus } from "@/lib/cms/types";

const statusLabels: Record<TestimonialStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
  deleted: "Eliminado",
};

export default function TestimonialsTable({ items }: { items: Testimonial[] }) {
  const router = useRouter();

  async function run(id: string, action: string) {
    if (action === "trash" && !window.confirm("¿Mover este testimonio a la papelera?")) return;
    const response = await fetch(`/api/admin/components/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (response.ok) router.refresh();
  }

  return (
    <div className="admin-card-list testimonial-card-list">
      {items.map((testimonial) => (
        <article key={testimonial.id} className="admin-list-card testimonial-admin-card">
          <div className="testimonial-admin-card__avatar">
            {testimonial.avatar_id ? (
              <img src={testimonial.avatar_id} alt={`Foto de ${testimonial.name}`} />
            ) : (
              <span>{testimonial.name.slice(0, 1).toUpperCase()}</span>
            )}
          </div>
          <div className="admin-list-card__body">
            <div className="admin-list-card__head">
              <div>
                <h3>{testimonial.name}</h3>
                <p>{testimonial.role || "Sin rol definido"}</p>
              </div>
              <div className="badge-stack">
                <span className={`status-pill status-pill--${testimonial.status}`}>
                  {statusLabels[testimonial.status]}
                </span>
                {testimonial.is_featured ? <span className="entity-badge">Destacado</span> : null}
              </div>
            </div>
            <p className="admin-list-card__copy">
              {testimonial.text || "Este testimonio aún no tiene texto."}
            </p>
            <div className="admin-list-card__meta">
              <span>Orden {testimonial.sort_order}</span>
              <span>Actualizado {new Date(testimonial.updated_at).toLocaleDateString()}</span>
            </div>
            <div className="row-actions admin-list-card__actions">
              <a className="link-btn" href={`/admin/components/testimonials/${testimonial.id}/edit`}>
                Editar
              </a>
              <button className="secondary-btn" type="button" onClick={() => run(testimonial.id, "duplicate")}>
                Duplicar
              </button>
              {testimonial.status === "published" ? (
                <button className="secondary-btn" type="button" onClick={() => run(testimonial.id, "draft")}>
                  Pasar a borrador
                </button>
              ) : (
                <button className="secondary-btn" type="button" onClick={() => run(testimonial.id, "publish")}>
                  Publicar
                </button>
              )}
              <button className="danger-btn" type="button" onClick={() => run(testimonial.id, "trash")}>
                Papelera
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
