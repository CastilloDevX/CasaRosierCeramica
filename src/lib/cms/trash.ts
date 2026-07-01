import { createAdminClient } from "../supabase/admin";
import { createClient } from "../supabase/server";
import { readJsonFile, writeJsonFile } from "./local-storage";
import type { TrashItem } from "./types";

const TABLE = "trash_items";
const FILE_NAME = "trash.json";

// ── Mapping helpers ──

function rowToTrashItem(row: Record<string, unknown>): TrashItem {
  return {
    ...row,
    restore_data: row.restore_data ?? null,
  } as unknown as TrashItem;
}

function trashItemToRow(item: TrashItem): Record<string, unknown> {
  return { ...item };
}

// ── User helper ──

export async function getCurrentUserEmail(): Promise<string> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) return user.email;
  } catch { /* not in request context */ }
  return "system";
}

// ── Supabase helpers ──

async function readAllFromSupabase(): Promise<TrashItem[] | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return (data as Array<Record<string, unknown>>).map(rowToTrashItem);
  } catch {
    return null;
  }
}

async function upsertTrashItem(item: TrashItem): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from(TABLE).upsert(trashItemToRow(item), { onConflict: "id" });
  } catch { /* best-effort */ }
}

async function deleteTrashItemFromDb(id: string): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from(TABLE).delete().eq("id", id);
  } catch { /* best-effort */ }
}

// ── Public API ──

export async function getTrashItems() {
  const fromSupabase = await readAllFromSupabase();
  if (fromSupabase) return fromSupabase;
  return readJsonFile<TrashItem[]>(FILE_NAME, []);
}

export async function addTrashItem(item: TrashItem) {
  const items = await readJsonFile<TrashItem[]>(FILE_NAME, []);
  const next = [item, ...items.filter((current) => current.id !== item.id)];
  await writeJsonFile(FILE_NAME, next);
  await upsertTrashItem(item);
  return item;
}

export async function removeTrashItem(id: string) {
  const items = await readJsonFile<TrashItem[]>(FILE_NAME, []);
  const next = items.filter((item) => item.id !== id);
  await writeJsonFile(FILE_NAME, next);
  await deleteTrashItemFromDb(id);
}

export async function getTrashItemByEntity(entityId: string) {
  // Try Supabase first
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from(TABLE).select("*").eq("entity_id", entityId).maybeSingle();
    if (data) return rowToTrashItem(data as Record<string, unknown>);
  } catch { /* fall through */ }
  const items = await readJsonFile<TrashItem[]>(FILE_NAME, []);
  return items.find((item) => item.entity_id === entityId) ?? null;
}

// Esta capa se reemplazará por Supabase cuando el CMS salga de modo local.
