"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { BlogPost } from "@/lib/cms/types";

type Toast = { type: "success" | "error"; message: string };

function statusLabel(status: BlogPost["status"]) {
  if (status === "published") return "Publicado";
  if (status === "draft") return "Borrador";
  if (status === "archived") return "Archivado";
  return status;
}

function actionMessage(action: string) {
  if (action === "edit") return "Abriendo edición de la bitácora.";
  if (action === "duplicate") return "Bitácora duplicada correctamente.";
  if (action === "publish") return "Bitácora publicada correctamente.";
  if (action === "draft") return "Bitácora pasada a borrador correctamente.";
  if (action === "archive") return "Bitácora archivada correctamente.";
  if (action === "trash") return "Bitácora enviada a la papelera correctamente.";
  return "Acción completada correctamente.";
}

export default function BlogTable({ items }: { items: BlogPost[] }) {
  const router = useRouter();
  const [toast, setToast] = useState<Toast | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function actionKey(id: string, action: string) {
    return `${id}:${action}`;
  }

  function startEdit(id: string) {
    setPendingAction(actionKey(id, "edit"));
    setToast({ type: "success", message: actionMessage("edit") });
  }

  async function run(id: string, action: string) {
    if (pendingAction) return;
    if (action === "trash" && !window.confirm("¿Mover esta bitácora a la papelera?")) return;

    setToast(null);
    setPendingAction(actionKey(id, action));

    try {
      const response = await fetch(`/api/admin/bitacora/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        setToast({ type: "success", message: actionMessage(action) });
        router.refresh();
        return;
      }

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setToast({ type: "error", message: data.error || "No se pudo completar la acción." });
    } catch {
      setToast({ type: "error", message: "No se pudo conectar con el servidor. Intenta nuevamente." });
    } finally {
      setPendingAction(null);
    }
  }

  function isPending(id: string, action?: string) {
    if (!pendingAction) return false;
    return action ? pendingAction === actionKey(id, action) : pendingAction.startsWith(`${id}:`);
  }

  return (
    <div className="space-y-4">
      {toast ? (
        <div
          className={`rounded-xl border px-4 py-3 text-label-md ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-error bg-error-container text-on-error-container"
          }`}
          role={toast.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {toast.message}
        </div>
      ) : null}

      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Destacado</th>
              <th>Orden</th>
              <th>Bloques</th>
              <th>Lectura</th>
              <th>Actualizado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((post) => {
              const rowPending = isPending(post.id);
              return (
                <tr key={post.id}>
                  <td>
                    <strong>{post.title}</strong>
                    <br />
                    <span className="muted">{post.excerpt}</span>
                  </td>
                  <td>
                    <span className="entity-badge">{post.category}</span>
                  </td>
                  <td>{statusLabel(post.status)}</td>
                  <td>{post.is_featured ? <span className="entity-badge">Sí ({post.featured_order})</span> : "No"}</td>
                  <td>{post.sort_order}</td>
                  <td>{post.blocks.length}</td>
                  <td>{post.reading_time} min</td>
                  <td>{new Date(post.updated_at).toLocaleString()}</td>
                  <td>
                    <div className="row-actions">
                      <Link
                        className={`link-btn ${rowPending ? "pointer-events-none opacity-50" : ""}`}
                        href={`/admin/bitacora/${post.id}/edit`}
                        aria-disabled={rowPending}
                        onClick={() => startEdit(post.id)}
                      >
                        {isPending(post.id, "edit") ? "Abriendo..." : "Editar"}
                      </Link>
                      <button className="secondary-btn" type="button" disabled={rowPending} onClick={() => run(post.id, "duplicate")}>
                        {isPending(post.id, "duplicate") ? "Duplicando..." : "Duplicar"}
                      </button>
                      {post.status === "published" ? (
                        <button className="secondary-btn" type="button" disabled={rowPending} onClick={() => run(post.id, "draft")}>
                          {isPending(post.id, "draft") ? "Guardando..." : "Borrador"}
                        </button>
                      ) : post.status !== "archived" ? (
                        <button className="secondary-btn" type="button" disabled={rowPending} onClick={() => run(post.id, "publish")}>
                          {isPending(post.id, "publish") ? "Publicando..." : "Publicar"}
                        </button>
                      ) : null}
                      {post.status !== "archived" ? (
                        <button className="secondary-btn" type="button" disabled={rowPending} onClick={() => run(post.id, "archive")}>
                          {isPending(post.id, "archive") ? "Archivando..." : "Archivar"}
                        </button>
                      ) : null}
                      <button className="danger-btn" type="button" disabled={rowPending} onClick={() => run(post.id, "trash")}>
                        {isPending(post.id, "trash") ? "Enviando..." : "Papelera"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
