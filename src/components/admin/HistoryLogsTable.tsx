"use client";

import type { HistoryLog } from "@/lib/cms/types";

const actionLabels: Record<string, string> = {
  create: "Creación", update: "Actualización", publish: "Publicación", unpublish: "Despublicación",
  archive: "Archivado", trash: "Papelera", restore: "Restauración", delete_permanently: "Eliminación definitiva",
  duplicate: "Duplicado", login: "Inicio de sesión",
};

export default function HistoryLogsTable({ items }: { items: HistoryLog[] }) {
  return (<div className="table-card"><table className="admin-table"><thead><tr><th>Acción</th><th>Entidad</th><th>Título</th><th>Usuario</th><th>Fecha</th></tr></thead><tbody>{items.map((l) => (<tr key={l.id}><td><span className="entity-badge">{actionLabels[l.action] || l.action}</span></td><td>{l.entity_type}</td><td>{l.entity_title}</td><td className="muted">{l.user_email}</td><td>{new Date(l.created_at).toLocaleString()}</td></tr>
    ))}</tbody></table></div>);
}
