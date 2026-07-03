"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Testimonial, TestimonialStatus } from "@/lib/cms/types";

type Toast = { type: "success" | "error" | "info"; message: string };

const statusLabels: Record<TestimonialStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
  deleted: "Eliminado",
};

function actionMessage(action: string) {
  if (action === "duplicate") return "Testimonio duplicado correctamente.";
  if (action === "publish") return "Testimonio publicado correctamente.";
  if (action === "draft") return "Testimonio pasado a borrador correctamente.";
  if (action === "archive") return "Testimonio archivado correctamente.";
  if (action === "trash") return "Testimonio enviado a la papelera correctamente.";
  return "Acción completada correctamente.";
}

export default function TestimonialsTable({ items }: { items: Testimonial[] }) {
  const router = useRouter();
  const [toast, setToast] = useState<Toast | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function actionKey(id: string, action: string) {
    return `${id}:${action}`;
  }

  async function run(id: string, action: string) {
    if (pendingAction) return;
    if (action === "trash" && !window.confirm("¿Mover este testimonio a la papelera?")) return;
    setToast(null);
    setPendingAction(actionKey(id, action));
    try {
      const response = await fetch(`/api/admin/components/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (response.ok) {
        setToast({ type: "success", message: actionMessage(action) });
        router.refresh();
        return;
      }
      const data = await response.json().catch(() => ({ error: "No se pudo completar la acción." }));
      setToast({ type: "error", message: (data as { error?: string }).error || "No se pudo completar la acción." });
    } catch {
      setToast({ type: "error", message: "No se pudo conectar con el servidor. Intenta nuevamente." });
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="admin-card-list testimonial-card-list">
      {toast ? (
        <div
          className={`admin-toast admin-toast--${toast.type}`}
          role={toast.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {toast.message}
        </div>
      ) : null}

      {items.map((testimonial) => {
        const isPending = pendingAction?.startsWith(`${testimonial.id}:`);
        return (
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
                <button className="secondary-btn" type="button" onClick={() => run(testimonial.id, "duplicate")} disabled={isPending}>
                  Duplicar
                </button>
                {testimonial.status === "published" ? (
                  <button className="secondary-btn" type="button" onClick={() => run(testimonial.id, "draft")} disabled={isPending}>
                    Pasar a borrador
                  </button>
                ) : (
                  <button className="secondary-btn" type="button" onClick={() => run(testimonial.id, "publish")} disabled={isPending}>
                    Publicar
                  </button>
                )}
                <button className="secondary-btn" type="button" onClick={() => run(testimonial.id, "archive")} disabled={isPending || testimonial.status === "archived"}>
                  Archivar
                </button>
                <button className="danger-btn" type="button" onClick={() => run(testimonial.id, "trash")} disabled={isPending}>
                  Papelera
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
