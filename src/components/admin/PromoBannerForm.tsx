"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PromoBanner, PromoStatus, PromoVisualVariant } from "@/lib/cms/types";
import { PROMO_VISUAL_VARIANTS } from "@/lib/cms/types";
import MediaSelectField from "./MediaSelectField";

const limits = {
  key_text: 40,
  title: 60,
  text: 140,
  detail_text: 130,
  button_text: 28,
};

export default function PromoBannerForm({ mode, item }: { mode: "create" | "edit"; item?: PromoBanner }) {
  const router = useRouter();
  const [form, setForm] = useState({
    key_text: item?.key_text ?? "",
    title: item?.title ?? "",
    text: item?.text ?? "",
    detail_text: item?.detail_text ?? "",
    image_url: item?.image_url ?? "",
    button_text: item?.button_text ?? "Reservar plaza",
    link_url: item?.link_url ?? "",
    start_date: item?.start_date ?? "",
    end_date: item?.end_date ?? "",
    status: item?.status ?? "draft",
    visual_variant: item?.visual_variant ?? "default",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  function upd<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    const max = limits[k as keyof typeof limits];
    setForm((p) => ({ ...p, [k]: typeof v === "string" && max ? v.slice(0, max) : v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setIsLoading(true); setError(null);
    if (!form.title.trim()) { setError("El título es obligatorio."); setIsLoading(false); return; }
    const res = await fetch(mode === "create" ? "/api/admin/components/promo-banners" : `/api/admin/components/promo-banners/${item?.id}`, {
      method: mode === "create" ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    if (!res.ok) { const d = await res.json().catch(() => ({ error: "Error" })); setError((d as { error?: string }).error || "Error"); setIsLoading(false); return; }
    router.push("/admin/components/promo-banners"); router.refresh();
  }

  return (
    <form className="editor-form preview-editor-form" onSubmit={handleSubmit}>
      <section className="form-block">
        <h3>Banner promocional</h3>
        <div className="grid-2">
          <MediaSelectField label="Imagen del modal" value={form.image_url} onChange={(url) => upd("image_url", url)} />
          <label className="field"><span>Texto clave</span><input maxLength={limits.key_text} value={form.key_text} onChange={(e) => upd("key_text", e.target.value)} /><small>{form.key_text.length}/{limits.key_text}</small></label>
          <label className="field span-2"><span>Título</span><input maxLength={limits.title} value={form.title} onChange={(e) => upd("title", e.target.value)} /><small>{form.title.length}/{limits.title}</small></label>
          <label className="field span-2"><span>Descripción general</span><textarea maxLength={limits.text} rows={3} value={form.text} onChange={(e) => upd("text", e.target.value)} /><small>{form.text.length}/{limits.text}</small></label>
          <label className="field span-2"><span>Descripción específica</span><textarea maxLength={limits.detail_text} rows={3} value={form.detail_text} onChange={(e) => upd("detail_text", e.target.value)} /><small>{form.detail_text.length}/{limits.detail_text}</small></label>
          <label className="field"><span>Texto del botón</span><input maxLength={limits.button_text} value={form.button_text} onChange={(e) => upd("button_text", e.target.value)} /><small>{form.button_text.length}/{limits.button_text}</small></label>
          <label className="field"><span>URL de redirección</span><input value={form.link_url} onChange={(e) => upd("link_url", e.target.value)} /></label>
          <label className="field"><span>Estado</span><select value={form.status} onChange={(e) => upd("status", e.target.value as PromoStatus)}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
          <label className="field"><span>Inicio</span><input type="date" value={form.start_date ? form.start_date.slice(0, 10) : ""} onChange={(e) => upd("start_date", e.target.value)} /></label>
          <label className="field"><span>Fin</span><input type="date" value={form.end_date ? form.end_date.slice(0, 10) : ""} onChange={(e) => upd("end_date", e.target.value)} /></label>
          <label className="field"><span>Variante visual</span><select value={form.visual_variant} onChange={(e) => upd("visual_variant", e.target.value as PromoVisualVariant)}>{PROMO_VISUAL_VARIANTS.map((v) => <option key={v} value={v}>{v}</option>)}</select></label>
        </div>
      </section>
      <aside className="form-preview-card promo-preview-card" aria-label="Vista previa del banner promocional">
        <p className="auth-kicker">{form.key_text || "Texto clave"}</p>
        <div className="promo-preview-card__image">
          {form.image_url ? <img src={form.image_url} alt={form.title || "Banner promocional"} /> : <span>Imagen del modal</span>}
        </div>
        <h3>{form.title || "Título del banner"}</h3>
        <p>{form.text || "Descripción general del modal promocional."}</p>
        <small>{form.detail_text || "Descripción específica o detalle importante."}</small>
        <span className="promo-preview-card__button">{form.button_text || "Texto del botón"}</span>
      </aside>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="form-actions"><button className="primary-btn" type="submit" disabled={isLoading}>{isLoading ? "Guardando..." : mode === "create" ? "Crear banner" : "Guardar cambios"}</button></div>
    </form>
  );
}
