"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PromoBanner, PromoStatus } from "@/lib/cms/types";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import MediaSelectField from "./MediaSelectField";
import RichTextField from "./RichTextField";

const limits = {
  key_text: 40,
  title: 60,
  text: 600,
  detail_text: 600,
  button_text: 28,
};
const promoRichTextControls = ["bold", "italic", "ul", "ol", "link"] as const;
type Toast = { type: "success" | "error"; message: string };

function getErrorMessage(data: unknown, fallback: string) {
  if (data && typeof data === "object" && "error" in data && typeof data.error === "string" && data.error.trim()) {
    return data.error;
  }
  return fallback;
}

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
  const [toast, setToast] = useState<Toast | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function upd<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    const max = limits[k as keyof typeof limits];
    setForm((p) => ({ ...p, [k]: typeof v === "string" && max ? v.slice(0, max) : v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setToast(null);

    if (!form.title.trim()) {
      setToast({ type: "error", message: "El título es obligatorio." });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(mode === "create" ? "/api/admin/components/promo-banners" : `/api/admin/components/promo-banners/${item?.id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "No se pudo guardar el banner promocional." }));
        setToast({ type: "error", message: getErrorMessage(data, "No se pudo guardar el banner promocional.") });
        return;
      }

      setToast({ type: "success", message: mode === "create" ? "Banner promocional creado correctamente." : "Banner promocional guardado correctamente." });
      router.refresh();
      router.push("/admin/components/promo-banners");
    } catch {
      setToast({ type: "error", message: "No se pudo conectar con el servidor. Intenta nuevamente." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="editor-form preview-editor-form" onSubmit={handleSubmit}>
      {toast ? (
        <div
          className={`admin-toast admin-toast--${toast.type}`}
          role={toast.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {toast.message}
        </div>
      ) : null}

      <section className="form-block">
        <h3>Banner promocional</h3>
        <div className="promo-banner-form-grid">
          <div className="promo-banner-form-grid__media">
            <MediaSelectField label="Imagen del modal" value={form.image_url} onChange={(url) => upd("image_url", url)} />
            <label className="field"><span>Texto clave</span><input maxLength={limits.key_text} value={form.key_text} onChange={(e) => upd("key_text", e.target.value)} /><small>{form.key_text.length}/{limits.key_text}</small></label>
          </div>
          <div className="promo-banner-form-grid__main">
            <label className="field"><span>Título</span><input maxLength={limits.title} value={form.title} onChange={(e) => upd("title", e.target.value)} /><small>{form.title.length}/{limits.title}</small></label>
            <div className="promo-banner-form-grid__rich-field">
              <RichTextField label="Descripción general" value={form.text} onChange={(value) => upd("text", value)} minHeight="168px" maxLength={limits.text} controls={[...promoRichTextControls]} />
              <small>{form.text.length}/{limits.text}</small>
            </div>
          </div>
          <div className="promo-banner-form-grid__detail promo-banner-form-grid__rich-field">
            <RichTextField label="Descripción específica" value={form.detail_text} onChange={(value) => upd("detail_text", value)} minHeight="150px" maxLength={limits.detail_text} controls={[...promoRichTextControls]} />
            <small>{form.detail_text.length}/{limits.detail_text}</small>
          </div>
          <div className="promo-banner-form-grid__meta">
            <label className="field"><span>Texto del botón</span><input maxLength={limits.button_text} value={form.button_text} onChange={(e) => upd("button_text", e.target.value)} /><small>{form.button_text.length}/{limits.button_text}</small></label>
            <label className="field"><span>URL de redirección</span><input value={form.link_url} onChange={(e) => upd("link_url", e.target.value)} /></label>
            <label className="field"><span>Estado</span><select value={form.status} onChange={(e) => upd("status", e.target.value as PromoStatus)}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
            <label className="field"><span>Inicio</span><input type="date" value={form.start_date ? form.start_date.slice(0, 10) : ""} onChange={(e) => upd("start_date", e.target.value)} /></label>
            <label className="field"><span>Fin</span><input type="date" value={form.end_date ? form.end_date.slice(0, 10) : ""} onChange={(e) => upd("end_date", e.target.value)} /></label>
          </div>
        </div>
      </section>
      <aside className="form-preview-card promo-preview-card" aria-label="Vista previa del banner promocional">
        <p className="auth-kicker">{form.key_text || "Texto clave"}</p>
        <div className="promo-preview-card__image">
          {form.image_url ? <img src={form.image_url} alt={form.title || "Banner promocional"} /> : <span>Imagen del modal</span>}
        </div>
        <h3>{form.title || "Título del banner"}</h3>
        <MarkdownContent className="promo-preview-card__copy" source={form.text || "Descripción general del modal promocional."} />
        <MarkdownContent className="promo-preview-card__detail" source={form.detail_text || "Descripción específica o detalle importante."} />
        <span className="promo-preview-card__button">{form.button_text || "Texto del botón"}</span>
      </aside>
      <div className="form-actions"><button className="primary-btn" type="submit" disabled={isLoading}>{isLoading ? "Guardando..." : mode === "create" ? "Crear banner" : "Guardar cambios"}</button></div>
    </form>
  );
}
