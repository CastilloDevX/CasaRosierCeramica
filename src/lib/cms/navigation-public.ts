import { unstable_noStore as noStore } from "next/cache";
import type { NavigationItem } from "@/data/types";
import { experienceHref } from "@/lib/routes";
import { getMenuByLocation } from "./menus";
import { getOfferings } from "./offerings";
import type { MenuItem, Offering } from "./types";

type DynamicMenuKey = "classes" | "workshops" | "privateBookings" | "giftCards";

const dynamicMenuConfig: Record<DynamicMenuKey, {
  label: string;
  href: string;
  offeringType: Offering["type"];
  order: number;
}> = {
  classes: { label: "Clases", href: "/clases", offeringType: "class", order: 1 },
  workshops: { label: "Workshops", href: "/workshops", offeringType: "workshop", order: 2 },
  privateBookings: { label: "Reservas Privadas", href: "/reservas-privadas", offeringType: "experience", order: 3 },
  giftCards: { label: "Tarjeta de regalo", href: "/gift-card", offeringType: "gift_card", order: 4 },
};

const staticFallbackItems: NavigationItem[] = [
  ...Object.values(dynamicMenuConfig).map((item) => ({
    label: item.label,
    href: item.href,
    order: item.order,
    visible: true,
    children: [],
  })),
  { label: "El Estudio", href: "/el-estudio", order: 5, visible: true },
  { label: "Blog", href: "/blog", order: 6, visible: true },
];

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

function kindForOffering(type: Offering["type"]) {
  if (type === "workshop") return "workshop";
  if (type === "experience") return "private-booking";
  if (type === "gift_card") return "gift-card";
  return "class";
}

function normalizeLabel(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function dynamicKeyForItem(item: NavigationItem): DynamicMenuKey | null {
  const byHref = (Object.entries(dynamicMenuConfig) as [DynamicMenuKey, typeof dynamicMenuConfig[DynamicMenuKey]][])
    .find(([, config]) => item.href === config.href);
  if (byHref) return byHref[0];

  const label = normalizeLabel(item.label);
  if (label === "clases" || label === "classes") return "classes";
  if (label === "workshops") return "workshops";
  if (label === "reservas privadas" || label === "experiencias") return "privateBookings";
  if (label === "tarjeta de regalo" || label === "gift cards" || label === "giftcards") return "giftCards";
  return null;
}

function offeringToNavigationItem(offering: Offering, order: number): NavigationItem {
  return {
    label: offering.title,
    href: experienceHref(kindForOffering(offering.type), offering.slug),
    order,
    visible: true,
  };
}

async function getDynamicChildrenByKey() {
  const offerings = await getOfferings();
  const published = offerings
    .filter((offering) => offering.status === "published" && !offering.deleted_at && offering.slug)
    .sort((a, b) => a.title.localeCompare(b.title));

  return (Object.entries(dynamicMenuConfig) as [DynamicMenuKey, typeof dynamicMenuConfig[DynamicMenuKey]][])
    .reduce((acc, [key, config]) => {
      acc[key] = published
        .filter((offering) => offering.type === config.offeringType)
        .map(offeringToNavigationItem);
      return acc;
    }, {} as Record<DynamicMenuKey, NavigationItem[]>);
}

function withDynamicChildren(items: NavigationItem[], dynamicChildren: Record<DynamicMenuKey, NavigationItem[]>) {
  const seen = new Set<DynamicMenuKey>();
  const enhanced = items.map((item) => {
    const key = dynamicKeyForItem(item);
    if (!key) return item;
    seen.add(key);
    return {
      ...item,
      href: dynamicMenuConfig[key].href,
      children: dynamicChildren[key].length ? dynamicChildren[key] : item.children,
    };
  });

  for (const key of Object.keys(dynamicMenuConfig) as DynamicMenuKey[]) {
    if (seen.has(key)) continue;
    const config = dynamicMenuConfig[key];
    enhanced.push({
      label: config.label,
      href: config.href,
      order: config.order,
      visible: true,
      children: dynamicChildren[key],
    });
  }

  return enhanced.sort((a, b) => a.order - b.order);
}

export async function getPublicNavigationItems(location: "main" | "mobile" | "footer" = "main") {
  noStore();
  const dynamicChildren = location === "footer" ? null : await getDynamicChildrenByKey();
  const menu = await getMenuByLocation(location);
  if (!menu) return dynamicChildren ? withDynamicChildren(staticFallbackItems, dynamicChildren) : [];

  const childrenByParent = new Map<string, MenuItem[]>();
  for (const item of menu.items) {
    if (!item.parent_id) continue;
    const current = childrenByParent.get(item.parent_id) ?? [];
    current.push(item);
    childrenByParent.set(item.parent_id, current);
  }

  const items = menu.items
    .filter((item) => item.is_visible && !item.parent_id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => toNavigationItem(item, childrenByParent.get(item.id) ?? []));

  return dynamicChildren ? withDynamicChildren(items.length ? items : staticFallbackItems, dynamicChildren) : items;
}
