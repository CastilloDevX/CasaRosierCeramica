import { randomUUID } from "crypto";
import { createAdminClient } from "../supabase/admin";
import { addTrashItem, getCurrentUserEmail, getTrashItemByEntity, removeTrashItem } from "./trash";
import { readJsonFile, writeJsonFile } from "./local-storage";
import { isFooterStatus } from "./types";
import type { FooterComponent, FooterStatus, SocialLink } from "./types";
import type { Json } from "../supabase/types";
import { logAction } from "./history-logs";

const TABLE = "footers";
const FILE_NAME = "footers.json";

type Input = Partial<Omit<FooterComponent, "id" | "created_at" | "updated_at" | "deleted_at" | "social_links">> & {
  id?: string; deleted_at?: string | null; social_links?: SocialLink[];
};

function normalize(input: Input, existing?: FooterComponent) {
  const name = String(input.name ?? existing?.name ?? "").trim();
  const status = input.status ?? existing?.status ?? "draft";
  const now = new Date().toISOString();
  if (!name) throw new Error("El nombre es obligatorio.");
  if (!isFooterStatus(status)) throw new Error("Estado no válido.");
  return {
    id: existing?.id ?? input.id ?? randomUUID(), name, status,
    logo_id: String(input.logo_id ?? existing?.logo_id ?? "").trim(),
    contact_email: String(input.contact_email ?? existing?.contact_email ?? "").trim(),
    whatsapp: String(input.whatsapp ?? existing?.whatsapp ?? "").trim(),
    address: String(input.address ?? existing?.address ?? "").trim(),
    legal_text: String(input.legal_text ?? existing?.legal_text ?? "").trim(),
    social_links: input.social_links ?? existing?.social_links ?? [],
    menu_id: input.menu_id !== undefined ? input.menu_id : (existing?.menu_id ?? null),
    newsletter_enabled: input.newsletter_enabled !== undefined ? input.newsletter_enabled : (existing?.newsletter_enabled ?? false),
    created_at: existing?.created_at ?? now, updated_at: now,
    deleted_at: input.status === "deleted" ? existing?.deleted_at ?? now : null,
  } satisfies FooterComponent;
}

async function readAllFromSupabase(): Promise<FooterComponent[] | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return (data as unknown as Array<Record<string, unknown>>).map((row) => ({
      ...row,
      social_links: Array.isArray(row.social_links) ? row.social_links : [],
    })) as FooterComponent[];
  } catch {
    return null;
  }
}

async function upsertToSupabase(item: FooterComponent): Promise<void> {
  try {
    const supabase = createAdminClient();
    const record: Record<string, unknown> = { ...item, social_links: item.social_links as unknown as Json };
    await supabase.from(TABLE).upsert(record, { onConflict: "id" });
  } catch { /* best-effort */ }
}

async function deleteFromSupabase(id: string): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from(TABLE).delete().eq("id", id);
  } catch { /* best-effort */ }
}

export async function getFooters() {
  const fromSupabase = await readAllFromSupabase();
  if (fromSupabase) return fromSupabase;
  return readJsonFile<FooterComponent[]>(FILE_NAME, []);
}

export async function getFooterById(id: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
    if (!error && data) {
      const row = data as Record<string, unknown>;
      return { ...row, social_links: Array.isArray(row.social_links) ? row.social_links : [] } as FooterComponent;
    }
  } catch { /* fall through */ }
  const all = await readJsonFile<FooterComponent[]>(FILE_NAME, []);
  return all.find((x) => x.id === id) ?? null;
}

export async function createFooter(data: Input) {
  const all = await readJsonFile<FooterComponent[]>(FILE_NAME, []);
  const next = normalize(data);
  await writeJsonFile(FILE_NAME, [next, ...all]);
  await upsertToSupabase(next);
  await logAction({ action: "create", entity_type: "footer", entity_id: next.id, entity_title: next.name, new_data: next });
  return next;
}

export async function updateFooter(id: string, data: Input) {
  const all = await readJsonFile<FooterComponent[]>(FILE_NAME, []);
  const idx = all.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  const old = all[idx];
  const next = normalize(data, old);
  all[idx] = next;
  await writeJsonFile(FILE_NAME, all);
  await upsertToSupabase(next);
  if (old.status !== next.status) {
    if (next.status === "published") await logAction({ action: "publish", entity_type: "footer", entity_id: next.id, entity_title: next.name, old_data: old, new_data: next });
    else if (old.status === "published") await logAction({ action: "unpublish", entity_type: "footer", entity_id: next.id, entity_title: next.name, old_data: old, new_data: next });
  }
  await logAction({ action: "update", entity_type: "footer", entity_id: next.id, entity_title: next.name, old_data: old, new_data: next });
  return next;
}

export async function duplicateFooter(id: string) {
  const all = await readJsonFile<FooterComponent[]>(FILE_NAME, []);
  const orig = all.find((x) => x.id === id);
  if (!orig) return null;
  const copy = normalize({ ...orig, name: `${orig.name} (copia)`, status: "draft" });
  await writeJsonFile(FILE_NAME, [copy, ...all]);
  await upsertToSupabase(copy);
  await logAction({ action: "duplicate", entity_type: "footer", entity_id: orig.id, entity_title: orig.name, new_data: copy });
  return copy;
}

export async function moveFooterToTrash(id: string, deletedBy?: string) {
  const dBy = deletedBy ?? await getCurrentUserEmail();
  const all = await readJsonFile<FooterComponent[]>(FILE_NAME, []);
  const idx = all.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  const d = new Date().toISOString();
  const t: FooterComponent = { ...all[idx], status: "deleted", deleted_at: d, updated_at: d };
  all[idx] = t;
  await writeJsonFile(FILE_NAME, all);
  await upsertToSupabase(t);
  await addTrashItem({ id: randomUUID(), entity_type: "footer", entity_id: id, title: t.name, deleted_by: dBy, deleted_at: d, restore_data: all[idx] });
  await logAction({ action: "trash", entity_type: "footer", entity_id: id, entity_title: t.name, old_data: all[idx], user_email: dBy });
  return t;
}

export async function restoreFooter(id: string) {
  const all = await readJsonFile<FooterComponent[]>(FILE_NAME, []);
  const idx = all.findIndex((x) => x.id === id);
  const ti = await getTrashItemByEntity(id);
  if (idx === -1 && !ti) return null;
  const r = ti?.restore_data && typeof ti.restore_data === "object"
    ? { ...(ti.restore_data as FooterComponent), status: "draft" as const, deleted_at: null, updated_at: new Date().toISOString() }
    : { ...all[idx], status: "draft" as const, deleted_at: null, updated_at: new Date().toISOString() };
  if (idx === -1) { const a = await readJsonFile<FooterComponent[]>(FILE_NAME, []); a.unshift(r); await writeJsonFile(FILE_NAME, a); }
  else { all[idx] = r; await writeJsonFile(FILE_NAME, all); }
  await upsertToSupabase(r);
  if (ti) await removeTrashItem(ti.id);
  await logAction({ action: "restore", entity_type: "footer", entity_id: r.id, entity_title: r.name });
  return r;
}

export async function deleteFooterPermanently(id: string) {
  const all = await readJsonFile<FooterComponent[]>(FILE_NAME, []);
  const item = all.find((x) => x.id === id);
  const next = all.filter((x) => x.id !== id);
  if (next.length === all.length) return false;
  await writeJsonFile(FILE_NAME, next);
  await deleteFromSupabase(id);
  const ti = await getTrashItemByEntity(id);
  if (ti) await removeTrashItem(ti.id);
  if (item) await logAction({ action: "delete_permanently", entity_type: "footer", entity_id: id, entity_title: item.name, old_data: item });
  return true;
}
