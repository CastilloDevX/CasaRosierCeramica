import { createAdminClient } from "../supabase/admin";
import { readJsonFile, writeJsonFile } from "./local-storage";
import { defaultMarketingSettings } from "./types";
import type { MarketingSettings } from "./types";
import type { Json, MarketingSettingInsert, MarketingSettingUpdate } from "../supabase/types";

const FILE_NAME = "marketing.json";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000002";

function flattenMarketing(s: MarketingSettings): MarketingSettingUpdate {
  return {
    analytics_enabled: s.analytics_enabled,
    google_analytics_id: s.ga4_measurement_id || null,
    gtm_container_id: s.gtm_container_id || null,
    google_search_console_id: s.google_search_console_id || null,
    microsoft_clarity_id: s.microsoft_clarity_id || null,
    meta_pixel_enabled: s.meta_pixel_enabled,
    meta_pixel_id: s.meta_pixel_id || null,
    meta_conversion_api_enabled: s.meta_conversion_api_enabled,
    meta_access_token: s.meta_access_token || null,
    meta_dataset_id: s.meta_dataset_id || null,
    tiktok_pixel_enabled: s.tiktok_pixel_enabled,
    tiktok_pixel_id: s.tiktok_pixel_id || null,
    pinterest_tag_enabled: s.pinterest_tag_enabled,
    pinterest_tag_id: s.pinterest_tag_id || null,
    linkedin_insight_enabled: s.linkedin_insight_enabled,
    linkedin_partner_id: s.linkedin_partner_id || null,
    seo_global_title: s.seo_global_title || null,
    seo_global_description: s.seo_global_description || null,
    seo_og_image: s.seo_og_image || null,
    robots_enabled: s.robots_enabled,
    sitemap_enabled: s.sitemap_enabled,
    schema_enabled: s.schema_enabled,
    events: s.events as unknown as Json,
    utm_builder_enabled: s.utm_builder_enabled,
    automation_webhooks_enabled: s.automation_webhooks_enabled,
    webhook_url: s.webhook_url || null,
  };
}

function rowToMarketing(
  row: {
    analytics_enabled: boolean;
    google_analytics_id: string | null;
    gtm_container_id: string | null;
    google_search_console_id: string | null;
    microsoft_clarity_id: string | null;
    meta_pixel_enabled: boolean;
    meta_pixel_id: string | null;
    meta_conversion_api_enabled: boolean;
    meta_access_token: string | null;
    meta_dataset_id: string | null;
    tiktok_pixel_enabled: boolean;
    tiktok_pixel_id: string | null;
    pinterest_tag_enabled: boolean;
    pinterest_tag_id: string | null;
    linkedin_insight_enabled: boolean;
    linkedin_partner_id: string | null;
    seo_global_title: string | null;
    seo_global_description: string | null;
    seo_og_image: string | null;
    robots_enabled: boolean;
    sitemap_enabled: boolean;
    schema_enabled: boolean;
    events: unknown;
    utm_builder_enabled: boolean;
    automation_webhooks_enabled: boolean;
    webhook_url: string | null;
    updated_at: string;
  },
): MarketingSettings {
  return {
    analytics_enabled: row.analytics_enabled,
    ga4_measurement_id: row.google_analytics_id ?? "",
    gtm_container_id: row.gtm_container_id ?? "",
    google_search_console_id: row.google_search_console_id ?? "",
    microsoft_clarity_id: row.microsoft_clarity_id ?? "",
    meta_pixel_enabled: row.meta_pixel_enabled,
    meta_pixel_id: row.meta_pixel_id ?? "",
    meta_conversion_api_enabled: row.meta_conversion_api_enabled,
    meta_access_token: row.meta_access_token ?? "",
    meta_dataset_id: row.meta_dataset_id ?? "",
    tiktok_pixel_enabled: row.tiktok_pixel_enabled,
    tiktok_pixel_id: row.tiktok_pixel_id ?? "",
    pinterest_tag_enabled: row.pinterest_tag_enabled,
    pinterest_tag_id: row.pinterest_tag_id ?? "",
    linkedin_insight_enabled: row.linkedin_insight_enabled,
    linkedin_partner_id: row.linkedin_partner_id ?? "",
    seo_global_title: row.seo_global_title ?? "",
    seo_global_description: row.seo_global_description ?? "",
    seo_og_image: row.seo_og_image ?? "",
    robots_enabled: row.robots_enabled,
    sitemap_enabled: row.sitemap_enabled,
    schema_enabled: row.schema_enabled,
    events: (Array.isArray(row.events) ? row.events : []) as MarketingSettings["events"],
    utm_builder_enabled: row.utm_builder_enabled,
    automation_webhooks_enabled: row.automation_webhooks_enabled,
    webhook_url: row.webhook_url ?? "",
    updated_at: row.updated_at,
  };
}

async function readFromSupabase(): Promise<MarketingSettings | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("marketing_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return rowToMarketing(data as Parameters<typeof rowToMarketing>[0]);
  } catch {
    return null;
  }
}

async function writeToSupabase(settings: MarketingSettings): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const flat = flattenMarketing(settings) as Record<string, unknown>;
    flat.updated_at = new Date().toISOString();
    const { data: existing } = await supabase
      .from("marketing_settings")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (existing) {
      const { error } = await supabase
        .from("marketing_settings")
        .update(flat)
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("marketing_settings")
        .insert({ id: SETTINGS_ID, ...flat } as MarketingSettingInsert);
      if (error) throw error;
    }
    return true;
  } catch {
    return false;
  }
}

export async function getMarketingSettings(): Promise<MarketingSettings> {
  const fromSupabase = await readFromSupabase();
  if (fromSupabase) {
    return fromSupabase;
  }
  const data = await readJsonFile<Partial<MarketingSettings>>(FILE_NAME, {});
  return { ...defaultMarketingSettings(), ...data };
}

export async function updateMarketingSettings(input: Partial<MarketingSettings>): Promise<MarketingSettings> {
  const current = await getMarketingSettings();
  const next: MarketingSettings = { ...current, ...input, updated_at: new Date().toISOString() };
  if (input.meta_access_token === undefined) next.meta_access_token = current.meta_access_token;
  await writeToSupabase(next);
  await writeJsonFile(FILE_NAME, next);
  return next;
}
