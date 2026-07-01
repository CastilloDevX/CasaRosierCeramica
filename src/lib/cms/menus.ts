import { randomUUID } from "crypto";
import { createAdminClient } from "../supabase/admin";
import { addTrashItem, getCurrentUserEmail, getTrashItemByEntity, removeTrashItem } from "./trash";
import { readJsonFile, writeJsonFile } from "./local-storage";
import { isMenuLocation, isMenuStatus, isMenuItemType, isLinkedEntityType } from "./types";
import type { Menu, MenuItem, MenuLocation, MenuStatus, MenuItemType, LinkedEntityType } from "./types";
import { logAction } from "./history-logs";

const FILE_NAME = "menus.json";

type MenuInput = Partial<Omit<Menu, "id" | "created_at" | "updated_at" | "deleted_at" | "items">> & {
  id?: string;
  deleted_at?: string | null;
};

type MenuItemInput = Partial<Omit<MenuItem, "id" | "created_at" | "updated_at">> & {
  id?: string;
};

function normalizeMenu(input: MenuInput, existing?: Menu, allMenus: Menu[] = []) {
  const name = String(input.name ?? existing?.name ?? "").trim();
  const location = input.location ?? existing?.location;
  const status = input.status ?? existing?.status ?? "draft";
  const now = new Date().toISOString();

  if (!name) throw new Error("El nombre del menú es obligatorio.");
  if (!isMenuLocation(location)) throw new Error("Ubicación de menú no válida.");
  if (!isMenuStatus(status)) throw new Error("Estado de menú no válido.");

  if (status === "active" && location !== existing?.location) {
    const dup = allMenus.find((m) => m.location === location && m.status === "active" && m.id !== existing?.id);
    if (dup) throw new Error(`Ya existe un menú activo en la ubicación "${location}".`);
  }

  return {
    id: existing?.id ?? input.id ?? randomUUID(),
    name,
    location,
    status,
    items: existing?.items ?? [],
    created_at: existing?.created_at ?? now,
    updated_at: now,
    deleted_at: input.status === "deleted" ? existing?.deleted_at ?? now : null,
  } satisfies Menu;
}

function normalizeMenuItem(input: MenuItemInput, existing?: MenuItem) {
  const label = String(input.label ?? existing?.label ?? "").trim();
  const type = input.type ?? existing?.type;
  const now = new Date().toISOString();

  if (!label) throw new Error("La etiqueta del item es obligatoria.");
  if (!isMenuItemType(type)) throw new Error("Tipo de item no válido.");

  return {
    id: existing?.id ?? input.id ?? randomUUID(),
    label,
    type,
    url: String(input.url ?? existing?.url ?? "").trim(),
    linked_entity_type: isLinkedEntityType(input.linked_entity_type) ? input.linked_entity_type : (existing?.linked_entity_type ?? "none"),
    linked_entity_id: String(input.linked_entity_id ?? existing?.linked_entity_id ?? "").trim(),
    parent_id: input.parent_id !== undefined ? input.parent_id : (existing?.parent_id ?? null),
    sort_order: input.sort_order ?? existing?.sort_order ?? 0,
    is_visible: input.is_visible !== undefined ? input.is_visible : (existing?.is_visible ?? true),
    open_in_new_tab: input.open_in_new_tab !== undefined ? input.open_in_new_tab : (existing?.open_in_new_tab ?? false),
    created_at: existing?.created_at ?? now,
    updated_at: now,
  } satisfies MenuItem;
}

function stripMenuId(item: Record<string, unknown>): MenuItem {
  const { menu_id, ...rest } = item;
  return rest as unknown as MenuItem;
}

async function readMenusFromSupabase(): Promise<Menu[] | null> {
  try {
    const supabase = createAdminClient();
    const { data: menus, error: menuError } = await supabase.from("menus").select("*");
    if (menuError) throw menuError;
    if (!menus || menus.length === 0) return null;
    const { data: items, error: itemError } = await supabase.from("menu_items").select("*").order("sort_order");
    if (itemError) throw itemError;
    const byMenu: Record<string, MenuItem[]> = {};
    if (items) {
      for (const row of items as Array<Record<string, unknown>>) {
        const mid = row.menu_id as string;
        if (!byMenu[mid]) byMenu[mid] = [];
        byMenu[mid].push(stripMenuId(row));
      }
    }
    return (menus as Array<Record<string, unknown>>).map((row) => ({
      ...row,
      items: byMenu[row.id as string] ?? [],
    })) as Menu[];
  } catch {
    return null;
  }
}

async function upsertMenu(menu: Menu): Promise<void> {
  try {
    const supabase = createAdminClient();
    const { items, ...data } = menu;
    await supabase.from("menus").upsert(data as unknown as Record<string, unknown>, { onConflict: "id" });
  } catch { /* best-effort */ }
}

async function deleteMenuFromDb(id: string): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from("menus").delete().eq("id", id);
  } catch { /* best-effort */ }
}

async function upsertMenuItem(menuId: string, item: MenuItem): Promise<void> {
  try {
    const supabase = createAdminClient();
    const record: Record<string, unknown> = { ...item as unknown as Record<string, unknown>, menu_id: menuId };
    await supabase.from("menu_items").upsert(record, { onConflict: "id" });
  } catch { /* best-effort */ }
}

async function deleteMenuItemFromDb(itemId: string): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from("menu_items").delete().eq("parent_id", itemId);
    await supabase.from("menu_items").delete().eq("id", itemId);
  } catch { /* best-effort */ }
}

export async function getMenus() {
  const fromSupabase = await readMenusFromSupabase();
  if (fromSupabase) return fromSupabase;
  return readJsonFile<Menu[]>(FILE_NAME, []);
}

export async function getMenuById(id: string) {
  try {
    const supabase = createAdminClient();
    const { data: menu, error: me } = await supabase.from("menus").select("*").eq("id", id).maybeSingle();
    if (!me && menu) {
      const { data: items, error: ie } = await supabase.from("menu_items").select("*").eq("menu_id", id).order("sort_order");
      if (!ie) {
        return { ...(menu as Record<string, unknown>), items: (items ?? []).map(stripMenuId) } as Menu;
      }
    }
  } catch { /* fall through */ }
  const menus = await readJsonFile<Menu[]>(FILE_NAME, []);
  return menus.find((m) => m.id === id) ?? null;
}

export async function getMenuByLocation(location: MenuLocation) {
  try {
    const supabase = createAdminClient();
    const { data: menu, error: me } = await supabase.from("menus").select("*").eq("location", location).eq("status", "active").maybeSingle();
    if (!me && menu) {
      const { data: items, error: ie } = await supabase.from("menu_items").select("*").eq("menu_id", menu.id).order("sort_order");
      if (!ie) {
        return { ...(menu as Record<string, unknown>), items: (items ?? []).map(stripMenuId) } as Menu;
      }
    }
  } catch { /* fall through */ }
  const menus = await readJsonFile<Menu[]>(FILE_NAME, []);
  return menus.find((m) => m.location === location && m.status === "active") ?? null;
}

export async function createMenu(data: MenuInput) {
  const menus = await readJsonFile<Menu[]>(FILE_NAME, []);
  const next = normalizeMenu(data, undefined, menus);
  await writeJsonFile(FILE_NAME, [next, ...menus]);
  await upsertMenu(next);
  await logAction({ action: "create", entity_type: "menu", entity_id: next.id, entity_title: next.name, new_data: next });
  return next;
}

export async function updateMenu(id: string, data: MenuInput) {
  const menus = await readJsonFile<Menu[]>(FILE_NAME, []);
  const index = menus.findIndex((m) => m.id === id);
  if (index === -1) return null;
  const old = menus[index];
  const next = normalizeMenu(data, old, menus);
  menus[index] = next;
  await writeJsonFile(FILE_NAME, menus);
  await upsertMenu(next);
  if (old.status !== next.status) {
    if (next.status === "active") await logAction({ action: "publish", entity_type: "menu", entity_id: next.id, entity_title: next.name, old_data: old, new_data: next });
    else if (old.status === "active") await logAction({ action: "unpublish", entity_type: "menu", entity_id: next.id, entity_title: next.name, old_data: old, new_data: next });
  }
  await logAction({ action: "update", entity_type: "menu", entity_id: next.id, entity_title: next.name, old_data: old, new_data: next });
  return next;
}

export async function duplicateMenu(id: string) {
  const menus = await readJsonFile<Menu[]>(FILE_NAME, []);
  const original = menus.find((m) => m.id === id);
  if (!original) return null;
  const copy = normalizeMenu(
    { name: `${original.name} (copia)`, location: original.location, status: "draft" },
    undefined,
    menus,
  );
  copy.items = original.items.map((item) => normalizeMenuItem({ ...item, label: item.label }));
  await writeJsonFile(FILE_NAME, [copy, ...menus]);
  await upsertMenu(copy);
  for (const item of copy.items) {
    await upsertMenuItem(copy.id, item);
  }
  await logAction({ action: "duplicate", entity_type: "menu", entity_id: original.id, entity_title: original.name, new_data: copy });
  return copy;
}

export async function moveMenuToTrash(id: string, deletedBy?: string) {
  const dBy = deletedBy ?? await getCurrentUserEmail();
  const menus = await readJsonFile<Menu[]>(FILE_NAME, []);
  const index = menus.findIndex((m) => m.id === id);
  if (index === -1) return null;
  const current = menus[index];
  const deletedAt = new Date().toISOString();
  const trashed: Menu = { ...current, status: "deleted", deleted_at: deletedAt, updated_at: deletedAt };
  menus[index] = trashed;
  await writeJsonFile(FILE_NAME, menus);
  await upsertMenu(trashed);
  await addTrashItem({
    id: randomUUID(), entity_type: "menu", entity_id: current.id, title: current.name,
    deleted_by: dBy, deleted_at: deletedAt, restore_data: current,
  });
  await logAction({ action: "trash", entity_type: "menu", entity_id: current.id, entity_title: current.name, old_data: current, user_email: dBy });
  return trashed;
}

export async function restoreMenu(id: string) {
  const menus = await readJsonFile<Menu[]>(FILE_NAME, []);
  const index = menus.findIndex((m) => m.id === id);
  const trashItem = await getTrashItemByEntity(id);
  if (index === -1 && !trashItem) return null;
  const restored = trashItem?.restore_data && typeof trashItem.restore_data === "object"
    ? ({ ...(trashItem.restore_data as Menu), status: "draft", deleted_at: null, updated_at: new Date().toISOString() } as Menu)
    : ({ ...menus[index], status: "draft", deleted_at: null, updated_at: new Date().toISOString() } as Menu);
  if (index === -1) {
    const all = await readJsonFile<Menu[]>(FILE_NAME, []);
    all.unshift(restored);
    await writeJsonFile(FILE_NAME, all);
  } else {
    menus[index] = restored;
    await writeJsonFile(FILE_NAME, menus);
  }
  await upsertMenu(restored);
  if (trashItem) await removeTrashItem(trashItem.id);
  await logAction({ action: "restore", entity_type: "menu", entity_id: restored.id, entity_title: restored.name });
  return restored;
}

export async function deleteMenuPermanently(id: string) {
  const menus = await readJsonFile<Menu[]>(FILE_NAME, []);
  const item = menus.find((m) => m.id === id);
  const next = menus.filter((m) => m.id !== id);
  if (next.length === menus.length) return false;
  await writeJsonFile(FILE_NAME, next);
  await deleteMenuFromDb(id);
  const trashItem = await getTrashItemByEntity(id);
  if (trashItem) await removeTrashItem(trashItem.id);
  if (item) await logAction({ action: "delete_permanently", entity_type: "menu", entity_id: id, entity_title: item.name, old_data: item });
  return true;
}

export async function addMenuItem(menuId: string, data: MenuItemInput) {
  const menus = await readJsonFile<Menu[]>(FILE_NAME, []);
  const index = menus.findIndex((m) => m.id === menuId);
  if (index === -1) return null;
  const item = normalizeMenuItem(data);
  menus[index] = { ...menus[index], items: [...menus[index].items, item], updated_at: new Date().toISOString() };
  await writeJsonFile(FILE_NAME, menus);
  await upsertMenuItem(menuId, item);
  return item;
}

export async function updateMenuItem(menuId: string, itemId: string, data: MenuItemInput) {
  const menus = await readJsonFile<Menu[]>(FILE_NAME, []);
  const menuIndex = menus.findIndex((m) => m.id === menuId);
  if (menuIndex === -1) return null;
  const itemIndex = menus[menuIndex].items.findIndex((i) => i.id === itemId);
  if (itemIndex === -1) return null;
  const updated = normalizeMenuItem(data, menus[menuIndex].items[itemIndex]);
  const items = [...menus[menuIndex].items];
  items[itemIndex] = updated;
  menus[menuIndex] = { ...menus[menuIndex], items, updated_at: new Date().toISOString() };
  await writeJsonFile(FILE_NAME, menus);
  await upsertMenuItem(menuId, updated);
  return updated;
}

export async function deleteMenuItem(menuId: string, itemId: string) {
  const menus = await readJsonFile<Menu[]>(FILE_NAME, []);
  const menuIndex = menus.findIndex((m) => m.id === menuId);
  if (menuIndex === -1) return false;
  const originalLength = menus[menuIndex].items.length;
  menus[menuIndex] = {
    ...menus[menuIndex],
    items: menus[menuIndex].items.filter((i) => i.id !== itemId && i.parent_id !== itemId),
    updated_at: new Date().toISOString(),
  };
  if (menus[menuIndex].items.length === originalLength) return false;
  await writeJsonFile(FILE_NAME, menus);
  await deleteMenuItemFromDb(itemId);
  return true;
}

export async function reorderMenuItems(menuId: string, orderedItemIds: string[]) {
  const menus = await readJsonFile<Menu[]>(FILE_NAME, []);
  const menuIndex = menus.findIndex((m) => m.id === menuId);
  if (menuIndex === -1) return null;
  const itemMap = new Map(menus[menuIndex].items.map((i) => [i.id, i]));
  const reordered: MenuItem[] = [];
  for (const id of orderedItemIds) {
    const item = itemMap.get(id);
    if (item) {
      reordered.push({ ...item, sort_order: reordered.length });
      itemMap.delete(id);
    }
  }
  for (const item of itemMap.values()) {
    reordered.push({ ...item, sort_order: reordered.length });
  }
  menus[menuIndex] = { ...menus[menuIndex], items: reordered, updated_at: new Date().toISOString() };
  await writeJsonFile(FILE_NAME, menus);
  try {
    const supabase = createAdminClient();
    for (const item of reordered) {
      await supabase.from("menu_items").update({ sort_order: item.sort_order }).eq("id", item.id).eq("menu_id", menuId);
    }
  } catch { /* best-effort */ }
  return reordered;
}

export async function toggleMenuItemVisibility(menuId: string, itemId: string) {
  const menus = await readJsonFile<Menu[]>(FILE_NAME, []);
  const menuIndex = menus.findIndex((m) => m.id === menuId);
  if (menuIndex === -1) return null;
  const itemIndex = menus[menuIndex].items.findIndex((i) => i.id === itemId);
  if (itemIndex === -1) return null;
  const items = [...menus[menuIndex].items];
  items[itemIndex] = { ...items[itemIndex], is_visible: !items[itemIndex].is_visible, updated_at: new Date().toISOString() };
  menus[menuIndex] = { ...menus[menuIndex], items, updated_at: new Date().toISOString() };
  await writeJsonFile(FILE_NAME, menus);
  try {
    const supabase = createAdminClient();
    await supabase.from("menu_items").update({ is_visible: items[itemIndex].is_visible }).eq("id", itemId).eq("menu_id", menuId);
  } catch { /* best-effort */ }
  return items[itemIndex];
}
