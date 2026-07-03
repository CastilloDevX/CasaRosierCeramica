import { randomUUID } from "crypto";
import { createAdminClient } from "../supabase/admin";
import { addTrashItem, getCurrentUserEmail, getTrashItemByEntity, removeTrashItem } from "./trash";
import { readJsonFile, writeJsonFile } from "./local-storage";
import { isPromoStatus, PROMO_VISUAL_VARIANTS } from "./types";
import type { PromoBanner, PromoStatus } from "./types";
import { logAction } from "./history-logs";

const TABLE = "promo_banners";
const FILE_NAME = "promo-banners.json";
type Input = Partial<Omit<PromoBanner, "id" | "created_at" | "updated_at" | "deleted_at">> & { id?: string; deleted_at?: string | null; };
const LIMITS = {
  key_text: 40,
  title: 60,
  text: 600,
  detail_text: 600,
  button_text: 28,
};

function limitText(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function normalize(input: Input, existing?: PromoBanner) {
  const title = limitText(input.title ?? existing?.title ?? "", LIMITS.title);
  const status = input.status ?? existing?.status ?? "draft";
  const now = new Date().toISOString();
  if (!title) throw new Error("El título es obligatorio.");
  if (!isPromoStatus(status)) throw new Error("Estado no válido.");
  const vv = input.visual_variant ?? existing?.visual_variant ?? "default";
  return {
    id: existing?.id ?? input.id ?? randomUUID(),
    title,
    text: limitText(input.text ?? existing?.text ?? "", LIMITS.text),
    key_text: limitText(input.key_text ?? existing?.key_text ?? "", LIMITS.key_text),
    detail_text: limitText(input.detail_text ?? existing?.detail_text ?? "", LIMITS.detail_text),
    image_url: String(input.image_url ?? existing?.image_url ?? "").trim(),
    button_text: limitText(input.button_text ?? existing?.button_text ?? "Ver mas", LIMITS.button_text),
    link_url: String(input.link_url ?? existing?.link_url ?? "").trim(),
    start_date: String(input.start_date ?? existing?.start_date ?? "").trim(),
    end_date: String(input.end_date ?? existing?.end_date ?? "").trim(),
    status,
    visual_variant: PROMO_VISUAL_VARIANTS.includes(vv as never) ? vv : "default",
    created_at: existing?.created_at ?? now,
    updated_at: now,
    deleted_at: input.status === "deleted" ? existing?.deleted_at ?? now : null,
  } satisfies PromoBanner;
}

// ── Mapping helpers ──

function rowToPromoBanner(row: Record<string, unknown>): PromoBanner {
  return {
    ...row,
    text: String(row.text ?? ""),
    key_text: String(row.key_text ?? ""),
    detail_text: String(row.detail_text ?? ""),
    image_url: String(row.image_url ?? ""),
    button_text: String(row.button_text ?? "Ver mas"),
    link_url: String(row.link_url ?? ""),
    start_date: String(row.start_date ?? ""),
    end_date: String(row.end_date ?? ""),
  } as unknown as PromoBanner;
}

function promoBannerToRow(p: PromoBanner): Record<string, unknown> {
  return { ...p };
}

function promoBannerToLegacyRow(p: PromoBanner): Record<string, unknown> {
  const { key_text, detail_text, image_url, button_text, ...legacy } = p;
  return legacy;
}

// ── Supabase helpers ──

async function readAllFromSupabase(): Promise<PromoBanner[] | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return (data as Array<Record<string, unknown>>).map(rowToPromoBanner);
  } catch {
    return null;
  }
}

async function readFromSupabase(query: (s: ReturnType<typeof createAdminClient>) => Promise<Record<string, unknown> | null>): Promise<PromoBanner | null> {
  try {
    const supabase = createAdminClient();
    const row = await query(supabase);
    if (!row) return null;
    return rowToPromoBanner(row);
  } catch { /* fall through */ }
  return null;
}

async function upsertPromoBanner(p: PromoBanner): Promise<void> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from(TABLE).upsert(promoBannerToRow(p), { onConflict: "id" });
    if (error) {
      await supabase.from(TABLE).upsert(promoBannerToLegacyRow(p), { onConflict: "id" });
    }
  } catch { /* best-effort */ }
}

async function seedSupabase(items: PromoBanner[]): Promise<void> {
  if (items.length === 0) return;
  for (const item of items) {
    await upsertPromoBanner(item);
  }
}

async function enforceSinglePublished(id: string, items: PromoBanner[]) {
  const now = new Date().toISOString();
  const nextItems = items.map((item) =>
    item.id !== id && item.status === "published"
      ? { ...item, status: "archived" as const, updated_at: now }
      : item,
  );
  await writeJsonFile(FILE_NAME, nextItems);
  try {
    const supabase = createAdminClient();
    await supabase.from(TABLE).update({ status: "archived", updated_at: now }).eq("status", "published").neq("id", id);
  } catch { /* best-effort */ }
}

async function deletePromoBannerFromDb(id: string): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from(TABLE).delete().eq("id", id);
  } catch { /* best-effort */ }
}

// ── Public API ──

export async function getPromoBanners() {
  const fromSupabase = await readAllFromSupabase();
  if (fromSupabase) return fromSupabase;
  const localBanners = await readJsonFile<PromoBanner[]>(FILE_NAME, []);
  await seedSupabase(localBanners);
  return localBanners;
}

export async function getPromoBannerById(id: string) {
  const result = await readFromSupabase(async (supabase) => {
    const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
    return data as Record<string, unknown> | null;
  });
  if (result) return result;
  const all = await readJsonFile<PromoBanner[]>(FILE_NAME, []);
  const localBanner = all.find((x) => x.id === id) ?? null;
  if (localBanner) await seedSupabase([localBanner]);
  return localBanner;
}

export async function getActivePromoBanner() {
  const now = new Date();
  const items = await getPromoBanners();
  return items
    .filter((item) => {
      if (item.status !== "published" || item.deleted_at) return false;
      if (item.start_date && new Date(item.start_date) > now) return false;
      if (item.end_date && new Date(item.end_date) < now) return false;
      return true;
    })
    .sort((a, b) => +new Date(b.updated_at || b.created_at) - +new Date(a.updated_at || a.created_at))[0] ?? null;
}

export async function createPromoBanner(data: Input) {
  const all = await readJsonFile<PromoBanner[]>(FILE_NAME, []);
  const next = normalize(data);
  await writeJsonFile(FILE_NAME, [next, ...all]);
  await upsertPromoBanner(next);
  if (next.status === "published") await enforceSinglePublished(next.id, [next, ...all]);
  await logAction({ action: "create", entity_type: "promo_banner", entity_id: next.id, entity_title: next.title, new_data: next });
  return next;
}

export async function updatePromoBanner(id: string, data: Input) {
  const all = await readJsonFile<PromoBanner[]>(FILE_NAME, []);
  const idx = all.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  const old = all[idx];
  const next = normalize(data, old);
  all[idx] = next;
  await writeJsonFile(FILE_NAME, all);
  await upsertPromoBanner(next);
  if (next.status === "published") await enforceSinglePublished(next.id, all);
  if (old.status !== next.status) {
    if (next.status === "published") await logAction({ action: "publish", entity_type: "promo_banner", entity_id: next.id, entity_title: next.title, old_data: old, new_data: next });
    else if (old.status === "published") await logAction({ action: "unpublish", entity_type: "promo_banner", entity_id: next.id, entity_title: next.title, old_data: old, new_data: next });
  }
  await logAction({ action: "update", entity_type: "promo_banner", entity_id: next.id, entity_title: next.title, old_data: old, new_data: next });
  return next;
}

export async function duplicatePromoBanner(id: string) {
  const all = await readJsonFile<PromoBanner[]>(FILE_NAME, []);
  const orig = all.find((x) => x.id === id);
  if (!orig) return null;
  const copy = normalize({ ...orig, title: `${orig.title} (copia)`, status: "draft" });
  await writeJsonFile(FILE_NAME, [copy, ...all]);
  await upsertPromoBanner(copy);
  await logAction({ action: "duplicate", entity_type: "promo_banner", entity_id: orig.id, entity_title: orig.title, new_data: copy });
  return copy;
}

export async function movePromoBannerToTrash(id: string, deletedBy?: string) {
  const dBy = deletedBy ?? await getCurrentUserEmail();
  const all = await readJsonFile<PromoBanner[]>(FILE_NAME, []); const idx = all.findIndex((x) => x.id === id); if (idx === -1) return null;
  const d = new Date().toISOString(); const t: PromoBanner = { ...all[idx], status: "deleted", deleted_at: d, updated_at: d };
  all[idx] = t; await writeJsonFile(FILE_NAME, all);
  await upsertPromoBanner(t);
  await addTrashItem({ id: randomUUID(), entity_type: "promo_banner", entity_id: id, title: t.title, deleted_by: dBy, deleted_at: d, restore_data: all[idx] }); await logAction({ action: "trash", entity_type: "promo_banner", entity_id: id, entity_title: t.title, old_data: all[idx], user_email: dBy }); return t;
}

export async function restorePromoBanner(id: string) {
  const all = await readJsonFile<PromoBanner[]>(FILE_NAME, []); const idx = all.findIndex((x) => x.id === id); const ti = await getTrashItemByEntity(id);
  if (idx === -1 && !ti) return null;
  const r = ti?.restore_data && typeof ti.restore_data === "object" ? { ...(ti.restore_data as PromoBanner), status: "draft" as const, deleted_at: null, updated_at: new Date().toISOString() } : { ...all[idx], status: "draft" as const, deleted_at: null, updated_at: new Date().toISOString() };
  if (idx === -1) { const a = await readJsonFile<PromoBanner[]>(FILE_NAME, []); a.unshift(r); await writeJsonFile(FILE_NAME, a); }
  else { all[idx] = r; await writeJsonFile(FILE_NAME, all); }
  await upsertPromoBanner(r);
  if (ti) await removeTrashItem(ti.id); await logAction({ action: "restore", entity_type: "promo_banner", entity_id: r.id, entity_title: r.title }); return r;
}

export async function deletePromoBannerPermanently(id: string) {
  const all = await readJsonFile<PromoBanner[]>(FILE_NAME, []); const item = all.find((x) => x.id === id); const next = all.filter((x) => x.id !== id); if (next.length === all.length) return false;
  await writeJsonFile(FILE_NAME, next); await deletePromoBannerFromDb(id); const ti = await getTrashItemByEntity(id); if (ti) await removeTrashItem(ti.id); if (item) await logAction({ action: "delete_permanently", entity_type: "promo_banner", entity_id: id, entity_title: item.title, old_data: item }); return true;
}
