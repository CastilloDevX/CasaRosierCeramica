import type { Offering, Product } from "./types";

const DEMO_TEXT_PATTERNS = [
  "un texto por aca",
  "un dia de komercio",
  "pepa pig",
];

const DEMO_SLUG_PATTERNS = ["demo-editor-completo", "qa_fix_"];

function normalized(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function hasDemoText(...values: Array<string | null | undefined>) {
  const text = normalized(values.filter(Boolean).join(" "));
  return DEMO_TEXT_PATTERNS.some((pattern) => text.includes(pattern));
}

function hasDemoSlug(slug: string) {
  const value = normalized(slug);
  return DEMO_SLUG_PATTERNS.some((pattern) => value.includes(pattern));
}

export function isPublicOfferingVisible(offering: Offering) {
  return (
    offering.status === "published" &&
    !offering.deleted_at &&
    Boolean(offering.slug)
  );
}

export function isPublicProductVisible(product: Product) {
  return (
    product.status === "published" &&
    product.deleted_at === null &&
    Boolean(product.slug) &&
    !hasDemoSlug(product.slug) &&
    !hasDemoText(product.name)
  );
}

export function sanitizePublicText(value: string) {
  const lines = value.split(/\r?\n/).filter((line) => {
    const cleanLine = normalized(line.replace(/[#*_`>~-]/g, " "));
    return !DEMO_TEXT_PATTERNS.some((pattern) => cleanLine.includes(pattern));
  });
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function publicOfferingLabel(offering: Offering) {
  const title = offering.title.trim();
  const normalizedTitle = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  if (offering.type === "gift_card" && normalizedTitle.startsWith("clase tarjeta")) {
    return normalizedTitle.includes("copia") ? "Gift card Casa Rosier (copia)" : "Gift card Casa Rosier";
  }
  return title;
}
