"use client";

import { useRouter } from "next/navigation";
import type { Product, ProductCategory } from "@/lib/cms/types";

export default function ProductsTable({ items, categories }: { items: Product[]; categories: ProductCategory[] }) {
  const router = useRouter();
  function catName(id: string) { return categories.find((c) => c.id === id)?.name ?? id; }
  async function run(id: string, action: string) { const r = await fetch(`/api/admin/shop/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) }); if (r.ok) router.refresh(); }
  return (<div className="table-card"><table className="admin-table"><thead><tr><th>Nombre</th><th>SKU</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Actualizado</th><th>Acciones</th></tr></thead><tbody>{items.map((p) => (<tr key={p.id}><td><strong>{p.name}</strong></td><td className="muted">{p.sku || "—"}</td><td><span className="entity-badge">{catName(p.category_id) || "—"}</span></td><td>{p.price !== null ? `${p.price} €` : "—"}</td><td style={p.stock !== null && p.stock <= p.low_stock_threshold ? { color: "var(--danger)", fontWeight: 600 } : undefined}>{p.stock !== null ? p.stock : "∞"}</td><td>{p.status}</td><td>{new Date(p.updated_at).toLocaleString()}</td><td><div className="row-actions"><a className="link-btn" href={`/admin/shop/products/${p.id}/edit`}>Editar</a><button className="secondary-btn" onClick={() => run(p.id, "duplicate")}>Duplicar</button>{p.status === "published" ? <button className="secondary-btn" onClick={() => run(p.id, "draft")}>Borrador</button> : <button className="secondary-btn" onClick={() => run(p.id, "publish")}>Publicar</button>}<button className="secondary-btn" onClick={() => run(p.id, "archive")}>Archivar</button><button className="danger-btn" onClick={() => run(p.id, "trash")}>Papelera</button></div></td></tr>))}</tbody></table></div>);
}
