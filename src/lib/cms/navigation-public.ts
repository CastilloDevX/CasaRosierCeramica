import type { NavigationItem } from "@/data/types";
import { getMenuByLocation } from "./menus";
import type { MenuItem } from "./types";

function hrefForItem(item: MenuItem) {
  return item.url || "/";
}

function toNavigationItem(item: MenuItem, children: MenuItem[]): NavigationItem {
  return {
    label: item.label,
    href: hrefForItem(item),
    order: item.sort_order,
    visible: item.is_visible,
    target: item.open_in_new_tab ? "_blank" : undefined,
    children: children
      .filter((child) => child.is_visible)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((child) => toNavigationItem(child, [])),
  };
}

export async function getPublicNavigationItems(location: "main" | "mobile" | "footer" = "main") {
  const menu = await getMenuByLocation(location);
  if (!menu) return [];

  const childrenByParent = new Map<string, MenuItem[]>();
  for (const item of menu.items) {
    if (!item.parent_id) continue;
    const current = childrenByParent.get(item.parent_id) ?? [];
    current.push(item);
    childrenByParent.set(item.parent_id, current);
  }

  return menu.items
    .filter((item) => item.is_visible && !item.parent_id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => toNavigationItem(item, childrenByParent.get(item.id) ?? []));
}
