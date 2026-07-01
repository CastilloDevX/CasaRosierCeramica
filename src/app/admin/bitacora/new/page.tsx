import AdminShell from "@/components/admin/AdminShell";
import BlogForm from "@/components/admin/BlogForm";

export default function NewBitacora() {
  return (
    <AdminShell>
      <BlogForm mode="create" />
    </AdminShell>
  );
}
