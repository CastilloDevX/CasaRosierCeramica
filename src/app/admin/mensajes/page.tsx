import AdminShell from "@/components/admin/AdminShell";
import MessagesSummaryCards from "@/components/admin/MessagesSummaryCards";
import MessagesTable from "@/components/admin/MessagesTable";
import TopBar from "@/components/layout/TopBar";
import { getFormSubmissions } from "@/lib/cms/form-submissions";

export default async function MensajesPage() {
  const items = await getFormSubmissions();
  const active = items.filter((s) => s.status !== "deleted");
  return (
    <AdminShell>
      <TopBar
        title="Mensajes"
        subtitle="Bandeja de consultas recibidas desde el formulario del footer y otros formularios activos."
      />
      <div className="page-card">
        <div className="page-header">
          <div>
            <p className="auth-kicker">Contacto</p>
            <h2>Mensajes recibidos</h2>
            <p className="muted">Busca por usuario, asunto o contenido y ordena por fecha de recepción.</p>
          </div>
        </div>
        <MessagesSummaryCards items={active} />
        {active.length === 0 ? <p className="muted">No hay mensajes recibidos.</p> : <MessagesTable items={active} />}
      </div>
    </AdminShell>
  );
}
