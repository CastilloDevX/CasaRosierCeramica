import { NextResponse, type NextRequest } from "next/server";
import { deleteMediaAsset, getMediaAssetById, moveMediaToTrash, restoreMediaAsset } from "@/lib/cms/media";
import { requireAdminApi } from "@/lib/auth/supabase-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const STORAGE_BUCKET = "media";

export async function POST(request: NextRequest) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, action } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Falta el id del asset." }, { status: 400 });
  }

  if (action === "trash") {
    const asset = await moveMediaToTrash(id, session.userEmail);
    if (!asset) {
      return NextResponse.json({ error: "Asset no encontrado." }, { status: 404 });
    }
    return NextResponse.json({ asset });
  }

  if (action === "restore") {
    const asset = await restoreMediaAsset(id);
    if (!asset) {
      return NextResponse.json({ error: "Asset no encontrado." }, { status: 404 });
    }
    return NextResponse.json({ asset });
  }

  if (action === "permanent") {
    // Get the file_name before deleting so we can remove from Storage
    const asset = await getMediaAssetById(id);
    if (asset && asset.file_name) {
      try {
        const supabase = createAdminClient();
        await supabase.storage.from(STORAGE_BUCKET).remove([asset.file_name]);
      } catch { /* best-effort */ }
    }
    const deleted = await deleteMediaAsset(id);
    if (!deleted) {
      return NextResponse.json({ error: "Asset no encontrado." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Acción no válida. Usa trash, restore o permanent." }, { status: 400 });
}
