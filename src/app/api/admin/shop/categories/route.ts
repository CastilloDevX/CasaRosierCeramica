import { requireAdminApi } from "@/lib/auth/supabase-auth";
import { createCategory, getCategories } from "@/lib/cms/product-categories";
import { invalidatePublicNavigationCache } from "@/lib/cms/navigation-public";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

function refreshCategoryPaths() {
  invalidatePublicNavigationCache();
  revalidatePath("/shop");
  revalidatePath("/admin/shop");
  revalidatePath("/admin/shop/categories");
}

export async function GET(request: NextRequest) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await getCategories();
  return NextResponse.json({ categories: items });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (!body?.name) return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });
  try { const item = await createCategory(body); refreshCategoryPaths(); return NextResponse.json({ category: item }); }
  catch (err) { return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 400 }); }
}
