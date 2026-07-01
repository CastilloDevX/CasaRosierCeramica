"use client";

import { useRouter } from "next/navigation";
import type { FooterComponent } from "@/lib/cms/types";

export default function FootersTable({ items }: { items: FooterComponent[] }) {
  const router = useRouter();
  async function run(id: string, action: string) { const r = await fetch(`/api/admin/components/footers/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) }); if (r.ok) router.refresh(); }
  return (<div className="table-card"><table className="admin-table"><thead><tr><th>Nombre</th><th>Estado</th><th>Email</th><th>WhatsApp</th><th>Newsletter</th><th>Actualizado</th><th>Acciones</th></tr></thead><tbody>{items.map((i) => (<tr key={i.id}><td><strong>{i.name}</strong></td><td>{i.status}</td><td>{i.contact_email || "—"}</td><td>{i.whatsapp || "—"}</td><td>{i.newsletter_enabled ? "Sí" : "No"}</td><td>{new Date(i.updated_at).toLocaleString()}</td><td><div className="row-actions"><a className="link-btn" href={`/admin/components/footers/${i.id}/edit`}>Editar</a><button className="secondary-btn" onClick={() => run(i.id, "duplicate")}>Duplicar</button>{i.status === "published" ? <button className="secondary-btn" onClick={() => run(i.id, "draft")}>Borrador</button> : <button className="secondary-btn" onClick={() => run(i.id, "publish")}>Publicar</button>}<button className="danger-btn" onClick={() => run(i.id, "trash")}>Papelera</button></div></td></tr>))}</tbody></table></div>);
}
