"use client";

import { useState } from "react";
import Link from "@/components/admin/AdminLink";
import { ShopGrid } from "@/components/shop/ShopGrid";
import type { NavigationItem, ShopCategory, ShopItem } from "@/data/types";
import { normalizeHeroSettings } from "@/lib/cms/hero-settings";
import type { Product, ProductCategory, ShopPageSettings, CmsHeroSettings } from "@/lib/cms/types";
import type { SiteSettings } from "@/lib/cms/settings";
import AdminActionModal from "./AdminActionModal";
import CmsPublicHeroPreview from "./CmsPublicHeroPreview";
import ProductsTable from "./ProductsTable";
import SharedHeroEditor from "./SharedHeroEditor";

type TabKey = "hero" | "items" | "preview";
type ModalState = { type: "success" | "error"; title: string; message?: string } | null;

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "hero", label: "Hero" },
  { key: "items", label: "Articulos" },
  { key: "preview", label: "Vista previa" },
];

export default function ShopPageEditor({
  page,
  products,
  categories,
  published,
  shopCategories,
  navigationItems,
  menuSettings,
}: {
  page: ShopPageSettings;
  products: Product[];
  categories: ProductCategory[];
  published: ShopItem[];
  shopCategories: ShopCategory[];
  navigationItems: NavigationItem[];
  menuSettings: SiteSettings["menu"];
}) {
  const [tab, setTab] = useState<TabKey>("hero");
  const [status, setStatus] = useState(page.status);
  const [hero, setHero] = useState(() => normalizeHeroSettings(page.hero, {
    heroTitle: "Shop",
    heroSubtitle: "Casa Rosier",
  }));
  const [showCharacteristicsInPreview, setShowCharacteristicsInPreview] = useState(page.showCharacteristicsInPreview);
  const [previewCharacteristicLabels, setPreviewCharacteristicLabels] = useState(page.previewCharacteristicLabels.join("\n"));
  const [seoTitle] = useState(page.seo_title);
  const [seoDescription] = useState(page.seo_description);
  const [seoImage] = useState(page.seo_image);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  async function save(nextStatus = status) {
    setIsLoading(true);
    setModal(null);
    const response = await fetch("/api/admin/shop-page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: nextStatus,
        hero,
        showCharacteristicsInPreview,
        previewCharacteristicLabels: previewCharacteristicLabels.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean),
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_image: seoImage,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({})) as { error?: string };
      setModal({ type: "error", title: "No se pudo guardar", message: data.error || "Intenta de nuevo." });
      setIsLoading(false);
      return;
    }

    setStatus(nextStatus);
    setModal({ type: "success", title: nextStatus === "published" ? "Shop publicado" : "Borrador guardado", message: "La configuracion de Shop se guardo correctamente." });
    setIsLoading(false);
  }

  return (
    <div className="cms-editor-shell">
      <AdminActionModal open={Boolean(modal)} type={modal?.type} title={modal?.title ?? ""} message={modal?.message} confirmLabel="Entendido" onClose={() => setModal(null)} />

      <header className="cms-page-editor-head">
        <div className="cms-page-editor-head__main">
          <h1>Shop</h1>
          <p>Edicion de pagina publica y catalogo</p>
          <div className="cms-page-editor-meta">
            <span className={`status-pill status-pill--${status}`}>{status}</span>
            <span>{published.length} articulos publicados</span>
            <span>{categories.length} categorias</span>
            <span>{showCharacteristicsInPreview ? "Caracteristicas visibles" : "Caracteristicas ocultas"}</span>
          </div>
        </div>
        <div className="cms-page-editor-actions">
          <Link className="secondary-btn" href="/admin/dashboard">Volver</Link>
          <button type="button" className="secondary-btn cms-outline-accent" onClick={() => save("draft")} disabled={isLoading}>{isLoading ? "Guardando..." : "Borrador"}</button>
          <button type="button" className="primary-btn" onClick={() => save("published")} disabled={isLoading}>{isLoading ? "Publicando..." : "Publicar"}</button>
        </div>
      </header>

      <nav className="cms-editor-tabs" aria-label="Secciones del editor de Shop">
        {tabs.map((item) => (
          <button type="button" key={item.key} className={tab === item.key ? "is-active" : ""} onClick={() => setTab(item.key)}>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="cms-editor-main">
        {tab === "hero" ? (
          <div className="cms-studio-additions">
            <SharedHeroEditor
              details={hero}
              titleFallback="Shop"
              subtitleFallback="Casa Rosier"
              onChange={(next) => setHero((current) => ({ ...current, ...next }))}
            />
            <section className="form-block cms-editor-card">
              <h3>Vista previa de articulos</h3>
              <label className="field checkbox-field">
                <input type="checkbox" checked={showCharacteristicsInPreview} onChange={(event) => setShowCharacteristicsInPreview(event.target.checked)} />
                <span>Mostrar caracteristicas en vista previa</span>
              </label>
              <label className="field">
                <span>Caracteristicas visibles</span>
                <textarea rows={4} value={previewCharacteristicLabels} onChange={(event) => setPreviewCharacteristicLabels(event.target.value)} />
              </label>
            </section>
          </div>
        ) : null}

        {tab === "items" ? (
          <section className="form-block cms-editor-card">
            <div className="cms-editor-card__head">
              <div>
                <p className="auth-kicker">Catalogo</p>
                <h3>Articulos</h3>
              </div>
              <Link className="primary-btn" href="/admin/shop/products/new">Nuevo articulo</Link>
            </div>
            {products.length ? <ProductsTable items={products} categories={categories} /> : <p className="muted">No hay articulos todavia.</p>}
          </section>
        ) : null}

        {tab === "preview" ? (
          <ShopPagePreview hero={hero} published={published} shopCategories={shopCategories} navigationItems={navigationItems} menuSettings={menuSettings} />
        ) : null}
      </div>

      <div className="admin-sticky-actionbar">
        <span className="admin-sticky-actionbar__meta">{published.length} articulos publicados · {categories.length} categorias</span>
        <button type="button" className="secondary-btn" onClick={() => setTab("preview")}>Vista previa</button>
        <button type="button" className="secondary-btn" onClick={() => save("draft")} disabled={isLoading}>{isLoading ? "Guardando..." : "Borrador"}</button>
        <button type="button" className="primary-btn" onClick={() => save("published")} disabled={isLoading}>{isLoading ? "Publicando..." : "Publicar"}</button>
      </div>
    </div>
  );
}

function ShopHeroPreviewContent({ hero }: { hero: CmsHeroSettings }) {
  return (
    <div>
      <p className="page-hero__eyebrow">{hero.heroSubtitle || "Casa Rosier"}</p>
      <h1 className="page-hero__title">{hero.heroTitle || "Shop"}</h1>
    </div>
  );
}

function ShopPagePreview({
  hero,
  published,
  shopCategories,
  navigationItems,
  menuSettings,
}: {
  hero: CmsHeroSettings;
  published: ShopItem[];
  shopCategories: ShopCategory[];
  navigationItems: NavigationItem[];
  menuSettings: SiteSettings["menu"];
}) {
  return (
    <div className="cms-preview-frame">
      <div className="cms-public-preview__toolbar">Vista previa de escritorio · Publicado</div>
      <div className="cms-public-preview shop-page">
        <div className="cms-public-preview__scale">
          <CmsPublicHeroPreview hero={hero} navigationItems={navigationItems} menuSettings={menuSettings} height="medium">
            <ShopHeroPreviewContent hero={hero} />
          </CmsPublicHeroPreview>
          <ShopGrid published={published} shopCategories={shopCategories} />
        </div>
      </div>
    </div>
  );
}
