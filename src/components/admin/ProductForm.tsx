"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { Product, ProductCategory } from "@/lib/cms/types";
import MediaSelectField from "./MediaSelectField";

export default function ProductForm({ mode, item }: { mode: "create" | "edit"; item?: Product }) {
  const router = useRouter();
  const [name, setName] = useState(item?.name ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [sku, setSku] = useState(item?.sku ?? "");
  const [status, setStatus] = useState(item?.status ?? "draft");
  const [description, setDescription] = useState(item?.description ?? "");
  const [excerpt, setExcerpt] = useState(item?.excerpt ?? "");
  const [mainImageId, setMainImageId] = useState(item?.main_image_id ?? "");
  const [gallery, setGallery] = useState<string[]>(item?.gallery ?? []);
  const [price, setPrice] = useState<number | null>(item?.price ?? null);
  const [comparePrice, setComparePrice] = useState<number | null>(item?.compare_at_price ?? null);
  const [stock, setStock] = useState<number | null>(item?.stock ?? null);
  const [lowStockThreshold, setLowStockThreshold] = useState(item?.low_stock_threshold ?? 5);
  const [categoryId, setCategoryId] = useState(item?.category_id ?? "");
  const [characteristics, setCharacteristics] = useState(item?.characteristics ?? "");
  const [weight, setWeight] = useState(item?.weight ?? "");
  const [dimensions, setDimensions] = useState(item?.dimensions ?? "");
  const [seoTitle, setSeoTitle] = useState(item?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(item?.seo_description ?? "");
  const [seoImage, setSeoImage] = useState(item?.seo_image ?? "");
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [galleryInput, setGalleryInput] = useState(gallery.join("\n"));

  useEffect(() => { fetch("/api/admin/shop/categories").then((r) => r.json()).then((d) => setCategories(d.categories ?? [])).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setIsLoading(true); setError(null);
    if (!name.trim()) { setError("El nombre es obligatorio."); setIsLoading(false); return; }
    const res = await fetch(mode === "create" ? "/api/admin/shop/products" : `/api/admin/shop/products/${item?.id}`, {
      method: mode === "create" ? "POST" : "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, sku, status, description, excerpt, main_image_id: mainImageId, gallery: galleryInput.split("\n").map((s) => s.trim()).filter(Boolean), price, compare_at_price: comparePrice, stock, low_stock_threshold: lowStockThreshold, category_id: categoryId, characteristics, weight, dimensions, seo_title: seoTitle, seo_description: seoDescription, seo_image: seoImage }),
    });
    if (!res.ok) { const d = await res.json().catch(() => ({ error: "Error" })); setError((d as { error?: string }).error || "Error"); setIsLoading(false); return; }
    router.push("/admin/shop/products"); router.refresh();
  }

  return (
    <div className="header-form-layout">
      <div className="menu-form-main">
        <form className="editor-form" onSubmit={handleSubmit}>
          <section className="form-block"><h3>Información general</h3>
            <div className="grid-2">
              <label className="field span-2"><span>Nombre</span><input value={name} onChange={(e) => setName(e.target.value)} /></label>
              <label className="field"><span>Slug</span><input value={slug} onChange={(e) => setSlug(e.target.value)} /></label>
              <label className="field"><span>SKU</span><input value={sku} onChange={(e) => setSku(e.target.value)} /></label>
              <label className="field"><span>Estado</span><select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
              <label className="field"><span>Categoría</span><select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}><option value="">Sin categoría</option>{categories.filter((c) => c.status !== "deleted").map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
              <MediaSelectField label="Imagen principal" value={mainImageId} onChange={setMainImageId} />
            </div>
          </section>

          <section className="form-block"><h3>Descripción</h3>
            <div className="grid-2">
              <label className="field span-2"><span>Extracto</span><textarea rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} /></label>
              <label className="field span-2"><span>Descripción</span><textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
              <label className="field span-2"><span>Galería (una URL por línea)</span><textarea rows={4} value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)} /></label>
            </div>
          </section>

          <section className="form-block"><h3>Precio y stock</h3>
            <div className="grid-2">
              <label className="field"><span>Precio</span><input type="number" step="0.01" value={price ?? ""} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : null)} /></label>
              <label className="field"><span>Precio anterior</span><input type="number" step="0.01" value={comparePrice ?? ""} onChange={(e) => setComparePrice(e.target.value ? Number(e.target.value) : null)} /></label>
              <label className="field"><span>Stock</span><input type="number" value={stock ?? ""} onChange={(e) => setStock(e.target.value ? Number(e.target.value) : null)} /></label>
              <label className="field"><span>Stock mínimo</span><input type="number" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(Number(e.target.value))} /></label>
            </div>
          </section>

          <section className="form-block"><h3>Características</h3>
            <div className="grid-2">
              <label className="field span-2"><span>Características</span><textarea rows={4} value={characteristics} onChange={(e) => setCharacteristics(e.target.value)} /></label>
              <label className="field"><span>Peso</span><input value={weight} onChange={(e) => setWeight(e.target.value)} /></label>
              <label className="field"><span>Dimensiones</span><input value={dimensions} onChange={(e) => setDimensions(e.target.value)} /></label>
            </div>
          </section>

          <section className="form-block"><h3>SEO</h3>
            <div className="grid-2">
              <label className="field span-2"><span>SEO title</span><input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /></label>
              <label className="field span-2"><span>SEO description</span><textarea rows={3} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} /></label>
              <MediaSelectField label="SEO image" value={seoImage} onChange={setSeoImage} />
            </div>
          </section>

          {error ? <p className="form-error">{error}</p> : null}
          <div className="form-actions"><button className="primary-btn" type="submit" disabled={isLoading}>{isLoading ? "Guardando..." : mode === "create" ? "Crear producto" : "Guardar cambios"}</button></div>
        </form>
      </div>

      <aside className="menu-preview-sidebar">
        <h3>Preview</h3>
        <div className="menu-preview-box">
          {mainImageId ? <div style={{ height: "80px", background: "var(--bg2)", borderRadius: "4px", marginBottom: "0.5rem" }} /> : null}
          <h4 style={{ margin: "0 0 0.3rem" }}>{name || "Sin nombre"}</h4>
          {price !== null ? <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>{price} €{comparePrice ? <span style={{ textDecoration: "line-through", color: "var(--muted)", marginLeft: "0.5rem", fontWeight: 400, fontSize: "0.9rem" }}>{comparePrice} €</span> : null}</p> : null}
          {stock !== null ? <p className="muted" style={{ fontSize: "0.85rem" }}>Stock: {stock}</p> : null}
          {excerpt ? <hr style={{ margin: "0.5rem 0", border: "none", borderTop: "1px solid var(--line)" }} /> : null}
          {excerpt ? <p className="muted" style={{ fontSize: "0.85rem" }}>{excerpt}</p> : null}
        </div>
      </aside>
    </div>
  );
}
