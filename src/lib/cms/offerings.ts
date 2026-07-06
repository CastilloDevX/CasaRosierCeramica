import { randomUUID } from "crypto";
import { createAdminClient } from "../supabase/admin";
import { addTrashItem, getCurrentUserEmail, getTrashItemByEntity, removeTrashItem } from "./trash";
import { readJsonFile, writeJsonFile } from "./local-storage";
import { isOfferingStatus, isOfferingType } from "./types";
import type { Offering } from "./types";
import type { Json } from "../supabase/types";
import { logAction } from "./history-logs";

const TABLE = "offerings";
const FILE_NAME = "offerings.json";
const SUPABASE_READ_TIMEOUT_MS = 10_000;
const OFFERINGS_CACHE_TTL_MS = 15_000;

let offeringsCache: { items: Offering[]; expiresAt: number } | null = null;

type OfferingInput = Partial<Omit<Offering, "id" | "created_at" | "updated_at" | "deleted_at">> & {
  id?: string;
  deleted_at?: string | null;
};

function getCachedOfferings() {
  if (!offeringsCache || offeringsCache.expiresAt <= Date.now()) return null;
  return offeringsCache.items;
}

function cacheOfferings(items: Offering[]) {
  offeringsCache = { items, expiresAt: Date.now() + OFFERINGS_CACHE_TTL_MS };
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise.catch(() => fallback).finally(() => {
        if (timeout) clearTimeout(timeout);
      }),
      new Promise<T>((resolve) => {
        timeout = setTimeout(() => resolve(fallback), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function uniqueSlug(items: Offering[], baseSlug: string, currentId?: string) {
  const taken = new Set(items.filter((item) => item.id !== currentId).map((item) => item.slug));
  if (!taken.has(baseSlug)) return baseSlug;
  let counter = 2;
  while (taken.has(`${baseSlug}-${counter}`)) counter++;
  return `${baseSlug}-${counter}`;
}

function duplicateSlugBase(slug: string, items: Offering[]) {
  const match = slug.match(/^(.*)-(\d+)$/);
  if (match?.[1] && items.some((item) => item.slug === match[1])) {
    return match[1];
  }
  return slug;
}

function normalizeTextArray(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  return [] as string[];
}

function normalizeDetails(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Offering["details"];
  return {};
}

function normalizeOffering(input: OfferingInput, existing?: Offering, allItems: Offering[] = []) {
  const title = String(input.title ?? existing?.title ?? "").trim();
  const rawSlug = String(input.slug ?? existing?.slug ?? "").trim();
  const slugBase = toSlug(rawSlug) || toSlug(title) || "offering";
  const slug = uniqueSlug(allItems, slugBase, existing?.id);
  const now = new Date().toISOString();
  const type = input.type ?? existing?.type;
  const status = input.status ?? existing?.status ?? "draft";

  if (!isOfferingType(type)) throw new Error("Tipo de offering no válido.");
  if (!isOfferingStatus(status)) throw new Error("Estado de offering no válido.");

  return {
    id: existing?.id ?? input.id ?? randomUUID(),
    type,
    title,
    slug,
    subtitle: String(input.subtitle ?? existing?.subtitle ?? "").trim(),
    excerpt: String(input.excerpt ?? existing?.excerpt ?? "").trim(),
    description: String(input.description ?? existing?.description ?? "").trim(),
    price: input.price === undefined ? existing?.price ?? null : input.price === null ? null : Number(input.price),
    currency: String(input.currency ?? existing?.currency ?? "USD").trim().toUpperCase() || "USD",
    status,
    featured: Boolean(input.featured ?? existing?.featured ?? false),
    header_id: input.header_id !== undefined ? (input.header_id || null) : existing?.header_id ?? null,
    duration: String(input.duration ?? existing?.duration ?? "").trim(),
    schedule: normalizeTextArray(input.schedule ?? existing?.schedule ?? []),
    teacher: String(input.teacher ?? existing?.teacher ?? "").trim(),
    capacity: input.capacity === undefined ? existing?.capacity ?? null : input.capacity === null ? null : Number(input.capacity),
    cover_image_url: String(input.cover_image_url ?? existing?.cover_image_url ?? "").trim(),
    gallery: normalizeTextArray(input.gallery ?? existing?.gallery ?? []),
    details: normalizeDetails(input.details ?? existing?.details ?? {}),
    seo_title: String(input.seo_title ?? existing?.seo_title ?? "").trim(),
    seo_description: String(input.seo_description ?? existing?.seo_description ?? "").trim(),
    created_at: existing?.created_at ?? now,
    updated_at: now,
    deleted_at: input.status === "deleted" ? existing?.deleted_at ?? now : input.deleted_at ?? existing?.deleted_at ?? null,
  } satisfies Offering;
}

function rowToOffering(row: Record<string, unknown>): Offering {
  return {
    ...row,
    schedule: Array.isArray(row.schedule) ? row.schedule : [],
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    details: normalizeDetails(row.details),
  } as Offering;
}

function offeringToRow(offering: Offering): Record<string, unknown> {
  const { ...rest } = offering;
  return {
    ...rest,
    schedule: rest.schedule as unknown as Json,
    gallery: rest.gallery as unknown as Json,
    details: rest.details as unknown as Json,
  };
}

async function readAllFromSupabase(): Promise<Offering[] | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return (data as Array<Record<string, unknown>>).map(rowToOffering);
  } catch {
    return null;
  }
}

async function readOneFromSupabase(column: "id" | "slug", value: string): Promise<Offering | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from(TABLE).select("*").eq(column, value).maybeSingle();
    if (error || !data) return null;
    return rowToOffering(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

async function upsertToSupabase(item: Offering): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from(TABLE).upsert(offeringToRow(item), { onConflict: "id" });
  } catch { /* best-effort */ }
}

async function saveToSupabase(item: Offering): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from(TABLE).upsert(offeringToRow(item), { onConflict: "id" });
  if (error) throw error;
}

async function seedSupabase(items: Offering[]): Promise<void> {
  if (items.length === 0) return;
  try {
    const supabase = createAdminClient();
    await supabase.from(TABLE).upsert(items.map(offeringToRow), { onConflict: "id" });
  } catch { /* best-effort */ }
}

async function deleteFromSupabase(id: string): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from(TABLE).delete().eq("id", id);
  } catch { /* best-effort */ }
}

export async function getOfferings() {
  const cached = getCachedOfferings();
  if (cached) return cached;

  const fromSupabase = await withTimeout(readAllFromSupabase(), SUPABASE_READ_TIMEOUT_MS, null);
  if (fromSupabase) {
    cacheOfferings(fromSupabase);
    return fromSupabase;
  }

  const localOfferings = await readJsonFile<Offering[]>(FILE_NAME, []);
  cacheOfferings(localOfferings);
  void seedSupabase(localOfferings);
  return localOfferings;
}

export async function getOfferingById(id: string) {
  const cached = getCachedOfferings()?.find((item) => item.id === id);
  if (cached) return cached;

  const fromSupabase = await withTimeout(readOneFromSupabase("id", id), SUPABASE_READ_TIMEOUT_MS, null);
  if (fromSupabase) return fromSupabase;

  const offerings = await getOfferings();
  return offerings.find((item) => item.id === id) ?? null;
}

export async function getOfferingBySlug(slug: string) {
  const cached = getCachedOfferings()?.find((item) => item.slug === slug);
  if (cached) return cached;

  const fromSupabase = await withTimeout(readOneFromSupabase("slug", slug), SUPABASE_READ_TIMEOUT_MS, null);
  if (fromSupabase) return fromSupabase;

  const offerings = await getOfferings();
  return offerings.find((item) => item.slug === slug) ?? null;
}

export async function createOffering(data: OfferingInput) {
  const offerings = await getOfferings();
  const next = normalizeOffering(data, undefined, offerings);

  if (!next.title || !next.type) {
    throw new Error("El título y el tipo son obligatorios.");
  }

  const nextItems = [next, ...offerings];
  await saveToSupabase(next);
  cacheOfferings(nextItems);
  void logAction({ action: "create", entity_type: "offering", entity_id: next.id, entity_title: next.title, new_data: next });
  return next;
}

export async function updateOffering(id: string, data: OfferingInput) {
  const offerings = await getOfferings();
  const index = offerings.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const old = offerings[index];
  const next = normalizeOffering(data, old, offerings);
  offerings[index] = next;
  await saveToSupabase(next);
  cacheOfferings(offerings);
  if (old.status !== next.status) {
    if (next.status === "published") void logAction({ action: "publish", entity_type: "offering", entity_id: next.id, entity_title: next.title, old_data: old, new_data: next });
    else if (old.status === "published") void logAction({ action: "unpublish", entity_type: "offering", entity_id: next.id, entity_title: next.title, old_data: old, new_data: next });
  }
  void logAction({ action: "update", entity_type: "offering", entity_id: next.id, entity_title: next.title, old_data: old, new_data: next });
  return next;
}

export async function duplicateOffering(id: string) {
  const offerings = await getOfferings();
  const original = offerings.find((item) => item.id === id);
  if (!original) return null;
  const duplicateData: OfferingInput = { ...original, id: undefined, deleted_at: null };
  const copy = normalizeOffering(
    { ...duplicateData, title: `${original.title} (copia)`, slug: duplicateSlugBase(original.slug, offerings), status: "draft", deleted_at: null },
    undefined,
    offerings,
  );
  const nextItems = [copy, ...offerings];
  await saveToSupabase(copy);
  cacheOfferings(nextItems);
  void logAction({ action: "duplicate", entity_type: "offering", entity_id: original.id, entity_title: original.title, new_data: copy });
  return copy;
}

export async function moveOfferingToTrash(id: string, deletedBy?: string) {
  const dBy = deletedBy ?? await getCurrentUserEmail();
  const offerings = await readJsonFile<Offering[]>(FILE_NAME, []);
  const index = offerings.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const current = offerings[index];
  const deletedAt = new Date().toISOString();
  const trashed: Offering = { ...current, status: "deleted", deleted_at: deletedAt, updated_at: deletedAt };

  offerings[index] = trashed;
  await writeJsonFile(FILE_NAME, offerings);
  cacheOfferings(offerings);
  await upsertToSupabase(trashed);

  await addTrashItem({
    id: randomUUID(), entity_type: "offering", entity_id: current.id, title: current.title,
    deleted_by: dBy, deleted_at: deletedAt, restore_data: current,
  });
  await logAction({ action: "trash", entity_type: "offering", entity_id: current.id, entity_title: current.title, old_data: current, user_email: dBy });
  return trashed;
}

export async function restoreOffering(id: string) {
  const offerings = await readJsonFile<Offering[]>(FILE_NAME, []);
  const index = offerings.findIndex((item) => item.id === id);
  const trashItem = await getTrashItemByEntity(id);
  if (index === -1 && !trashItem) return null;

  const restored = trashItem?.restore_data && typeof trashItem.restore_data === "object"
    ? ({ ...(trashItem.restore_data as Offering), status: (trashItem.restore_data as Offering).status === "deleted" ? "draft" : (trashItem.restore_data as Offering).status, deleted_at: null, updated_at: new Date().toISOString() } as Offering)
    : ({ ...offerings[index], status: "draft", deleted_at: null, updated_at: new Date().toISOString() } as Offering);

  if (index === -1) {
    offerings.unshift(restored);
  } else {
    offerings[index] = restored;
  }
  await writeJsonFile(FILE_NAME, offerings);
  cacheOfferings(offerings);
  await upsertToSupabase(restored);

  if (trashItem) await removeTrashItem(trashItem.id);
  await logAction({ action: "restore", entity_type: "offering", entity_id: restored.id, entity_title: restored.title });
  return restored;
}

export async function deleteOfferingPermanently(id: string) {
  const offerings = await readJsonFile<Offering[]>(FILE_NAME, []);
  const item = offerings.find((o) => o.id === id);
  const next = offerings.filter((item) => item.id !== id);

  const trashItem = await getTrashItemByEntity(id);
  const changed = next.length !== offerings.length || Boolean(trashItem);
  if (!changed) return false;

  await writeJsonFile(FILE_NAME, next);
  cacheOfferings(next);
  await deleteFromSupabase(id);
  if (trashItem) await removeTrashItem(trashItem.id);
  if (item) await logAction({ action: "delete_permanently", entity_type: "offering", entity_id: id, entity_title: item.title, old_data: item });
  return true;
}
