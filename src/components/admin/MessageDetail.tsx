"use client";

import Link from "@/components/admin/AdminLink";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormSubmission } from "@/lib/cms/types";

const stLabels: Record<string, string> = { new: "Nuevo", read: "Leído", replied: "Respondido", archived: "Archivado", spam: "Spam", deleted: "Eliminado" };

export default function MessageDetail({ item }: { item: FormSubmission }) {
  const router = useRouter();
  const [notes, setNotes] = useState(item.internal_notes);
  async function run(action: string, extra?: Record<string, string>) {
    const r = await fetch(`/api/admin/mensajes/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...extra }) });
    if (r.ok) router.push("/admin/mensajes"); router.refresh();
  }
  async function saveNotes() {
    await fetch(`/api/admin/mensajes/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ internal_notes: notes }) });
    router.refresh();
  }
  return (
    <div className="page-card">
      <div className="page-header"><h2>{item.subject || "Mensaje sin asunto"}</h2><Link className="secondary-btn" href="/admin/mensajes">Volver</Link></div>
      <div className="header-form-layout">
        <div className="menu-form-main">
          <div className="form-block">
            <h3>Cliente</h3>
            <div className="grid-2">
              <div><p className="auth-kicker">Nombre</p><p style={{ fontWeight: 500 }}>{item.name}</p></div>
              <div><p className="auth-kicker">Email</p><p><a href={`mailto:${item.email}`}>{item.email}</a></p></div>
              {item.phone ? <div><p className="auth-kicker">Teléfono</p><p>{item.phone}</p></div> : null}
              <div><p className="auth-kicker">Formulario</p><p>{item.form_name} ({item.form_slug})</p></div>
              {item.source_page ? <div><p className="auth-kicker">Página de origen</p><p className="muted">{item.source_page}</p></div> : null}
              <div><p className="auth-kicker">Recibido</p><p>{new Date(item.created_at).toLocaleString()}</p></div>
              <div><p className="auth-kicker">Estado</p><p><span className="entity-badge">{stLabels[item.status]}</span></p></div>
            </div>
          </div>

          {item.message ? <div className="form-block"><h3>Mensaje</h3><div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{item.message}</div></div> : null}

          {Object.keys(item.data).length > 0 ? (
            <div className="form-block"><h3>Datos adicionales</h3><table className="admin-table"><tbody>{Object.entries(item.data).filter(([k]) => !["name","email","phone","subject","message","source_page"].includes(k)).map(([k, v]) => (<tr key={k}><td style={{ fontWeight: 500, width: "30%" }}>{k}</td><td>{String(v)}</td></tr>))}</tbody></table></div>
          ) : null}

          <div className="form-block"><h3>Notas internas</h3><textarea rows={4} style={{ width: "100%" }} value={notes} onChange={(e) => setNotes(e.target.value)} /><div style={{ marginTop: "0.5rem" }}><button className="primary-btn" onClick={saveNotes}>Guardar notas</button></div></div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
            <button className="secondary-btn" onClick={() => run("status", { status: "read" })}>Marcar como leído</button>
            <button className="secondary-btn" onClick={() => run("status", { status: "replied" })}>Marcar como respondido</button>
            <button className="secondary-btn" onClick={() => run("status", { status: "archived" })}>Archivar</button>
            <button className="secondary-btn" onClick={() => run("status", { status: "spam" })}>Spam</button>
            <button className="danger-btn" onClick={() => run("trash")}>Papelera</button>
          </div>
        </div>
      </div>
    </div>
  );
}
