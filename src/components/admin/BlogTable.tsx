"use client";

import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/cms/types";

export default function BlogTable({ items }: { items: BlogPost[] }) {
  const router = useRouter();
  async function run(id: string, action: string) {
    const r = await fetch(`/api/admin/bitacora/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    if (r.ok) router.refresh();
  }
  return (<div className="table-card"><table className="admin-table"><thead><tr><th>Título</th><th>Tipo</th><th>Estado</th><th>Destacado</th><th>Orden</th><th>Bloques</th><th>Lectura</th><th>Actualizado</th><th>Acciones</th></tr></thead><tbody>{items.map((p) => (<tr key={p.id}><td><strong>{p.title}</strong><br /><span className="muted">{p.excerpt}</span></td><td><span className="entity-badge">{p.category}</span></td><td>{p.status}</td><td>{p.is_featured ? <span className="entity-badge">Sí ({p.featured_order})</span> : "No"}</td><td>{p.sort_order}</td><td>{p.blocks.length}</td><td>{p.reading_time} min</td><td>{new Date(p.updated_at).toLocaleString()}</td><td><div className="row-actions"><a className="link-btn" href={`/admin/bitacora/${p.id}/edit`}>Editar</a><button className="secondary-btn" onClick={() => run(p.id, "duplicate")}>Duplicar</button>{p.status === "published" ? <button className="secondary-btn" onClick={() => run(p.id, "draft")}>Borrador</button> : p.status !== "archived" ? <button className="secondary-btn" onClick={() => run(p.id, "publish")}>Publicar</button> : null}{p.status !== "archived" ? <button className="secondary-btn" onClick={() => run(p.id, "archive")}>Archivar</button> : null}<button className="danger-btn" onClick={() => run(p.id, "trash")}>Papelera</button></div></td></tr>))}</tbody></table></div>);
}
