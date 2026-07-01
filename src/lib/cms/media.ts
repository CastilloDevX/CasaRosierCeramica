import { randomUUID } from "crypto";
import { createAdminClient } from "../supabase/admin";
import { addTrashItem, getCurrentUserEmail, getTrashItemByEntity, removeTrashItem } from "./trash";
import { readJsonFile, writeJsonFile } from "./local-storage";
import { isMediaFolder, isMediaStatus } from "./types";
import type { MediaAsset } from "./types";
import { logAction } from "./history-logs";

const TABLE = "media_assets";
const STORAGE_BUCKET = "media";
const FILE_NAME = "media.json";
const MEDIA_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "svg", "avif", "mp4", "webm", "mov", "m4v", "pdf"]);

type MediaInput = Partial<Omit<MediaAsset, "id" | "created_at" | "updated_at" | "deleted_at">> & {
  id?: string;
};

function normalizeAsset(input: MediaInput, existing?: MediaAsset) {
  const now = new Date().toISOString();
  const folder = input.folder ?? existing?.folder ?? "general";
  const status = input.status ?? existing?.status ?? "active";

  if (!isMediaFolder(folder)) {
    throw new Error("Folder de media no válido.");
  }
  if (!isMediaStatus(status)) {
    throw new Error("Estado de media no válido.");
  }

  return {
    id: existing?.id ?? input.id ?? randomUUID(),
    file_name: String(input.file_name ?? existing?.file_name ?? "").trim(),
    original_name: String(input.original_name ?? existing?.original_name ?? "").trim(),
    file_url: String(input.file_url ?? existing?.file_url ?? "").trim(),
    file_type: String(input.file_type ?? existing?.file_type ?? "").trim().toLowerCase(),
    mime_type: String(input.mime_type ?? existing?.mime_type ?? "").trim().toLowerCase(),
    size: input.size !== undefined ? Number(input.size) : existing?.size ?? 0,
    alt_text: String(input.alt_text ?? existing?.alt_text ?? "").trim(),
    title: String(input.title ?? existing?.title ?? "").trim(),
    description: String(input.description ?? existing?.description ?? "").trim(),
    folder,
    tags: Array.isArray(input.tags ?? existing?.tags) ? (input.tags ?? existing?.tags ?? []).map(String) : [],
    status,
    created_at: existing?.created_at ?? now,
    updated_at: now,
    deleted_at: input.status === "deleted" ? existing?.deleted_at ?? now : null,
  } satisfies MediaAsset;
}

// ── Mapping helpers ──

function rowToMediaAsset(row: Record<string, unknown>): MediaAsset {
  return {
    ...row,
    tags: Array.isArray(row.tags) ? row.tags : [],
  } as unknown as MediaAsset;
}

function mediaAssetToRow(a: MediaAsset): Record<string, unknown> {
  return { ...a };
}

// ── Supabase helpers ──

async function readAllFromSupabase(): Promise<MediaAsset[] | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return (data as Array<Record<string, unknown>>).map(rowToMediaAsset);
  } catch {
    return null;
  }
}

async function listStorageFiles(prefix = ""): Promise<MediaAsset[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list(prefix, {
      limit: 1000,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });
    if (error || !data) return [];

    const nested = await Promise.all(data.map(async (item) => {
      const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
      const metadata = item.metadata as { mimetype?: string; size?: number } | null | undefined;

      if (!metadata) {
        return listStorageFiles(itemPath);
      }

      const ext = item.name.split(".").pop()?.toLowerCase() || "";
      if (!MEDIA_EXTENSIONS.has(ext)) return [];

      const { data: publicUrlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(itemPath);
      const now = item.updated_at || item.created_at || new Date().toISOString();

      return [{
        id: `storage:${itemPath}`,
        file_name: itemPath,
        original_name: item.name,
        file_url: publicUrlData.publicUrl,
        file_type: ext,
        mime_type: metadata.mimetype || "",
        size: Number(metadata.size || 0),
        alt_text: "",
        title: item.name,
        description: "",
        folder: prefix || "media",
        tags: ["supabase-storage"],
        status: "active",
        created_at: item.created_at || now,
        updated_at: now,
        deleted_at: null,
      } satisfies MediaAsset];
    }));

    return nested.flat();
  } catch {
    return [];
  }
}

function uniqueAssets(assets: MediaAsset[]) {
  const byKey = new Map<string, MediaAsset>();

  for (const asset of assets) {
    const key = asset.file_url || asset.file_name || asset.id;
    const existing = byKey.get(key);
    if (!existing || (existing.status === "deleted" && asset.status !== "deleted")) {
      byKey.set(key, asset);
    }
  }

  return Array.from(byKey.values()).sort((a, b) => {
    const folderCompare = a.folder.localeCompare(b.folder);
    if (folderCompare !== 0) return folderCompare;
    return a.original_name.localeCompare(b.original_name);
  });
}

async function readFromSupabase(query: (s: ReturnType<typeof createAdminClient>) => Promise<Record<string, unknown> | null>): Promise<MediaAsset | null> {
  try {
    const supabase = createAdminClient();
    const row = await query(supabase);
    if (!row) return null;
    return rowToMediaAsset(row);
  } catch { /* fall through */ }
  return null;
}

async function upsertMediaAsset(a: MediaAsset): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from(TABLE).upsert(mediaAssetToRow(a), { onConflict: "id" });
  } catch { /* best-effort */ }
}

async function deleteAssetFromDb(id: string): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from(TABLE).delete().eq("id", id);
  } catch { /* best-effort */ }
}

async function deleteFileFromStorage(filePath: string): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
  } catch { /* best-effort */ }
}

// ── Public API ──

export async function getMediaAssets() {
  const fromSupabase = await readAllFromSupabase();
  const registeredAssets = fromSupabase ?? await readJsonFile<MediaAsset[]>(FILE_NAME, []);
  const storageAssets = await listStorageFiles();

  return uniqueAssets([...registeredAssets, ...storageAssets]);
}

export async function getMediaAssetById(id: string) {
  const result = await readFromSupabase(async (supabase) => {
    const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
    return data as Record<string, unknown> | null;
  });
  if (result) return result;
  const assets = await readJsonFile<MediaAsset[]>(FILE_NAME, []);
  return assets.find((a) => a.id === id) ?? null;
}

export async function createMediaAsset(data: MediaInput) {
  const assets = await readJsonFile<MediaAsset[]>(FILE_NAME, []);
  const next = normalizeAsset(data);
  await writeJsonFile(FILE_NAME, [next, ...assets]);
  await upsertMediaAsset(next);
  await logAction({ action: "create", entity_type: "media", entity_id: next.id, entity_title: next.original_name || next.file_name, new_data: next });
  return next;
}

export async function updateMediaAsset(id: string, data: MediaInput) {
  const assets = await readJsonFile<MediaAsset[]>(FILE_NAME, []);
  const index = assets.findIndex((a) => a.id === id);
  if (index === -1) return null;
  const old = assets[index];
  const next = normalizeAsset(data, old);
  assets[index] = next;
  await writeJsonFile(FILE_NAME, assets);
  await upsertMediaAsset(next);
  await logAction({ action: "update", entity_type: "media", entity_id: next.id, entity_title: next.original_name || next.file_name, old_data: old, new_data: next });
  return next;
}

export async function deleteMediaAsset(id: string) {
  const assets = await readJsonFile<MediaAsset[]>(FILE_NAME, []);
  const item = assets.find((a) => a.id === id);
  const next = assets.filter((a) => a.id !== id);
  if (next.length === assets.length) return false;
  await writeJsonFile(FILE_NAME, next);
  await deleteAssetFromDb(id);
  if (item) {
    await deleteFileFromStorage(item.file_name);
    await logAction({ action: "delete_permanently", entity_type: "media", entity_id: id, entity_title: item.original_name || item.file_name, old_data: item });
  }
  return true;
}

export async function moveMediaToTrash(id: string, deletedBy?: string) {
  const dBy = deletedBy ?? await getCurrentUserEmail();
  const assets = await readJsonFile<MediaAsset[]>(FILE_NAME, []);
  const index = assets.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const current = assets[index];
  const deletedAt = new Date().toISOString();
  const trashed: MediaAsset = {
    ...current,
    status: "deleted",
    deleted_at: deletedAt,
    updated_at: deletedAt,
  };
  assets[index] = trashed;
  await writeJsonFile(FILE_NAME, assets);
  await upsertMediaAsset(trashed);

  await addTrashItem({
    id: randomUUID(),
    entity_type: "media",
    entity_id: current.id,
    title: current.original_name || current.file_name,
    deleted_by: dBy,
    deleted_at: deletedAt,
    restore_data: current,
  });
  await logAction({ action: "trash", entity_type: "media", entity_id: current.id, entity_title: current.original_name || current.file_name, old_data: current, user_email: dBy });
  return trashed;
}

export async function restoreMediaAsset(id: string) {
  const assets = await readJsonFile<MediaAsset[]>(FILE_NAME, []);
  const index = assets.findIndex((a) => a.id === id);
  const trashItem = await getTrashItemByEntity(id);

  if (index === -1 && !trashItem) return null;

  const restored = trashItem?.restore_data && typeof trashItem.restore_data === "object"
    ? ({ ...(trashItem.restore_data as MediaAsset), status: "active", deleted_at: null, updated_at: new Date().toISOString() } as MediaAsset)
    : ({ ...assets[index], status: "active", deleted_at: null, updated_at: new Date().toISOString() } as MediaAsset);

  if (index === -1) {
    const all = await readJsonFile<MediaAsset[]>(FILE_NAME, []);
    all.unshift(restored);
    await writeJsonFile(FILE_NAME, all);
  } else {
    assets[index] = restored;
    await writeJsonFile(FILE_NAME, assets);
  }
  await upsertMediaAsset(restored);

  if (trashItem) {
    await removeTrashItem(trashItem.id);
  }
  await logAction({ action: "restore", entity_type: "media", entity_id: restored.id, entity_title: restored.original_name || restored.file_name });
  return restored;
}

export async function getMediaByFolder(folder: string) {
  const items = await getMediaAssets();
  return items.filter((a) => a.folder === folder && a.status !== "deleted");
}

export async function getMediaByType(fileType: string) {
  const items = await getMediaAssets();
  return items.filter((a) => a.file_type === fileType && a.status !== "deleted");
}
