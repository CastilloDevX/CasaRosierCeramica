"use client";

import { useRouter } from "next/navigation";
import type { Faq } from "@/lib/cms/types";

const catLabels: Record<string, string> = { general: "General", classes: "Clases", shop: "Shop", booking: "Reservas" };

export default function FaqsTable({ items }: { items: Faq[] }) {
  const router = useRouter();
  async function run(id: string, action: string) { const r = await fetch(`/api/admin/components/faqs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) }); if (r.ok) router.refresh(); }
  return (<div className="table-card"><table className="admin-table"><thead><tr><th>Pregunta</th><th>Categoría</th><th>Orden</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{items.map((i) => (<tr key={i.id}><td><strong>{i.question}</strong></td><td><span className="entity-badge">{catLabels[i.category] || i.category}</span></td><td>{i.sort_order}</td><td>{i.status}</td><td><div className="row-actions"><a className="link-btn" href={`/admin/components/faqs/${i.id}/edit`}>Editar</a><button className="secondary-btn" onClick={() => run(i.id, "duplicate")}>Duplicar</button>{i.status === "published" ? <button className="secondary-btn" onClick={() => run(i.id, "draft")}>Borrador</button> : <button className="secondary-btn" onClick={() => run(i.id, "publish")}>Publicar</button>}<button className="danger-btn" onClick={() => run(i.id, "trash")}>Papelera</button></div></td></tr>))}</tbody></table></div>);
}
