"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SUBMISSION_STATUSES, type FormSubmission, type FormSubmissionStatus } from "@/lib/cms/types";

const stLabels: Record<string, string> = {
  new: "Nuevo",
  read: "Leído",
  replied: "Respondido",
  archived: "Archivado",
  spam: "Spam",
  deleted: "Eliminado",
};

export default function MessagesTable({ items }: { items: FormSubmission[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FormSubmissionStatus | "all">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items
      .filter((item) => {
        const matchesStatus = status === "all" || item.status === status;
        const haystack = [
          item.name,
          item.email,
          item.phone,
          item.subject,
          item.message,
          item.form_name,
          item.source_page,
        ].join(" ").toLowerCase();
        return matchesStatus && (!normalizedQuery || haystack.includes(normalizedQuery));
      })
      .sort((a, b) => {
        const diff = Date.parse(b.created_at) - Date.parse(a.created_at);
        return sort === "newest" ? diff : -diff;
      });
  }, [items, query, status, sort]);

  async function mark(id: string, status: string) {
    const r = await fetch(`/api/admin/mensajes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "status", status }),
    });
    if (r.ok) router.refresh();
  }

  return (
    <div className="messages-inbox">
      <div className="admin-control-bar">
        <label className="field admin-control-bar__search">
          <span>Buscar mensaje</span>
          <input
            type="search"
            placeholder="Nombre, correo, asunto o texto"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="field admin-control-bar__select">
          <span>Estado</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as FormSubmissionStatus | "all")}>
            <option value="all">Todos</option>
            {SUBMISSION_STATUSES.filter((value) => value !== "deleted").map((value) => (
              <option key={value} value={value}>{stLabels[value]}</option>
            ))}
          </select>
        </label>
        <label className="field admin-control-bar__select">
          <span>Orden</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as "newest" | "oldest")}>
            <option value="newest">Más reciente primero</option>
            <option value="oldest">Menos reciente primero</option>
          </select>
        </label>
      </div>

      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Formulario</th>
              <th>Asunto</th>
              <th>Estado</th>
              <th>Recibido</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((s) => (
              <tr key={s.id} className={s.status === "new" ? "is-unread-row" : undefined}>
                <td>
                  <strong>{s.name}</strong>
                  <br />
                  <a className="muted" href={`mailto:${s.email}`}>{s.email}</a>
                  {s.phone ? <><br /><span className="muted">{s.phone}</span></> : null}
                </td>
                <td>
                  <span>{s.form_name}</span>
                  {s.source_page ? <><br /><span className="muted">{s.source_page}</span></> : null}
                </td>
                <td>
                  <strong>{s.subject || "Mensaje sin asunto"}</strong>
                  {s.message ? <><br /><span className="muted">{s.message.slice(0, 90)}{s.message.length > 90 ? "..." : ""}</span></> : null}
                </td>
                <td><span className={`entity-badge ${s.status === "new" ? "badge-new" : ""}`}>{stLabels[s.status]}</span></td>
                <td>{new Date(s.created_at).toLocaleString("es-MX")}</td>
                <td>
                  <div className="row-actions">
                    <a className="link-btn" href={`/admin/mensajes/${s.id}`}>Ver</a>
                    {s.status !== "read" ? <button className="secondary-btn" onClick={() => mark(s.id, "read")}>Leído</button> : null}
                    <button className="secondary-btn" onClick={() => mark(s.id, "archived")}>Archivar</button>
                    <button className="secondary-btn" onClick={() => mark(s.id, "spam")}>Spam</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <p className="muted users-admin__empty">No hay mensajes para los filtros seleccionados.</p>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
