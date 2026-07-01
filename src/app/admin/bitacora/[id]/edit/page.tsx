import AdminShell from "@/components/admin/AdminShell";
import BlogForm from "@/components/admin/BlogForm";
import { getBlogPostById } from "@/lib/cms/blog";
import { notFound } from "next/navigation";

export default async function EditBitacora({ params }: { params: Promise<{ id: string }> }) {
  const item = await getBlogPostById((await params).id);
  if (!item) notFound();
  return (
    <AdminShell>
      <BlogForm mode="edit" item={item} />
    </AdminShell>
  );
}
