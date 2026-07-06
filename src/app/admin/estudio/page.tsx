import AdminShell from "@/components/admin/AdminShell";
import StudioPageEditor from "@/components/admin/StudioPageEditor";
import { getPublicNavigationItems } from "@/lib/cms/navigation-public";
import { getSettings } from "@/lib/cms/settings";
import { getStudioPageSettings } from "@/lib/cms/studio-page";
import { getTeachers } from "@/lib/cms/teachers";

export default async function StudioAdminPage() {
  const [page, teachers, navigationItems, settings] = await Promise.all([
    getStudioPageSettings(),
    getTeachers(),
    getPublicNavigationItems("main"),
    getSettings(),
  ]);

  return (
    <AdminShell>
      <StudioPageEditor page={page} teachers={teachers} navigationItems={navigationItems} menuSettings={settings.menu} />
    </AdminShell>
  );
}
