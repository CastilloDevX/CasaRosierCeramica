"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import MediaSelectField from "./MediaSelectField";
import type { SiteSettings } from "@/lib/cms/settings";
import type { LinkedEntityType, Menu, MenuItem, MenuItemType } from "@/lib/cms/types";

type EditableMenuItem = {
  id?: string;
  key: string;
  label: string;
  url: string;
  sort_order: number;
  type: MenuItemType;
  linked_entity_type: LinkedEntityType;
  linked_entity_id: string;
  is_visible: boolean;
  open_in_new_tab: boolean;
  locked?: boolean;
  children: EditableMenuChild[];
};

type EditableMenuChild = Omit<EditableMenuItem, "children" | "locked"> & {
  parent_id?: string | null;
};

type BulkMenuItemsResponse = { items?: MenuItem[]; error?: string };

const DEFAULT_POINTS: EditableMenuItem[] = [
  menuPoint("inicio", "Inicio", "/#hero", 0, { locked: true }),
  menuPoint("clases", "Clases", "/clases", 1),
  menuPoint("workshops", "Workshops", "/workshops", 2),
  menuPoint("experiencias", "Experiencias", "/experiencias", 3),
  menuPoint("giftcards", "GiftCards", "/gift-cards", 4),
  menuPoint("estudio", "El estudio", "/el-estudio", 5, {
    children: [
      menuChild("estudio-el-estudio", "El Estudio", "/el-estudio", 0),
      menuChild("estudio-bitacora", "Bitácora", "/blog", 1),
    ],
  }),
  menuPoint("shop", "Shop", "/shop", 6),
];

function menuPoint(
  key: string,
  label: string,
  url: string,
  sortOrder: number,
  options: Partial<Pick<EditableMenuItem, "locked" | "children">> = {},
): EditableMenuItem {
  return {
    key,
    label,
    url,
    sort_order: sortOrder,
    type: "internal",
    linked_entity_type: "none",
    linked_entity_id: "",
    is_visible: true,
    open_in_new_tab: false,
    locked: options.locked,
    children: options.children ?? [],
  };
}

function menuChild(key: string, label: string, url: string, sortOrder: number): EditableMenuChild {
  return {
    key,
    label,
    url,
    sort_order: sortOrder,
    type: "internal",
    linked_entity_type: "none",
    linked_entity_id: "",
    is_visible: true,
    open_in_new_tab: false,
  };
}

function normalizeLabel(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function keyForItem(item: Pick<MenuItem, "label" | "url">) {
  const label = normalizeLabel(item.label);
  if (["/#hero", "/", "/home"].includes(item.url) || label === "inicio") return "inicio";
  if (item.url === "/clases" || label === "clases") return "clases";
  if (item.url === "/workshops" || label === "workshops") return "workshops";
  if (item.url === "/experiencias" || item.url === "/reservas-privadas" || label === "experiencias" || label === "reservas privadas") return "experiencias";
  if (item.url === "/gift-cards" || item.url === "/gift-card" || label === "gift cards" || label === "giftcards" || label.includes("regalo")) return "giftcards";
  if (item.url === "/el-estudio" || label === "el estudio") return "estudio";
  if (item.url === "/shop" || (item.url === "/blog" && (label === "blog" || label === "bitacora")) || label === "shop") return "shop";
  return `item-${item.url || label}`;
}

function itemToEditable(item: MenuItem, children: MenuItem[]): EditableMenuItem {
  const key = keyForItem(item);
  const defaultPoint = DEFAULT_POINTS.find((point) => point.key === key);
  const normalizedChildren = children
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((child) => ({
      id: child.id,
      key: child.id,
      label: child.label,
      url: child.url,
      sort_order: child.sort_order,
      type: child.type,
      linked_entity_type: child.linked_entity_type,
      linked_entity_id: child.linked_entity_id,
      is_visible: child.is_visible,
      open_in_new_tab: child.open_in_new_tab,
      parent_id: child.parent_id,
    }));

  return {
    id: item.id,
    key,
    label: key === "experiencias" && normalizeLabel(item.label) === "reservas privadas"
      ? "Experiencias"
      : key === "giftcards" && item.label.toLowerCase().includes("regalo")
        ? "GiftCards"
        : key === "shop"
          ? "Shop"
          : item.label,
    url: key === "shop" ? "/shop" : (defaultPoint?.url ?? item.url),
    sort_order: defaultPoint?.sort_order ?? item.sort_order,
    type: item.type,
    linked_entity_type: item.linked_entity_type,
    linked_entity_id: item.linked_entity_id,
    is_visible: key === "inicio" ? true : item.is_visible,
    open_in_new_tab: item.open_in_new_tab,
    locked: key === "inicio",
    children: normalizedChildren.length ? normalizedChildren : (defaultPoint?.children ?? []),
  };
}

function buildEditableMenu(menu: Menu | null): EditableMenuItem[] {
  if (!menu?.items.length) return DEFAULT_POINTS;

  const childrenByParent = new Map<string, MenuItem[]>();
  for (const item of menu.items) {
    if (!item.parent_id) continue;
    const children = childrenByParent.get(item.parent_id) ?? [];
    children.push(item);
    childrenByParent.set(item.parent_id, children);
  }

  const roots = menu.items
    .filter((item) => !item.parent_id && item.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => itemToEditable(item, childrenByParent.get(item.id) ?? []));

  const byKey = new Map(roots.map((item) => [item.key, item]));
  const merged = DEFAULT_POINTS.map((defaultPoint) => ({
    ...defaultPoint,
    ...(byKey.get(defaultPoint.key) ?? {}),
    children: byKey.get(defaultPoint.key)?.children?.length ? byKey.get(defaultPoint.key)!.children : defaultPoint.children,
  }));

  const extras = roots.filter((item) => !DEFAULT_POINTS.some((point) => point.key === item.key));
  return [...merged, ...extras].sort((a, b) => a.sort_order - b.sort_order);
}

function payloadFor(item: EditableMenuItem | EditableMenuChild, parentId: string | null) {
  return {
    label: item.label.trim(),
    type: item.type,
    url: item.url,
    linked_entity_type: item.linked_entity_type,
    linked_entity_id: item.linked_entity_id,
    parent_id: parentId,
    sort_order: item.sort_order,
    is_visible: item.key === "inicio" ? true : item.is_visible,
    open_in_new_tab: item.open_in_new_tab,
  };
}

function extensionFromUrl(url: string) {
  try {
    const path = new URL(url, window.location.origin).pathname;
    return path.split(".").pop()?.toLowerCase() ?? "";
  } catch {
    return url.split("?")[0]?.split(".").pop()?.toLowerCase() ?? "";
  }
}

function logoTintHint(extension: string) {
  if (!extension) return "No se pudo detectar la extensión; se intentará aplicar como máscara.";
  if (extension === "svg") return "SVG detectado: se puede teñir de forma estable.";
  if (extension === "png") return "PNG detectado: funciona mejor si el archivo tiene transparencia.";
  if (extension === "jpg" || extension === "jpeg") return "JPG/JPEG detectado: si trae fondo sólido, el tinte puede cubrir el rectángulo completo.";
  return "Formato no verificado: el tinte se aplicará solo si el navegador puede usarlo como máscara.";
}

function InteractiveMenuPreview({
  items,
  logoUrl,
  backgroundColor,
  textColor,
  iconColor,
  logoTintEnabled,
  logoTintColor,
}: {
  items: EditableMenuItem[];
  logoUrl: string;
  backgroundColor: string;
  textColor: string;
  iconColor: string;
  logoTintEnabled: boolean;
  logoTintColor: string;
}) {
  const visibleItems = items.filter((item) => item.is_visible);
  const tintStyle = {
    WebkitMaskImage: `url("${logoUrl.replace(/"/g, "%22")}")`,
    maskImage: `url("${logoUrl.replace(/"/g, "%22")}")`,
    backgroundColor: logoTintColor,
  } as CSSProperties;

  return (
    <div className="interactive-menu-preview" aria-label="Vista previa del menú interactivo">
      <div className="interactive-menu-preview__bar" style={{ backgroundColor }}>
        <div className="interactive-menu-preview__logo">
          {logoTintEnabled ? (
            <span className="interactive-menu-preview__logo-tint" style={tintStyle} aria-hidden="true" />
          ) : (
            <img src={logoUrl} alt="Casa Rosier" />
          )}
        </div>
        <nav className="interactive-menu-preview__nav" aria-label="Vista previa navegación">
          {visibleItems.map((item, index) => (
            <span className="interactive-menu-preview__item" key={item.key} style={{ color: textColor }}>
              <span>{item.label || "Sin nombre"}</span>
              {item.children.length ? <span className="interactive-menu-preview__plus" style={{ color: iconColor }}>+</span> : null}
              {index < visibleItems.length - 1 ? <span className="interactive-menu-preview__separator" aria-hidden="true">|</span> : null}
            </span>
          ))}
        </nav>
        <span className="interactive-menu-preview__mobile-icon" style={{ color: iconColor }} aria-hidden="true">
          <span />
        </span>
      </div>
    </div>
  );
}

export default function PublicMenuEditor({
  initialMenu,
  initialSettings,
}: {
  initialMenu: Menu | null;
  initialSettings: SiteSettings;
}) {
  const [items, setItems] = useState(() => buildEditableMenu(initialMenu));
  const [logoUrl, setLogoUrl] = useState(initialSettings.menu.header_logo_url);
  const [scrollBackgroundColor, setScrollBackgroundColor] = useState(initialSettings.menu.scroll_menu_background_color);
  const [scrollTextColor, setScrollTextColor] = useState(initialSettings.menu.scroll_menu_text_color);
  const [scrollIconColor, setScrollIconColor] = useState(initialSettings.menu.scroll_menu_icon_color);
  const [scrollLogoTintEnabled, setScrollLogoTintEnabled] = useState(initialSettings.menu.scroll_menu_logo_tint_enabled);
  const [scrollLogoTintColor, setScrollLogoTintColor] = useState(initialSettings.menu.scroll_menu_logo_tint_color);
  const [openKey, setOpenKey] = useState(items[0]?.key ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSave = Boolean(initialMenu?.id) && !isSaving;
  const saveLabel = isSaving ? "Guardando..." : "Guardar menú";
  const logoExtension = extensionFromUrl(logoUrl);

  function updateItem(key: string, patch: Partial<EditableMenuItem>) {
    setItems((current) => current.map((item) => item.key === key ? { ...item, ...patch } : item));
  }

  function updateChild(parentKey: string, childKey: string, patch: Partial<EditableMenuChild>) {
    setItems((current) => current.map((item) => {
      if (item.key !== parentKey) return item;
      return {
        ...item,
        children: item.children.map((child) => child.key === childKey ? { ...child, ...patch } : child),
      };
    }));
  }

  async function handleSave() {
    if (!initialMenu?.id) {
      setError("No hay un menú principal activo para guardar.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const settingsRequest = fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menu: {
            header_logo_url: logoUrl,
            scroll_menu_background_color: scrollBackgroundColor,
            scroll_menu_text_color: scrollTextColor,
            scroll_menu_icon_color: scrollIconColor,
            scroll_menu_logo_tint_enabled: scrollLogoTintEnabled,
            scroll_menu_logo_tint_color: scrollLogoTintColor,
          },
        }),
      });

      const menuRequest = fetch(`/api/admin/menus/${initialMenu.id}/items/bulk`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item, index) => ({
            id: item.id,
            ...payloadFor({ ...item, sort_order: index }, null),
            children: item.children.map((child, childIndex) => ({
              id: child.id,
              ...payloadFor({ ...child, sort_order: childIndex }, item.id ?? null),
            })),
          })),
        }),
      });

      const [settingsResponse, menuResponse] = await Promise.all([settingsRequest, menuRequest]);
      const [settingsData, menuData] = await Promise.all([
        settingsResponse.json().catch(() => ({})) as Promise<{ error?: string }>,
        menuResponse.json().catch(() => ({})) as Promise<BulkMenuItemsResponse>,
      ]);
      if (!settingsResponse.ok) throw new Error(settingsData.error || "No se pudo guardar el logo.");
      if (!menuResponse.ok || !menuData.items) throw new Error(menuData.error || "No se pudo guardar el menú.");

      const savedRoots = menuData.items
        .filter((item) => !item.parent_id)
        .sort((a, b) => a.sort_order - b.sort_order);
      const savedChildrenByParent = new Map<string, MenuItem[]>();
      for (const item of menuData.items.filter((savedItem) => savedItem.parent_id)) {
        const list = savedChildrenByParent.get(item.parent_id ?? "") ?? [];
        list.push(item);
        savedChildrenByParent.set(item.parent_id ?? "", list);
      }

      const savedItems = items.map((item, index) => {
        const savedRoot = savedRoots[index];
        const savedChildren = savedRoot
          ? (savedChildrenByParent.get(savedRoot.id) ?? []).sort((a, b) => a.sort_order - b.sort_order)
          : [];
        return {
          ...item,
          id: savedRoot?.id ?? item.id,
          sort_order: index,
          children: item.children.map((child, childIndex) => ({
            ...child,
            id: savedChildren[childIndex]?.id ?? child.id,
            parent_id: savedRoot?.id ?? child.parent_id,
            sort_order: childIndex,
          })),
        };
      });
      setItems(savedItems);
      setMessage("Menú guardado correctamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el menú.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="public-menu-editor">
      <div className="section-head public-menu-editor__head">
        <div>
          <p className="auth-kicker">CMS</p>
          <h2>Menú</h2>
        </div>
        <button type="button" className="primary-btn inline" disabled={!canSave} onClick={() => void handleSave()}>
          {saveLabel}
        </button>
      </div>

      {message ? <p className="success-message">{message}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      <div className="public-menu-editor__panel">
        <div className="public-menu-list" aria-label="Puntos del menú">
          {items.map((item) => {
            const isOpen = openKey === item.key;
            return (
              <div className="public-menu-card" key={item.key}>
                <button
                  type="button"
                  className="public-menu-card__summary"
                  aria-expanded={isOpen}
                  onClick={() => setOpenKey(isOpen ? "" : item.key)}
                >
                  <span>
                    <strong>{item.label || "Sin nombre"}</strong>
                    <small>{item.children.length ? `${item.children.length} subopciones` : "Sin despliegue"}</small>
                  </span>
                  <span className="public-menu-card__chevron">{isOpen ? "Cerrar" : "Editar"}</span>
                </button>

                {isOpen ? (
                  <div className="public-menu-card__body">
                    <label className="field">
                      <span>Nombre visible</span>
                      <input
                        value={item.label}
                        onChange={(event) => updateItem(item.key, { label: event.target.value })}
                      />
                    </label>
                    <label className="field">
                      <span>Destino</span>
                      <input value={item.url} disabled />
                    </label>
                    {item.locked ? <p className="public-menu-card__note">Inicio permanece fijo en el menú.</p> : null}

                    {item.children.length ? (
                      <div className="public-menu-card__children">
                        <p>Despliegue</p>
                        {item.children.map((child) => (
                          <div className="public-menu-child" key={child.key}>
                            <label className="field">
                              <span>Nombre</span>
                              <input
                                value={child.label}
                                onChange={(event) => updateChild(item.key, child.key, { label: event.target.value })}
                              />
                            </label>
                            <label className="field">
                              <span>Destino</span>
                              <input value={child.url} disabled />
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="settings-section">
          <div className="section-head compact">
            <div>
              <p className="auth-kicker">Logo</p>
              <h3>Logo de la página</h3>
            </div>
          </div>
          <MediaSelectField label="Logo del encabezado" value={logoUrl} onChange={setLogoUrl} />
        </div>

        <div className="settings-section">
          <div className="section-head compact">
            <div>
              <p className="auth-kicker">Menú interactivo</p>
              <h3>Menú fijo al bajar</h3>
              <p className="muted">Aparece al bajar la página para mantener la navegación visible.</p>
            </div>
          </div>
          <div className="scroll-menu-color-grid">
            <label className="field">
              <span>Fondo</span>
              <input
                type="color"
                value={scrollBackgroundColor}
                onChange={(event) => setScrollBackgroundColor(event.target.value)}
              />
            </label>
            <label className="field">
              <span>Texto</span>
              <input
                type="color"
                value={scrollTextColor}
                onChange={(event) => setScrollTextColor(event.target.value)}
              />
            </label>
            <label className="field">
              <span>Icono</span>
              <input
                type="color"
                value={scrollIconColor}
                onChange={(event) => setScrollIconColor(event.target.value)}
              />
            </label>
            <label className="field">
              <span>Logo del menú fijo</span>
              <input
                type="color"
                value={scrollLogoTintColor}
                onChange={(event) => setScrollLogoTintColor(event.target.value)}
              />
            </label>
          </div>
          <label className="checkbox-field scroll-logo-tint-toggle">
            <input
              type="checkbox"
              checked={scrollLogoTintEnabled}
              onChange={(event) => setScrollLogoTintEnabled(event.target.checked)}
            />
            <span>Aplicar color al logo del menú fijo</span>
          </label>
          <p className="public-menu-card__note">{logoTintHint(logoExtension)}</p>

          <InteractiveMenuPreview
            items={items}
            logoUrl={logoUrl}
            backgroundColor={scrollBackgroundColor}
            textColor={scrollTextColor}
            iconColor={scrollIconColor}
            logoTintEnabled={scrollLogoTintEnabled}
            logoTintColor={scrollLogoTintColor}
          />
        </div>
      </div>

      <button
        type="button"
        className="public-menu-editor__fixed-save primary-btn"
        disabled={!canSave}
        onClick={() => void handleSave()}
      >
        {saveLabel}
      </button>
    </div>
  );
}
