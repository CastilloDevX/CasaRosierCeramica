import { NextResponse, type NextRequest } from "next/server";
import { requireAdminApi } from "@/lib/auth/supabase-auth";
import {
  deleteOfferingPermanently,
  duplicateOffering,
  getOfferingById,
  moveOfferingToTrash,
  restoreOffering,
  updateOffering,
} from "@/lib/cms/offerings";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();

  try {
    const offering = await updateOffering(id, body);

    if (!offering) {
      return NextResponse.json({ error: "Offering no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ offering });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el offering" }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { action?: string };

  if (body.action === "duplicate") {
    const offering = await duplicateOffering(id);
    if (!offering) {
      return NextResponse.json({ error: "Offering no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ offering });
  }

  if (body.action === "trash") {
    const offering = await moveOfferingToTrash(id, session.userEmail);
    if (!offering) {
      return NextResponse.json({ error: "Offering no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ offering });
  }

  if (body.action === "restore") {
    const offering = await restoreOffering(id);
    if (!offering) {
      return NextResponse.json({ error: "Offering no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ offering });
  }

  const offering = await getOfferingById(id);
  if (!offering) {
    return NextResponse.json({ error: "Offering no encontrado" }, { status: 404 });
  }

  const nextStatus = body.action === "publish" ? "published" : body.action === "archive" ? "archived" : body.action === "draft" ? "draft" : null;
  if (!nextStatus) {
    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  }

  const updated = await updateOffering(id, { ...offering, status: nextStatus });
  return NextResponse.json({ offering: updated });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteOfferingPermanently(id);
  if (!deleted) {
    return NextResponse.json({ error: "Offering no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
