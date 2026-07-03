"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Testimonial, TestimonialStatus } from "@/lib/cms/types";
import MediaSelectField from "./MediaSelectField";

type Toast = { type: "success" | "error" | "info"; message: string };

export default function TestimonialForm({ mode, item }: { mode: "create" | "edit"; item?: Testimonial }) {
  const router = useRouter();
  const [name, setName] = useState(item?.name ?? "");
  const [role, setRole] = useState(item?.role ?? "");
  const [text, setText] = useState(item?.text ?? "");
  const [avatarId, setAvatarId] = useState(item?.avatar_id ?? "");
  const [status, setStatus] = useState(item?.status ?? "draft");
  const [sortOrder, setSortOrder] = useState(item?.sort_order ?? 0);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setIsLoading(true); setToast(null);
    if (!name.trim()) { setToast({ type: "error", message: "El nombre es obligatorio." }); setIsLoading(false); return; }
    try {
      const res = await fetch(mode === "create" ? "/api/admin/components/testimonials" : `/api/admin/components/testimonials/${item?.id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, text, avatar_id: avatarId, status, sort_order: sortOrder, is_featured: false }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({ error: "No se pudo guardar el testimonio." }));
        setToast({ type: "error", message: (d as { error?: string }).error || "No se pudo guardar el testimonio." });
        return;
      }
      setToast({ type: "success", message: mode === "create" ? "Testimonio creado correctamente." : "Testimonio guardado correctamente." });
      router.refresh();
      if (mode === "create") router.push("/admin/components/testimonials");
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
        <h3>Información del testimonio</h3>
        <div className="grid-2">
          <label className="field span-2"><span>Nombre</span><input value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="field span-2"><span>Rol o contexto</span><input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Alumna de cerámica" /></label>
          <label className="field span-2"><span>Texto</span><textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} maxLength={260} /><small>{text.length}/260</small></label>
          <MediaSelectField label="Avatar" value={avatarId} onChange={setAvatarId} className="span-2 testimonial-avatar-field" />
          <label className="field"><span>Estado</span><select value={status} onChange={(e) => setStatus(e.target.value as TestimonialStatus)}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
          <label className="field"><span>Orden</span><input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></label>
        </div>
      </section>
      <aside className="form-preview-card testimonial-preview-card" aria-label="Vista previa del testimonio">
        <p className="auth-kicker">Vista previa</p>
        <div className="testimonial-preview-card__avatar">
          {avatarId ? <img src={avatarId} alt={name || "Avatar"} /> : <span>{(name || "T").slice(0, 1).toUpperCase()}</span>}
        </div>
        <blockquote>{text || "El texto del testimonio aparecerá aquí."}</blockquote>
        <strong>{name || "Nombre de la persona"}</strong>
        <span>{role || "Rol o contexto"}</span>
      </aside>
      <div className="form-actions"><button className="primary-btn" type="submit" disabled={isLoading}>{isLoading ? "Guardando..." : mode === "create" ? "Crear testimonio" : "Guardar cambios"}</button></div>
    </form>
  );
}
