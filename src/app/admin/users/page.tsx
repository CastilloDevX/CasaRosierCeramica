import AdminShell from "@/components/admin/AdminShell";
import UsersManager from "@/components/admin/UsersManager";
import TopBar from "@/components/layout/TopBar";
import { getCmsAdminUsers, type CmsAdminUser } from "@/lib/admin/users";

export default async function UsersPage() {
  let users: CmsAdminUser[] = [];
  let loadError = "";

  try {
    users = await getCmsAdminUsers();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "No se pudieron cargar los usuarios.";
  }

  return (
    <AdminShell>
      <TopBar
        title="Usuarios"
        subtitle="Crea administradores, actualiza contraseñas y elimina accesos del CMS."
      />
      <div className="page-card">
        <div className="page-header">
          <div>
            <p className="auth-kicker">Accesos CMS</p>
            <h2>Administradores visibles</h2>
            <p className="muted">
              El super admin definido en el entorno no se muestra ni se puede modificar desde esta vista.
            </p>
          </div>
        </div>
        {loadError ? (
          <p className="form-alert form-alert--error" role="alert">
            No se pudieron cargar los usuarios de Supabase. Revisa la conexión y las variables de entorno antes de crear o editar accesos.
          </p>
        ) : null}
        <UsersManager initialUsers={users} />
      </div>
    </AdminShell>
  );
}
