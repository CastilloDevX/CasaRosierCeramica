import { NextResponse, type NextRequest } from "next/server";
import { addMenuItem, deleteMenuItem, getMenuById, reorderMenuItems, toggleMenuItemVisibility, updateMenuItem } from "@/lib/cms/menus";
import { requireAdminApi } from "@/lib/auth/supabase-auth";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (!body?.label) return NextResponse.json({ error: "La etiqueta es obligatoria." }, { status: 400 });
  const item = await addMenuItem((await context.params).id, body);
  if (!item) return NextResponse.json({ error: "Menú no encontrado" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (body.action === "reorder" && Array.isArray(body.orderedItemIds)) {
    const items = await reorderMenuItems((await context.params).id, body.orderedItemIds);
    if (!items) return NextResponse.json({ error: "Menú no encontrado" }, { status: 404 });
    return NextResponse.json({ items });
  }
  const { itemId, ...data } = body;
  if (!itemId) return NextResponse.json({ error: "itemId es obligatorio" }, { status: 400 });
  const updated = await updateMenuItem((await context.params).id, itemId, data);
  if (!updated) return NextResponse.json({ error: "Item no encontrado" }, { status: 404 });
  return NextResponse.json({ item: updated });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const itemId = request.nextUrl.searchParams.get("itemId");
  if (!itemId) return NextResponse.json({ error: "itemId es obligatorio" }, { status: 400 });
  const deleted = await deleteMenuItem((await context.params).id, itemId);
  if (!deleted) return NextResponse.json({ error: "Item no encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
