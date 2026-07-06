"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FooterComponent, FooterStatus, SocialLink } from "@/lib/cms/types";
import AdminActionModal from "./AdminActionModal";
import MediaSelectField from "./MediaSelectField";

export default function FooterForm({
  mode,
  item,
  singleton = false,
}: {
  mode: "create" | "edit";
  item?: FooterComponent;
  singleton?: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(item?.name ?? "Footer principal");
  const [status, setStatus] = useState<FooterStatus>(item?.status ?? "published");
  const [logoId] = useState(item?.logo_id ?? "");
  const [contactEmail] = useState(item?.contact_email ?? "");
  const [whatsapp] = useState(item?.whatsapp ?? "");
  const [address] = useState(item?.address ?? "");
  const [legalText] = useState(item?.legal_text ?? "");
  const [contactTitle, setContactTitle] = useState(item?.contact_title ?? "Contacto");
  const [contactText, setContactText] = useState(item?.contact_text ?? "+34 600 000 000\nBarcelona, Espana\nLunes a Sabado - 10:00 a 20:00\nSiguenos en Nuestras Redes:");
  const [formButtonColor, setFormButtonColor] = useState(item?.form_button_color ?? "#111111");
  const [formButtonTextColor, setFormButtonTextColor] = useState(item?.form_button_text_color ?? "#ffffff");
  const [socialButtonColor, setSocialButtonColor] = useState(item?.social_button_color ?? "#2f2723");
  const [socialIconColor, setSocialIconColor] = useState(item?.social_icon_color ?? "#ffffff");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(item?.social_links ?? []);
  const [menuId] = useState(item?.menu_id ?? "");
  const [newsletterEnabled] = useState(item?.newsletter_enabled ?? false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState<{ type: "success" | "error"; title: string; message?: string } | null>(null);

  function addSocial() {
    setSocialLinks([
      ...socialLinks,
      {
        platform: "",
        url: "",
        label: "",
        icon_url: "",
        icon_color: socialIconColor,
        button_color: socialButtonColor,
      },
    ]);
  }

  function updateSocial(idx: number, field: keyof SocialLink, value: string) {
    const copy = [...socialLinks];
    copy[idx] = { ...copy[idx], [field]: value };
    setSocialLinks(copy);
  }

  function removeSocial(idx: number) {
    setSocialLinks(socialLinks.filter((_, index) => index !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setModal(null);

    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      setIsLoading(false);
      return;
    }

    const res = await fetch(mode === "create" ? "/api/admin/components/footers" : `/api/admin/components/footers/${item?.id}`, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        status,
        logo_id: logoId,
        contact_email: contactEmail,
        whatsapp,
        address,
        legal_text: legalText,
        contact_title: contactTitle,
        contact_text: contactText,
        form_button_color: formButtonColor,
        form_button_text_color: formButtonTextColor,
        social_button_color: socialButtonColor,
        social_icon_color: socialIconColor,
        social_links: socialLinks,
        menu_id: menuId || null,
        newsletter_enabled: newsletterEnabled,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Error" }));
      const message = (data as { error?: string }).error || "No se pudo guardar el footer.";
      setError(message);
      setModal({ type: "error", title: "No se pudo guardar", message });
      setIsLoading(false);
      return;
    }

    setModal({ type: "success", title: "Footer guardado", message: "Los cambios del footer global ya estan listos." });
    router.refresh();
    setIsLoading(false);
    if (!singleton) router.push("/admin/components/footers");
  }

  return (
    <form className="editor-form cms-footer-editor" onSubmit={handleSubmit}>
      <AdminActionModal
        open={Boolean(modal)}
        type={modal?.type}
        title={modal?.title ?? ""}
        message={modal?.message}
        confirmLabel="Entendido"
        onClose={() => setModal(null)}
      />

      {!singleton ? (
        <section className="form-block cms-editor-card">
          <h3>Informacion general</h3>
          <div className="grid-2">
            <label className="field span-2"><span>Nombre</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label className="field"><span>Estado</span><select value={status} onChange={(event) => setStatus(event.target.value as FooterStatus)}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
          </div>
        </section>
      ) : null}

      <section className="form-block cms-editor-card">
        <div className="cms-editor-card__head">
          <div>
            <p className="auth-kicker">Footer global</p>
            <h3>Contacto</h3>
            <p className="cms-editor-card__description">El texto admite saltos de linea. La ultima linea se usa como titulo de redes sociales.</p>
          </div>
        </div>
        <div className="grid-2">
          <label className="field"><span>Titulo</span><input value={contactTitle} onChange={(event) => setContactTitle(event.target.value)} /></label>
          <label className="field"><span>Estado</span><select value={status} onChange={(event) => setStatus(event.target.value as FooterStatus)}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
          <label className="field span-2"><span>Descripcion</span><textarea rows={6} value={contactText} onChange={(event) => setContactText(event.target.value)} /></label>
        </div>
      </section>

      <section className="form-block cms-editor-card">
        <div className="cms-editor-card__head">
          <div>
            <p className="auth-kicker">Colores</p>
            <h3>Botones</h3>
          </div>
        </div>
        <div className="cms-footer-color-grid">
          <ColorField label="Color boton Enviar" value={formButtonColor} onChange={setFormButtonColor} />
          <ColorField label="Texto boton Enviar" value={formButtonTextColor} onChange={setFormButtonTextColor} />
          <ColorField label="Color botones redes" value={socialButtonColor} onChange={setSocialButtonColor} />
          <ColorField label="Color iconos redes" value={socialIconColor} onChange={setSocialIconColor} />
        </div>
      </section>

      <section className="form-block cms-editor-card">
        <div className="cms-editor-card__head">
          <div>
            <p className="auth-kicker">Redes sociales</p>
            <h3>Links e iconos</h3>
            <p className="cms-editor-card__description">Es recomendable que el icono sea completamente blanco para que se pueda editar facilmente.</p>
          </div>
          <button type="button" className="primary-btn" onClick={addSocial}>Anadir red</button>
        </div>
        <div className="cms-footer-social-list">
          {socialLinks.length === 0 ? <p className="muted">Aun no hay redes sociales.</p> : socialLinks.map((social, idx) => (
            <article className="cms-footer-social-card" key={`${social.platform}-${idx}`}>
              <div className="grid-2">
                <label className="field"><span>Plataforma</span><input value={social.platform} onChange={(event) => updateSocial(idx, "platform", event.target.value)} placeholder="Instagram" /></label>
                <label className="field"><span>Etiqueta accesible</span><input value={social.label} onChange={(event) => updateSocial(idx, "label", event.target.value)} placeholder="Instagram Casa Rosier" /></label>
                <label className="field span-2"><span>Link</span><input value={social.url} onChange={(event) => updateSocial(idx, "url", event.target.value)} placeholder="https://..." /></label>
                <MediaSelectField label="Icono" value={social.icon_url ?? ""} onChange={(url) => updateSocial(idx, "icon_url", url)} previewClassName="cms-footer-icon-preview" />
                <div className="cms-footer-social-card__colors">
                  <ColorField label="Color boton" value={social.button_color || socialButtonColor} onChange={(value) => updateSocial(idx, "button_color", value)} />
                  <ColorField label="Color icono" value={social.icon_color || socialIconColor} onChange={(value) => updateSocial(idx, "icon_color", value)} />
                </div>
              </div>
              <div className="cms-footer-social-card__actions">
                <button type="button" className="danger-btn" onClick={() => removeSocial(idx)}>Eliminar red</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="form-block cms-editor-card">
        <div className="cms-footer-fixed-links">
          <span className="material-symbols-outlined" aria-hidden="true">lock</span>
          <div>
            <h3>Enlaces fijos</h3>
            <p>Administracion y Politica y privacidad se mantienen visibles y no son editables desde esta pantalla.</p>
          </div>
        </div>
      </section>

      {error ? <p className="form-error">{error}</p> : null}
      <div className="admin-sticky-actionbar">
        <span className="admin-sticky-actionbar__meta">{socialLinks.length} redes sociales · Footer global</span>
        <button className="primary-btn" type="submit" disabled={isLoading}>{isLoading ? "Guardando..." : "Guardar footer"}</button>
      </div>
    </form>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="cms-footer-color-field">
      <span>{label}</span>
      <div>
        <input type="color" value={value} onChange={(event) => onChange(event.target.value)} />
        <strong>{value}</strong>
      </div>
    </label>
  );
}
