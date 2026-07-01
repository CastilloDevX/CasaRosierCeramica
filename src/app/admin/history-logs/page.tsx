import AdminShell from "@/components/admin/AdminShell";
import HistoryLogsTable from "@/components/admin/HistoryLogsTable";
import SectionEmptyState from "@/components/admin/SectionEmptyState";
import { getHistoryLogs } from "@/lib/cms/history-logs";

export default async function HistoryLogsPage() {
  const items = await getHistoryLogs();

  return (
    <AdminShell>
      <div className="section-head">
        <div>
          <p className="auth-kicker">CMS</p>
          <h2>Historial de actividad</h2>
          <p className="muted">Registro cronológico de acciones dentro del administrador.</p>
        </div>
      </div>
      {items.length === 0 ? (
        <SectionEmptyState title="Sin actividad" description="No hay registros de actividad por ahora." />
      ) : (
        <HistoryLogsTable items={items} />
      )}
    </AdminShell>
  );
}
