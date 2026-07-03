import { NextResponse, type NextRequest } from "next/server";
import { requireAdminApi } from "@/lib/auth/supabase-auth";
import { saveMenuItemsTree, type MenuItemTreeInput } from "@/lib/cms/menus";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({})) as { items?: MenuItemTreeInput[] };
  if (!Array.isArray(body.items)) {
    return NextResponse.json({ error: "items es obligatorio." }, { status: 400 });
  }

  try {
    const items = await saveMenuItemsTree((await context.params).id, body.items);
    if (!items) return NextResponse.json({ error: "Menú no encontrado" }, { status: 404 });
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error al guardar menú" }, { status: 400 });
  }
}
