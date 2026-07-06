import AdminShell from "@/components/admin/AdminShell";
import BlogPageEditor from "@/components/admin/BlogPageEditor";
import { getBlogPosts } from "@/lib/cms/blog";
import { getBlogPageSettings } from "@/lib/cms/blog-page";
import { getPublicNavigationItems } from "@/lib/cms/navigation-public";
import { getSettings } from "@/lib/cms/settings";

export default async function BitacoraPage() {
  const [page, posts, navigationItems, settings] = await Promise.all([
    getBlogPageSettings(),
    getBlogPosts(),
    getPublicNavigationItems("main"),
    getSettings(),
  ]);

  return (
    <AdminShell>
      <BlogPageEditor page={page} posts={posts} navigationItems={navigationItems} menuSettings={settings.menu} />
    </AdminShell>
  );
}
