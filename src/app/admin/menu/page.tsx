import AdminShell from "@/components/admin/AdminShell";
import PublicMenuEditor from "@/components/admin/PublicMenuEditor";
import { getMenuByLocation } from "@/lib/cms/menus";
import { getSettings } from "@/lib/cms/settings";

export default async function MenuPage() {
  const [menu, settings] = await Promise.all([
    getMenuByLocation("main"),
    getSettings(),
  ]);

  return (
    <AdminShell>
      <PublicMenuEditor initialMenu={menu} initialSettings={settings} />
    </AdminShell>
  );
}
