"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { MarketingSettings, MarketingEvent } from "@/lib/cms/types";
import { MARKETING_EVENTS } from "@/lib/cms/types";

export default function MarketingForm() {
  const router = useRouter();
  const [settings, setSettings] = useState<MarketingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch("/api/admin/marketing").then((r) => r.json()).then(setSettings).catch(() => {}); }, []);

  function set<K extends keyof MarketingSettings>(key: K, value: MarketingSettings[K]) {
    if (!settings) return; setSettings({ ...settings, [key]: value });
  }

  function toggleEvent(ev: MarketingEvent) {
    if (!settings) return;
    const has = settings.events.includes(ev);
    set("events", has ? settings.events.filter((e) => e !== ev) : [...settings.events, ev]);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault(); if (!settings) return; setIsLoading(true);
    const res = await fetch("/api/admin/marketing", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setIsLoading(false); router.refresh();
  }

  if (!settings) return <p className="muted">Cargando...</p>;

  return (<form className="editor-form" onSubmit={save}>
    <section className="form-block"><h3>📊 Analytics</h3><div className="grid-2">
      <label className="field checkbox-field"><input type="checkbox" checked={settings.analytics_enabled} onChange={(e) => set("analytics_enabled", e.target.checked)} /><span>Activar Analytics</span></label>
      {settings.analytics_enabled ? <><label className="field"><span>GA4 Measurement ID</span><input value={settings.ga4_measurement_id} onChange={(e) => set("ga4_measurement_id", e.target.value)} placeholder="G-XXXXXXXXXX" /></label>
      <label className="field"><span>GTM Container ID</span><input value={settings.gtm_container_id} onChange={(e) => set("gtm_container_id", e.target.value)} placeholder="GTM-XXXXXXX" /></label>
      <label className="field"><span>Google Search Console ID</span><input value={settings.google_search_console_id} onChange={(e) => set("google_search_console_id", e.target.value)} /></label>
      <label className="field"><span>Microsoft Clarity ID</span><input value={settings.microsoft_clarity_id} onChange={(e) => set("microsoft_clarity_id", e.target.value)} /></label></> : null}
    </div></section>

    <section className="form-block"><h3>📱 Meta</h3><div className="grid-2">
      <label className="field checkbox-field"><input type="checkbox" checked={settings.meta_pixel_enabled} onChange={(e) => set("meta_pixel_enabled", e.target.checked)} /><span>Activar Meta Pixel</span></label>
      {settings.meta_pixel_enabled ? <><label className="field"><span>Meta Pixel ID</span><input value={settings.meta_pixel_id} onChange={(e) => set("meta_pixel_id", e.target.value)} /></label>
      <label className="field checkbox-field"><input type="checkbox" checked={settings.meta_conversion_api_enabled} onChange={(e) => set("meta_conversion_api_enabled", e.target.checked)} /><span>Conversion API</span></label>
      {settings.meta_conversion_api_enabled ? <><label className="field"><span>Access Token</span><input type="password" value={settings.meta_access_token} onChange={(e) => set("meta_access_token", e.target.value)} /></label>
      <label className="field"><span>Dataset ID</span><input value={settings.meta_dataset_id} onChange={(e) => set("meta_dataset_id", e.target.value)} /></label></> : null}</> : null}
    </div></section>

    <section className="form-block"><h3>🎯 Otros Pixels</h3><div className="grid-2">
      <label className="field checkbox-field"><input type="checkbox" checked={settings.tiktok_pixel_enabled} onChange={(e) => set("tiktok_pixel_enabled", e.target.checked)} /><span>TikTok Pixel</span></label>
      {settings.tiktok_pixel_enabled ? <label className="field"><span>TikTok Pixel ID</span><input value={settings.tiktok_pixel_id} onChange={(e) => set("tiktok_pixel_id", e.target.value)} /></label> : null}
      <label className="field checkbox-field"><input type="checkbox" checked={settings.pinterest_tag_enabled} onChange={(e) => set("pinterest_tag_enabled", e.target.checked)} /><span>Pinterest Tag</span></label>
      {settings.pinterest_tag_enabled ? <label className="field"><span>Pinterest Tag ID</span><input value={settings.pinterest_tag_id} onChange={(e) => set("pinterest_tag_id", e.target.value)} /></label> : null}
      <label className="field checkbox-field"><input type="checkbox" checked={settings.linkedin_insight_enabled} onChange={(e) => set("linkedin_insight_enabled", e.target.checked)} /><span>LinkedIn Insight</span></label>
      {settings.linkedin_insight_enabled ? <label className="field"><span>LinkedIn Partner ID</span><input value={settings.linkedin_partner_id} onChange={(e) => set("linkedin_partner_id", e.target.value)} /></label> : null}
    </div></section>

    <section className="form-block"><h3>🔍 SEO Técnico</h3><div className="grid-2">
      <label className="field span-2"><span>SEO Global Title (suffix)</span><input value={settings.seo_global_title} onChange={(e) => set("seo_global_title", e.target.value)} placeholder=" | Casa Rosier" /></label>
      <label className="field span-2"><span>SEO Global Description</span><textarea rows={3} value={settings.seo_global_description} onChange={(e) => set("seo_global_description", e.target.value)} /></label>
      <label className="field checkbox-field"><input type="checkbox" checked={settings.robots_enabled} onChange={(e) => set("robots_enabled", e.target.checked)} /><span>Generar robots.txt</span></label>
      <label className="field checkbox-field"><input type="checkbox" checked={settings.sitemap_enabled} onChange={(e) => set("sitemap_enabled", e.target.checked)} /><span>Generar sitemap.xml</span></label>
      <label className="field checkbox-field"><input type="checkbox" checked={settings.schema_enabled} onChange={(e) => set("schema_enabled", e.target.checked)} /><span>Schema.org JSON-LD</span></label>
    </div></section>

    <section className="form-block"><h3>📌 Eventos y Conversiones</h3>
      <p className="muted" style={{ marginBottom: "0.75rem" }}>Selecciona qué eventos trackear con Meta Pixel / GA4:</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>{MARKETING_EVENTS.map((ev) => (<label key={ev} className="field checkbox-field" style={{ minWidth: "140px" }}><input type="checkbox" checked={settings.events.includes(ev)} onChange={() => toggleEvent(ev)} /><span>{ev.replace(/_/g, " ")}</span></label>))}</div>
    </section>

    <section className="form-block"><h3>⚡ UTM / Webhooks</h3><div className="grid-2">
      <label className="field checkbox-field"><input type="checkbox" checked={settings.utm_builder_enabled} onChange={(e) => set("utm_builder_enabled", e.target.checked)} /><span>UTM Builder</span></label>
      <label className="field checkbox-field"><input type="checkbox" checked={settings.automation_webhooks_enabled} onChange={(e) => set("automation_webhooks_enabled", e.target.checked)} /><span>Webhooks</span></label>
      {settings.automation_webhooks_enabled ? <label className="field span-2"><span>Webhook URL</span><input value={settings.webhook_url} onChange={(e) => set("webhook_url", e.target.value)} /></label> : null}
    </div></section>

    <div className="form-actions"><button className="primary-btn" type="submit" disabled={isLoading}>{isLoading ? "Guardando..." : saved ? "✓ Guardado" : "Guardar configuración"}</button></div>
  </form>);
}
