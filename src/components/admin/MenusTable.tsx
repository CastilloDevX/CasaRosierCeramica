"use client";

import { useRouter } from "next/navigation";
import type { Menu } from "@/lib/cms/types";

const locLabels: Record<string, string> = { main: "Principal", mobile: "Móvil", footer: "Footer" };

export default function MenusTable({ menus }: { menus: Menu[] }) {
  const router = useRouter();

  async function runAction(id: string, action: string) {
    const res = await fetch(`/api/admin/menus/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className="table-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Estado</th>
            <th>Items</th>
            <th>Actualizado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu.id}>
              <td><strong>{menu.name}</strong></td>
              <td><span className="entity-badge">{locLabels[menu.location] || menu.location}</span></td>
              <td>{menu.status}</td>
              <td>{menu.items.length}</td>
              <td>{new Date(menu.updated_at).toLocaleString()}</td>
              <td>
                <div className="row-actions">
                  <a className="link-btn" href={`/admin/menu/${menu.id}/edit`}>Editar</a>
                  <button className="secondary-btn" onClick={() => runAction(menu.id, "duplicate")}>Duplicar</button>
                  {menu.status === "active" ? (
                    <button className="secondary-btn" onClick={() => runAction(menu.id, "draft")}>Borrador</button>
                  ) : (
                    <button className="secondary-btn" onClick={() => runAction(menu.id, "activate")}>Activar</button>
                  )}
                  <button className="secondary-btn" onClick={() => runAction(menu.id, "archive")}>Archivar</button>
                  <button className="danger-btn" onClick={() => runAction(menu.id, "trash")}>Papelera</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
