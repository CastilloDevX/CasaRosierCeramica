"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Teacher } from "@/lib/cms/types";

type Toast = { type: "success" | "error"; message: string };

function statusLabel(status: Teacher["status"]) {
  if (status === "published") return "Publicado";
  if (status === "draft") return "Borrador";
  if (status === "archived") return "Archivado";
  return status;
}

function actionMessage(action: string) {
  if (action === "edit") return "Abriendo edición del especialista.";
  if (action === "duplicate") return "Especialista duplicado correctamente.";
  if (action === "publish") return "Especialista publicado correctamente.";
  if (action === "draft") return "Especialista pasado a borrador correctamente.";
  if (action === "archive") return "Especialista archivado correctamente.";
  if (action === "trash") return "Especialista enviado a la papelera correctamente.";
  return "Acción completada correctamente.";
}

export default function TeachersTable({
  items,
  basePath = "/admin/components/teachers",
}: {
  items: Teacher[];
  basePath?: string;
}) {
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
    if (action === "trash" && !window.confirm("¿Mover este especialista a la papelera?")) return;

    setToast(null);
    setPendingAction(actionKey(id, action));

    try {
      const response = await fetch(`/api/admin/components/teachers/${id}`, {
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
              <th>Nombre</th>
              <th>Subtítulo</th>
              <th>Estado</th>
              <th>Orden</th>
              <th>Instagram</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const rowPending = isPending(item.id);
              return (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                    <br />
                    <span className="muted">
                      {item.bio.slice(0, 110)}
                      {item.bio.length > 110 ? "..." : ""}
                    </span>
                  </td>
                  <td>{item.specialty || "—"}</td>
                  <td>{statusLabel(item.status)}</td>
                  <td>{item.sort_order}</td>
                  <td>{item.instagram || "—"}</td>
                  <td>
                    <div className="row-actions">
                      <Link
                        className={`link-btn ${rowPending ? "pointer-events-none opacity-50" : ""}`}
                        href={`${basePath}/${item.id}/edit`}
                        aria-disabled={rowPending}
                        onClick={() => startEdit(item.id)}
                      >
                        {isPending(item.id, "edit") ? "Abriendo..." : "Editar"}
                      </Link>
                      <button className="secondary-btn" type="button" disabled={rowPending} onClick={() => run(item.id, "duplicate")}>
                        {isPending(item.id, "duplicate") ? "Duplicando..." : "Duplicar"}
                      </button>
                      {item.status === "published" ? (
                        <button className="secondary-btn" type="button" disabled={rowPending} onClick={() => run(item.id, "draft")}>
                          {isPending(item.id, "draft") ? "Guardando..." : "Borrador"}
                        </button>
                      ) : item.status !== "archived" ? (
                        <button className="secondary-btn" type="button" disabled={rowPending} onClick={() => run(item.id, "publish")}>
                          {isPending(item.id, "publish") ? "Publicando..." : "Publicar"}
                        </button>
                      ) : null}
                      {item.status !== "archived" ? (
                        <button className="secondary-btn" type="button" disabled={rowPending} onClick={() => run(item.id, "archive")}>
                          {isPending(item.id, "archive") ? "Archivando..." : "Archivar"}
                        </button>
                      ) : null}
                      <button className="danger-btn" type="button" disabled={rowPending} onClick={() => run(item.id, "trash")}>
                        {isPending(item.id, "trash") ? "Enviando..." : "Papelera"}
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
