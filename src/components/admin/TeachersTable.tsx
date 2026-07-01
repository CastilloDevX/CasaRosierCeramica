"use client";

import { useRouter } from "next/navigation";
import type { Teacher } from "@/lib/cms/types";

export default function TeachersTable({ items, basePath = "/admin/components/teachers" }: { items: Teacher[]; basePath?: string }) {
  const router = useRouter();
  async function run(id: string, action: string) { const r = await fetch(`/api/admin/components/teachers/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) }); if (r.ok) router.refresh(); }
  return (<div className="table-card"><table className="admin-table"><thead><tr><th>Nombre</th><th>Subtítulo</th><th>Estado</th><th>Orden</th><th>Instagram</th><th>Acciones</th></tr></thead><tbody>{items.map((i) => (<tr key={i.id}><td><strong>{i.name}</strong><br /><span className="muted">{i.bio.slice(0, 110)}{i.bio.length > 110 ? "..." : ""}</span></td><td>{i.specialty || "—"}</td><td>{i.status}</td><td>{i.sort_order}</td><td>{i.instagram || "—"}</td><td><div className="row-actions"><a className="link-btn" href={`${basePath}/${i.id}/edit`}>Editar</a><button className="secondary-btn" onClick={() => run(i.id, "duplicate")}>Duplicar</button>{i.status === "published" ? <button className="secondary-btn" onClick={() => run(i.id, "draft")}>Borrador</button> : <button className="secondary-btn" onClick={() => run(i.id, "publish")}>Publicar</button>}<button className="danger-btn" onClick={() => run(i.id, "trash")}>Papelera</button></div></td></tr>))}</tbody></table></div>);
}
