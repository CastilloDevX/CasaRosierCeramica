"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { FooterComponent, FooterStatus, Menu } from "@/lib/cms/types";
import MediaSelectField from "./MediaSelectField";

export default function FooterForm({ mode, item }: { mode: "create" | "edit"; item?: FooterComponent }) {
  const router = useRouter();
  const [name, setName] = useState(item?.name ?? "");
  const [status, setStatus] = useState(item?.status ?? "draft");
  const [logoId, setLogoId] = useState(item?.logo_id ?? "");
  const [contactEmail, setContactEmail] = useState(item?.contact_email ?? "");
  const [whatsapp, setWhatsapp] = useState(item?.whatsapp ?? "");
  const [address, setAddress] = useState(item?.address ?? "");
  const [legalText, setLegalText] = useState(item?.legal_text ?? "");
  const [socialLinks, setSocialLinks] = useState(item?.social_links ?? []);
  const [menuId, setMenuId] = useState(item?.menu_id ?? "");
  const [newsletterEnabled, setNewsletterEnabled] = useState(item?.newsletter_enabled ?? false);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { fetch("/api/admin/menus").then((r) => r.json()).then((d) => setMenus(d.menus ?? [])).catch(() => {}); }, []);

  function addSocial() { setSocialLinks([...socialLinks, { platform: "", url: "", label: "" }]); }
  function updateSocial(idx: number, field: string, value: string) { const c = [...socialLinks]; c[idx] = { ...c[idx], [field]: value }; setSocialLinks(c); }
  function removeSocial(idx: number) { setSocialLinks(socialLinks.filter((_, i) => i !== idx)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setIsLoading(true); setError(null);
    if (!name.trim()) { setError("El nombre es obligatorio."); setIsLoading(false); return; }
    const res = await fetch(mode === "create" ? "/api/admin/components/footers" : `/api/admin/components/footers/${item?.id}`, {
      method: mode === "create" ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, status, logo_id: logoId, contact_email: contactEmail, whatsapp, address, legal_text: legalText, social_links: socialLinks, menu_id: menuId || null, newsletter_enabled: newsletterEnabled }),
    });
    if (!res.ok) { const d = await res.json().catch(() => ({ error: "Error" })); setError((d as { error?: string }).error || "Error"); setIsLoading(false); return; }
    router.push("/admin/components/footers"); router.refresh();
  }

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      <section className="form-block">
        <h3>Información general</h3>
        <div className="grid-2">
          <label className="field span-2"><span>Nombre</span><input value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="field"><span>Estado</span><select value={status} onChange={(e) => setStatus(e.target.value as FooterStatus)}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
          <MediaSelectField label="Logo" value={logoId} onChange={(url) => setLogoId(url)} />
          <label className="field"><span>Email de contacto</span><input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} /></label>
          <label className="field"><span>WhatsApp</span><input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+34 600 000 000" /></label>
          <label className="field span-2"><span>Dirección</span><textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} /></label>
          <label className="field span-2"><span>Texto legal</span><textarea rows={3} value={legalText} onChange={(e) => setLegalText(e.target.value)} /></label>
          <label className="field"><span>Menú del footer</span><select value={menuId} onChange={(e) => setMenuId(e.target.value)}><option value="">Sin menú</option>{menus.filter((m) => m.status === "active").map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
          <label className="field checkbox-field"><input type="checkbox" checked={newsletterEnabled} onChange={(e) => setNewsletterEnabled(e.target.checked)} /><span>Newsletter habilitado</span></label>
        </div>
      </section>

      <section className="form-block">
        <div className="menu-editor-head"><h3>Redes sociales ({socialLinks.length})</h3><button type="button" className="primary-btn" onClick={addSocial}>Añadir red</button></div>
        {socialLinks.length === 0 ? <p className="muted">Aún no hay redes.</p> : socialLinks.map((sl, idx) => (
          <div key={idx} className="menu-item-form-wrap" style={{ marginBottom: "0.5rem" }}>
            <div className="grid-2">
              <label className="field"><span>Plataforma</span><input value={sl.platform} onChange={(e) => updateSocial(idx, "platform", e.target.value)} placeholder="Instagram" /></label>
              <label className="field"><span>URL</span><input value={sl.url} onChange={(e) => updateSocial(idx, "url", e.target.value)} /></label>
              <label className="field"><span>Etiqueta</span><input value={sl.label} onChange={(e) => updateSocial(idx, "label", e.target.value)} placeholder="@casarosier" /></label>
              <div style={{ display: "flex", alignItems: "end", paddingBottom: "0.45rem" }}><button type="button" className="danger-btn" onClick={() => removeSocial(idx)}>Eliminar</button></div>
            </div>
          </div>
        ))}
      </section>

      {error ? <p className="form-error">{error}</p> : null}
      <div className="form-actions"><button className="primary-btn" type="submit" disabled={isLoading}>{isLoading ? "Guardando..." : mode === "create" ? "Crear footer" : "Guardar cambios"}</button></div>
    </form>
  );
}
