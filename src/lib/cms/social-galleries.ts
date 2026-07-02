import { randomUUID } from "crypto";
import { createAdminClient } from "../supabase/admin";
import { getTrashItemByEntity, removeTrashItem } from "./trash";
import { readJsonFile, writeJsonFile } from "./local-storage";
import type { SocialGallery, SocialGalleryItem } from "./types";
import { logAction } from "./history-logs";

const FILE_NAME = "social-galleries.json";
const SINGLE_GALLERY_SLUG = "galeria-social";
const DEFAULT_GALLERY_ID = "4a18f60a-5c43-4bfb-b8f9-2e967f6bd5d1";

function getDefaultSocialGallery(): SocialGallery {
  return {
    id: DEFAULT_GALLERY_ID,
    name: "Galeria social principal",
    slug: SINGLE_GALLERY_SLUG,
    status: "published",
    title: "Y tu, cuando tuviste\ntu ultima idea?",
    description: "siguenos en instagram - @casarosier",
    cta_text: "",
    cta_url: "",
    items: [
      {
        id: "social-gallery-item-1",
        image_id: "",
        image_url: "/img/social-1.jpg",
        title: "Serie en proceso",
        description: "Pieza en estudio: pruebas de forma, secado y acabados de superficie.",
        instagram_url: "",
        sort_order: 0,
        is_visible: true,
        created_at: "2026-06-30T00:00:00.000Z",
        updated_at: "2026-06-30T00:00:00.000Z",
      },
      {
        id: "social-gallery-item-2",
        image_id: "",
        image_url: "/img/social-2.jpg",
        title: "Materia y ritmo",
        description: "Una mirada al proceso cotidiano dentro del taller.",
        instagram_url: "",
        sort_order: 1,
        is_visible: true,
        created_at: "2026-06-30T00:01:00.000Z",
        updated_at: "2026-06-30T00:01:00.000Z",
      },
      {
        id: "social-gallery-item-3",
        image_id: "",
        image_url: "/img/social-3.jpg",
        title: "Color y superficie",
        description: "Pruebas de esmaltes, capas y pequenas decisiones de acabado.",
        instagram_url: "",
        sort_order: 2,
        is_visible: true,
        created_at: "2026-06-30T00:02:00.000Z",
        updated_at: "2026-06-30T00:02:00.000Z",
      },
      {
        id: "social-gallery-item-4",
        image_id: "",
        image_url: "/img/social-4.jpeg",
        title: "El taller por dentro",
        description: "Herramientas, piezas y momentos de trabajo compartido.",
        instagram_url: "",
        sort_order: 3,
        is_visible: true,
        created_at: "2026-06-30T00:03:00.000Z",
        updated_at: "2026-06-30T00:03:00.000Z",
      },
    ],
    created_at: "2026-06-30T00:00:00.000Z",
    updated_at: "2026-06-30T00:00:00.000Z",
    deleted_at: null,
  };
}

type Input = Partial<Omit<SocialGallery, "id" | "created_at" | "updated_at" | "deleted_at" | "items">> & {
  id?: string; deleted_at?: string | null; items?: SocialGalleryItem[];
};

function toSlug(v: string) { return v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-"); }

function uniqueSlug(items: SocialGallery[], base: string, currentId?: string) {
  const taken = new Set(items.filter((i) => i.id !== currentId).map((i) => i.slug));
  if (!taken.has(base)) return base; let c = 2; while (taken.has(`${base}-${c}`)) c++; return `${base}-${c}`;
}

function normalize(input: Input, existing?: SocialGallery, all: SocialGallery[] = []) {
  const name = String(input.name ?? existing?.name ?? "Galeria social principal").trim();
  const slugBase = String(input.slug ?? existing?.slug ?? SINGLE_GALLERY_SLUG).trim() || SINGLE_GALLERY_SLUG;
  const slug = uniqueSlug(all, slugBase || toSlug(name), existing?.id);
  const now = new Date().toISOString();
  const status = "published";
  const galleryItems = (input.items ?? existing?.items ?? []).map((item, index) => ({
    ...item,
    is_visible: true,
    sort_order: index,
  }));
  if (!name) throw new Error("El nombre es obligatorio.");
  return { id: existing?.id ?? input.id ?? randomUUID(), name, slug, status, title: String(input.title ?? existing?.title ?? "").trim(), description: String(input.description ?? existing?.description ?? "").trim(), cta_text: "", cta_url: "", items: galleryItems, created_at: existing?.created_at ?? now, updated_at: now, deleted_at: null } satisfies SocialGallery;
}

function mapDbItemToTs(item: Record<string, unknown>): SocialGalleryItem {
  const { social_gallery_id, platform, url, ...rest } = item;
  return { ...rest, instagram_url: (url as string) ?? "" } as SocialGalleryItem;
}

function mapTsItemToDb(galleryId: string, item: SocialGalleryItem): Record<string, unknown> {
  const { instagram_url, ...rest } = item;
  return { ...rest, is_visible: true, social_gallery_id: galleryId, url: instagram_url, platform: "instagram" };
}

async function readAllFromSupabase(): Promise<SocialGallery[] | null> {
  try {
    const supabase = createAdminClient();
    const { data: galleries, error: ge } = await supabase.from("social_galleries").select("*");
    if (ge) throw ge;
    if (!galleries || galleries.length === 0) return null;
    const { data: items, error: ie } = await supabase.from("social_gallery_items").select("*").order("sort_order");
    if (ie) throw ie;
    const byGallery: Record<string, SocialGalleryItem[]> = {};
    if (items) {
      for (const row of items as Array<Record<string, unknown>>) {
        const gid = row.social_gallery_id as string;
        if (!byGallery[gid]) byGallery[gid] = [];
        byGallery[gid].push(mapDbItemToTs(row));
      }
    }
    return (galleries as Array<Record<string, unknown>>).map((row) => ({
      ...row,
      items: byGallery[row.id as string] ?? [],
    })) as SocialGallery[];
  } catch {
    return null;
  }
}

async function upsertGallery(gallery: SocialGallery): Promise<void> {
  try {
    const supabase = createAdminClient();
    const { items, ...data } = gallery;
    await supabase.from("social_galleries").upsert(data as unknown as Record<string, unknown>, { onConflict: "id" });
  } catch { /* best-effort */ }
}

async function deleteGalleryFromDb(id: string): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from("social_galleries").delete().eq("id", id);
  } catch { /* best-effort */ }
}

async function replaceGalleryItems(galleryId: string, items: SocialGalleryItem[]): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from("social_gallery_items").delete().eq("social_gallery_id", galleryId);
    if (items.length > 0) {
      await supabase.from("social_gallery_items").insert(items.map((item) => mapTsItemToDb(galleryId, item)));
    }
  } catch { /* best-effort */ }
}

async function seedSupabase(items: SocialGallery[]): Promise<void> {
  if (items.length === 0) return;
  for (const gallery of items) {
    await upsertGallery(gallery);
    await replaceGalleryItems(gallery.id, gallery.items);
  }
}

export async function getSocialGalleries() {
  const fromSupabase = await readAllFromSupabase();
  if (fromSupabase?.some((gallery) => gallery.items.length > 0)) {
    return fromSupabase.map((gallery) => ({ ...gallery, status: "published" as const, deleted_at: null }));
  }
  const localGalleries = await readJsonFile<SocialGallery[]>(FILE_NAME, []);
  const items = localGalleries.length > 0 ? localGalleries : [getDefaultSocialGallery()];
  await writeJsonFile(FILE_NAME, items);
  await seedSupabase(items);
  return items.map((gallery) => ({ ...gallery, status: "published" as const, deleted_at: null }));
}

export async function getSocialGalleryById(id: string) {
  try {
    const supabase = createAdminClient();
    const { data: gallery, error: ge } = await supabase.from("social_galleries").select("*").eq("id", id).maybeSingle();
    if (!ge && gallery) {
      const { data: items, error: ie } = await supabase.from("social_gallery_items").select("*").eq("social_gallery_id", id).order("sort_order");
      if (!ie) {
        return { ...(gallery as Record<string, unknown>), status: "published" as const, deleted_at: null, items: (items ?? []).map(mapDbItemToTs) } as SocialGallery;
      }
    }
  } catch { /* fall through */ }
  const all = await readJsonFile<SocialGallery[]>(FILE_NAME, []);
  const localGallery = all.find((x) => x.id === id) ?? null;
  if (localGallery) await seedSupabase([localGallery]);
  return localGallery ? { ...localGallery, status: "published" as const, deleted_at: null } : localGallery;
}

export async function createSocialGallery(data: Input) {
  const all = await readJsonFile<SocialGallery[]>(FILE_NAME, []);
  const existing = all.find((item) => !item.deleted_at && item.status !== "deleted");
  if (existing) {
    return updateSocialGallery(existing.id, data);
  }
  const next = normalize(data, undefined, all);
  await writeJsonFile(FILE_NAME, [next, ...all]);
  await upsertGallery(next);
  await replaceGalleryItems(next.id, next.items);
  await logAction({ action: "create", entity_type: "social_gallery", entity_id: next.id, entity_title: next.name, new_data: next });
  return next;
}

export async function updateSocialGallery(id: string, data: Input) {
  const all = await readJsonFile<SocialGallery[]>(FILE_NAME, []);
  const idx = all.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  const old = all[idx];
  const next = normalize(data, old, all);
  all[idx] = next;
  await writeJsonFile(FILE_NAME, all);
  await upsertGallery(next);
  await replaceGalleryItems(next.id, next.items);
  await logAction({ action: "update", entity_type: "social_gallery", entity_id: next.id, entity_title: next.name, old_data: old, new_data: next });
  return next;
}

export async function duplicateSocialGallery(id: string) {
  void id;
  return null;
}

export async function moveSocialGalleryToTrash(id: string, deletedBy?: string) {
  void id;
  void deletedBy;
  return null;
}

export async function restoreSocialGallery(id: string) {
  const all = await readJsonFile<SocialGallery[]>(FILE_NAME, []);
  const idx = all.findIndex((x) => x.id === id);
  const ti = await getTrashItemByEntity(id);
  if (idx === -1 && !ti) return null;
  const r = ti?.restore_data && typeof ti.restore_data === "object"
    ? { ...(ti.restore_data as SocialGallery), status: "published" as const, deleted_at: null, updated_at: new Date().toISOString() }
    : { ...all[idx], status: "published" as const, deleted_at: null, updated_at: new Date().toISOString() };
  if (idx === -1) { const a = await readJsonFile<SocialGallery[]>(FILE_NAME, []); a.unshift(r); await writeJsonFile(FILE_NAME, a); }
  else { all[idx] = r; await writeJsonFile(FILE_NAME, all); }
  await upsertGallery(r);
  if (ti) await removeTrashItem(ti.id);
  await logAction({ action: "restore", entity_type: "social_gallery", entity_id: r.id, entity_title: r.name });
  return r;
}

export async function deleteSocialGalleryPermanently(id: string) {
  const all = await readJsonFile<SocialGallery[]>(FILE_NAME, []);
  const item = all.find((x) => x.id === id);
  const next = all.filter((x) => x.id !== id);
  if (next.length === all.length) return false;
  await writeJsonFile(FILE_NAME, next);
  await deleteGalleryFromDb(id);
  const ti = await getTrashItemByEntity(id);
  if (ti) await removeTrashItem(ti.id);
  if (item) await logAction({ action: "delete_permanently", entity_type: "social_gallery", entity_id: id, entity_title: item.name, old_data: item });
  return true;
}

export async function addSocialGalleryItem(galleryId: string, item: SocialGalleryItem) {
  const all = await readJsonFile<SocialGallery[]>(FILE_NAME, []);
  const idx = all.findIndex((x) => x.id === galleryId);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const entry: SocialGalleryItem = { ...item, id: item.id || randomUUID(), sort_order: 0, is_visible: true, created_at: now, updated_at: now };
  all[idx].items = [entry, ...all[idx].items].map((galleryItem, order) => ({ ...galleryItem, sort_order: order, updated_at: galleryItem.id === entry.id ? now : galleryItem.updated_at }));
  all[idx].updated_at = new Date().toISOString();
  await writeJsonFile(FILE_NAME, all);
  await replaceGalleryItems(galleryId, all[idx].items);
  return entry;
}

export async function removeSocialGalleryItem(galleryId: string, itemId: string) {
  const all = await readJsonFile<SocialGallery[]>(FILE_NAME, []);
  const idx = all.findIndex((x) => x.id === galleryId);
  if (idx === -1) return false;
  all[idx].items = all[idx].items.filter((i) => i.id !== itemId);
  all[idx].updated_at = new Date().toISOString();
  await writeJsonFile(FILE_NAME, all);
  try {
    const supabase = createAdminClient();
    await supabase.from("social_gallery_items").delete().eq("id", itemId).eq("social_gallery_id", galleryId);
  } catch { /* best-effort */ }
  return true;
}

export async function reorderSocialGalleryItems(galleryId: string, orderedIds: string[]) {
  const all = await readJsonFile<SocialGallery[]>(FILE_NAME, []);
  const idx = all.findIndex((x) => x.id === galleryId);
  if (idx === -1) return null;
  const map = new Map(all[idx].items.map((i) => [i.id, i]));
  all[idx].items = orderedIds.map((id, order) => { const item = map.get(id); return item ? { ...item, sort_order: order, updated_at: new Date().toISOString() } : null; }).filter(Boolean) as SocialGalleryItem[];
  all[idx].updated_at = new Date().toISOString();
  await writeJsonFile(FILE_NAME, all);
  try {
    const supabase = createAdminClient();
    for (const item of all[idx].items) {
      await supabase.from("social_gallery_items").update({ sort_order: item.sort_order }).eq("id", item.id).eq("social_gallery_id", galleryId);
    }
  } catch { /* best-effort */ }
  return all[idx].items;
}
