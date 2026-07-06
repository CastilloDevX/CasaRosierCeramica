"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product, ProductCategory } from "@/lib/cms/types";

type Toast = { type: "success" | "error"; message: string };

export default function ProductsTable({ items, categories }: { items: Product[]; categories: ProductCategory[] }) {
  const router = useRouter();
  const [toast, setToast] = useState<Toast | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function catName(id: string) { return categories.find((c) => c.id === id)?.name ?? id; }
  function message(action: string) {
    if (action === "duplicate") return "Articulo duplicado correctamente.";
    if (action === "publish") return "Articulo publicado correctamente.";
    if (action === "draft") return "Articulo pasado a borrador correctamente.";
    if (action === "archive") return "Articulo archivado correctamente.";
    if (action === "trash") return "Articulo enviado a la papelera correctamente.";
    return "Accion completada correctamente.";
  }
  async function run(id: string, action: string) {
    if (pendingAction) return;
    if (action === "trash" && !window.confirm("¿Mover este articulo a la papelera?")) return;
    setToast(null);
    setPendingAction(`${id}:${action}`);
    try {
      const r = await fetch(`/api/admin/shop/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
      if (r.ok) { setToast({ type: "success", message: message(action) }); router.refresh(); return; }
      const data = await r.json().catch(() => ({})) as { error?: string };
      setToast({ type: "error", message: data.error || "No se pudo completar la accion." });
    } catch {
      setToast({ type: "error", message: "No se pudo conectar con el servidor. Intenta nuevamente." });
    } finally {
      setPendingAction(null);
    }
  }
  return (<div className="space-y-4">{toast ? <div className={`admin-toast admin-toast--${toast.type}`} role={toast.type === "error" ? "alert" : "status"} aria-live="polite">{toast.message}</div> : null}<div className="table-card"><table className="admin-table"><thead><tr><th>Nombre</th><th>SKU</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Actualizado</th><th>Acciones</th></tr></thead><tbody>{items.map((p) => { const rowPending = pendingAction?.startsWith(`${p.id}:`); return (<tr key={p.id}><td><strong>{p.name}</strong></td><td className="muted">{p.sku || "—"}</td><td><span className="entity-badge">{catName(p.category_id) || "—"}</span></td><td>{p.price !== null ? `${p.price} €` : "—"}</td><td style={p.stock !== null && p.stock <= p.low_stock_threshold ? { color: "var(--danger)", fontWeight: 600 } : undefined}>{p.stock !== null ? p.stock : "∞"}</td><td>{p.status}</td><td>{new Date(p.updated_at).toLocaleString()}</td><td><div className="row-actions"><a className="link-btn" href={`/admin/shop/products/${p.id}/edit`}>Editar</a><button className="secondary-btn" disabled={rowPending} onClick={() => run(p.id, "duplicate")}>{pendingAction === `${p.id}:duplicate` ? "Duplicando..." : "Duplicar"}</button>{p.status === "published" ? <button className="secondary-btn" disabled={rowPending} onClick={() => run(p.id, "draft")}>Borrador</button> : <button className="secondary-btn" disabled={rowPending} onClick={() => run(p.id, "publish")}>Publicar</button>}<button className="secondary-btn" disabled={rowPending} onClick={() => run(p.id, "archive")}>Archivar</button><button className="danger-btn" disabled={rowPending} onClick={() => run(p.id, "trash")}>Papelera</button></div></td></tr>); })}</tbody></table></div></div>);
}
