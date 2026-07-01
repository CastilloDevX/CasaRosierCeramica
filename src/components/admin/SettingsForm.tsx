"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/cms/settings";
import SettingsSection from "./SettingsSection";
import MediaSelectField from "./MediaSelectField";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateSection<K extends keyof SiteSettings>(section: K, value: Partial<SiteSettings[K]>) {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...value },
    }));
  }

  async function handleSave() {
    setIsLoading(true);
    setSuccess(null);
    setError(null);

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Error al guardar." }));
      setError(data.error || "Error al guardar la configuración.");
      setIsLoading(false);
      return;
    }

    setSuccess("Configuración guardada correctamente.");
    setIsLoading(false);
    setTimeout(() => setSuccess(null), 3000);
  }

  async function handleReset() {
    if (!window.confirm("¿Restaurar valores iniciales? Se perderán los cambios actuales.")) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    });

    if (!response.ok) {
      setError("Error al restaurar valores iniciales.");
      setIsLoading(false);
      return;
    }

    const data = await response.json();
    setSettings(data.settings);
    setSuccess("Valores iniciales restaurados.");
    setIsLoading(false);
    setTimeout(() => setSuccess(null), 3000);
  }

  return (
    <div className="settings-form">
      <SettingsSection title="Información general" description="Nombre, descripción e imagen del sitio.">
        <div className="grid-2">
          <label className="field span-2">
            <span>Nombre del sitio</span>
            <input
              value={settings.site.site_name}
              onChange={(e) => updateSection("site", { site_name: e.target.value })}
            />
          </label>
          <label className="field span-2">
            <span>Descripción del sitio</span>
            <textarea
              rows={3}
              value={settings.site.site_description}
              onChange={(e) => updateSection("site", { site_description: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Idioma por defecto</span>
            <input
              value={settings.site.default_language}
              onChange={(e) => updateSection("site", { default_language: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Zona horaria</span>
            <input
              value={settings.site.timezone}
              onChange={(e) => updateSection("site", { timezone: e.target.value })}
            />
          </label>
        </div>

        <div className="grid-2" style={{ marginTop: "1rem" }}>
          <MediaSelectField
            label="Logo del sitio"
            value={settings.site.logo_url}
            onChange={(url) => updateSection("site", { logo_url: url })}
          />
          <MediaSelectField
            label="Favicon"
            value={settings.site.favicon_url}
            onChange={(url) => updateSection("site", { favicon_url: url })}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Contacto" description="Información de contacto del sitio.">
        <div className="grid-2">
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={settings.contact.email}
              onChange={(e) => updateSection("contact", { email: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Teléfono</span>
            <input
              value={settings.contact.phone}
              onChange={(e) => updateSection("contact", { phone: e.target.value })}
            />
          </label>
          <label className="field">
            <span>WhatsApp</span>
            <input
              value={settings.contact.whatsapp}
              onChange={(e) => updateSection("contact", { whatsapp: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Dirección</span>
            <input
              value={settings.contact.address}
              onChange={(e) => updateSection("contact", { address: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Ciudad</span>
            <input
              value={settings.contact.city}
              onChange={(e) => updateSection("contact", { city: e.target.value })}
            />
          </label>
          <label className="field">
            <span>País</span>
            <input
              value={settings.contact.country}
              onChange={(e) => updateSection("contact", { country: e.target.value })}
            />
          </label>
          <label className="field span-2">
            <span>URL del mapa</span>
            <input
              value={settings.contact.map_url}
              onChange={(e) => updateSection("contact", { map_url: e.target.value })}
            />
          </label>
        </div>
      </SettingsSection>

      <SettingsSection title="Redes sociales" description="Enlaces a perfiles sociales.">
        <div className="grid-2">
          <label className="field">
            <span>Instagram</span>
            <input
              value={settings.social.instagram_url}
              onChange={(e) => updateSection("social", { instagram_url: e.target.value })}
            />
          </label>
          <label className="field">
            <span>TikTok</span>
            <input
              value={settings.social.tiktok_url}
              onChange={(e) => updateSection("social", { tiktok_url: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Facebook</span>
            <input
              value={settings.social.facebook_url}
              onChange={(e) => updateSection("social", { facebook_url: e.target.value })}
            />
          </label>
          <label className="field">
            <span>YouTube</span>
            <input
              value={settings.social.youtube_url}
              onChange={(e) => updateSection("social", { youtube_url: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Pinterest</span>
            <input
              value={settings.social.pinterest_url}
              onChange={(e) => updateSection("social", { pinterest_url: e.target.value })}
            />
          </label>
        </div>
      </SettingsSection>

      <SettingsSection title="Footer" description="Configuración del pie de página.">
        <div className="grid-2">
          <MediaSelectField
            label="Logo del footer"
            value={settings.footer.footer_logo_url}
            onChange={(url) => updateSection("footer", { footer_logo_url: url })}
          />
          <label className="field">
            <span>Texto del footer</span>
            <textarea
              rows={3}
              value={settings.footer.footer_text}
              onChange={(e) => updateSection("footer", { footer_text: e.target.value })}
            />
          </label>
          <label className="field span-2">
            <span>Texto legal</span>
            <textarea
              rows={3}
              value={settings.footer.legal_text}
              onChange={(e) => updateSection("footer", { legal_text: e.target.value })}
            />
          </label>
          <label className="field checkbox-field">
            <input
              type="checkbox"
              checked={settings.footer.show_social_links}
              onChange={(e) => updateSection("footer", { show_social_links: e.target.checked })}
            />
            <span>Mostrar redes sociales</span>
          </label>
          <label className="field checkbox-field">
            <input
              type="checkbox"
              checked={settings.footer.show_contact_info}
              onChange={(e) => updateSection("footer", { show_contact_info: e.target.checked })}
            />
            <span>Mostrar información de contacto</span>
          </label>
        </div>
      </SettingsSection>

      <SettingsSection title="SEO global" description="Configuración SEO por defecto.">
        <div className="grid-2">
          <label className="field span-2">
            <span>SEO title por defecto</span>
            <input
              value={settings.seo.default_seo_title}
              onChange={(e) => updateSection("seo", { default_seo_title: e.target.value })}
            />
          </label>
          <label className="field span-2">
            <span>SEO description por defecto</span>
            <textarea
              rows={3}
              value={settings.seo.default_seo_description}
              onChange={(e) => updateSection("seo", { default_seo_description: e.target.value })}
            />
          </label>
          <MediaSelectField
            label="Imagen Open Graph por defecto"
            value={settings.seo.default_og_image_url}
            onChange={(url) => updateSection("seo", { default_og_image_url: url })}
          />
          <label className="field checkbox-field">
            <input
              type="checkbox"
              checked={settings.seo.robots_index}
              onChange={(e) => updateSection("seo", { robots_index: e.target.checked })}
            />
            <span>Permitir indexación</span>
          </label>
          <label className="field checkbox-field">
            <input
              type="checkbox"
              checked={settings.seo.robots_follow}
              onChange={(e) => updateSection("seo", { robots_follow: e.target.checked })}
            />
            <span>Permitir follow</span>
          </label>
        </div>
      </SettingsSection>

      <SettingsSection title="Sistema" description="Opciones avanzadas del CMS.">
        <div className="grid-2">
          <label className="field checkbox-field">
            <input
              type="checkbox"
              checked={settings.system.maintenance_mode}
              onChange={(e) => updateSection("system", { maintenance_mode: e.target.checked })}
            />
            <span>Modo mantenimiento</span>
          </label>
          <div className="field">
            <span>Última actualización</span>
            <p className="muted" style={{ padding: "0.95rem 0" }}>
              {settings.system.updated_at
                ? new Date(settings.system.updated_at).toLocaleString()
                : "Nunca"}
            </p>
          </div>
        </div>
      </SettingsSection>

      {success ? <p className="form-success">{success}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      <div className="form-actions" style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <button type="button" className="secondary-btn" onClick={handleReset} disabled={isLoading}>
          Restaurar valores iniciales
        </button>
        <button type="button" className="primary-btn" onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar configuración"}
        </button>
      </div>
    </div>
  );
}
