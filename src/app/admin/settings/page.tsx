import AdminShell from "@/components/admin/AdminShell";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/cms/settings";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <AdminShell>
      <div className="section-head">
        <div>
          <p className="auth-kicker">CMS</p>
          <h2>Configuración global</h2>
          <p className="muted">Ajustes generales del sitio Casa Rosier.</p>
        </div>
      </div>

      <SettingsForm initial={settings} />
    </AdminShell>
  );
}
