import { createAdminClient } from "../supabase/admin";
import { readJsonFile, writeJsonFile } from "./local-storage";
import type { SiteSettingInsert, SiteSettingUpdate } from "../supabase/types";

const FILE_NAME = "settings.json";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

export interface SiteSettings {
  site: {
    site_name: string;
    site_description: string;
    logo_url: string;
    favicon_url: string;
    default_language: string;
    timezone: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
    country: string;
    map_url: string;
  };
  social: {
    instagram_url: string;
    tiktok_url: string;
    facebook_url: string;
    youtube_url: string;
    pinterest_url: string;
  };
  footer: {
    footer_logo_url: string;
    footer_text: string;
    legal_text: string;
    show_social_links: boolean;
    show_contact_info: boolean;
  };
  seo: {
    default_seo_title: string;
    default_seo_description: string;
    default_og_image_url: string;
    robots_index: boolean;
    robots_follow: boolean;
  };
  system: {
    maintenance_mode: boolean;
    updated_at: string;
  };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  site: {
    site_name: "Casa Rosier",
    site_description: "",
    logo_url: "",
    favicon_url: "",
    default_language: "es",
    timezone: "Europe/Madrid",
  },
  contact: {
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "Barcelona",
    country: "España",
    map_url: "",
  },
  social: {
    instagram_url: "",
    tiktok_url: "",
    facebook_url: "",
    youtube_url: "",
    pinterest_url: "",
  },
  footer: {
    footer_logo_url: "",
    footer_text: "",
    legal_text: "",
    show_social_links: true,
    show_contact_info: true,
  },
  seo: {
    default_seo_title: "",
    default_seo_description: "",
    default_og_image_url: "",
    robots_index: true,
    robots_follow: true,
  },
  system: {
    maintenance_mode: false,
    updated_at: "",
  },
};

function flattenSettings(s: SiteSettings): SiteSettingUpdate {
  return {
    site_name: s.site.site_name,
    site_description: s.site.site_description || null,
    logo_url: s.site.logo_url || null,
    favicon_url: s.site.favicon_url || null,
    default_language: s.site.default_language,
    timezone: s.site.timezone,
    email: s.contact.email || null,
    phone: s.contact.phone || null,
    whatsapp: s.contact.whatsapp || null,
    address: s.contact.address || null,
    city: s.contact.city,
    country: s.contact.country,
    map_url: s.contact.map_url || null,
    instagram_url: s.social.instagram_url || null,
    tiktok_url: s.social.tiktok_url || null,
    facebook_url: s.social.facebook_url || null,
    youtube_url: s.social.youtube_url || null,
    pinterest_url: s.social.pinterest_url || null,
    footer_logo_url: s.footer.footer_logo_url || null,
    footer_text: s.footer.footer_text || null,
    legal_text: s.footer.legal_text || null,
    show_social_links: s.footer.show_social_links,
    show_contact_info: s.footer.show_contact_info,
    default_seo_title: s.seo.default_seo_title || null,
    default_seo_description: s.seo.default_seo_description || null,
    default_og_image_url: s.seo.default_og_image_url || null,
    robots_index: s.seo.robots_index,
    robots_follow: s.seo.robots_follow,
    maintenance_mode: s.system.maintenance_mode,
  };
}

function rowToSettings(
  row: {
    site_name: string;
    site_description: string | null;
    logo_url: string | null;
    favicon_url: string | null;
    default_language: string;
    timezone: string;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    address: string | null;
    city: string;
    country: string;
    map_url: string | null;
    instagram_url: string | null;
    tiktok_url: string | null;
    facebook_url: string | null;
    youtube_url: string | null;
    pinterest_url: string | null;
    footer_logo_url: string | null;
    footer_text: string | null;
    legal_text: string | null;
    show_social_links: boolean;
    show_contact_info: boolean;
    default_seo_title: string | null;
    default_seo_description: string | null;
    default_og_image_url: string | null;
    robots_index: boolean;
    robots_follow: boolean;
    maintenance_mode: boolean;
    updated_at: string;
  },
): SiteSettings {
  return {
    site: {
      site_name: row.site_name,
      site_description: row.site_description ?? "",
      logo_url: row.logo_url ?? "",
      favicon_url: row.favicon_url ?? "",
      default_language: row.default_language,
      timezone: row.timezone,
    },
    contact: {
      email: row.email ?? "",
      phone: row.phone ?? "",
      whatsapp: row.whatsapp ?? "",
      address: row.address ?? "",
      city: row.city,
      country: row.country,
      map_url: row.map_url ?? "",
    },
    social: {
      instagram_url: row.instagram_url ?? "",
      tiktok_url: row.tiktok_url ?? "",
      facebook_url: row.facebook_url ?? "",
      youtube_url: row.youtube_url ?? "",
      pinterest_url: row.pinterest_url ?? "",
    },
    footer: {
      footer_logo_url: row.footer_logo_url ?? "",
      footer_text: row.footer_text ?? "",
      legal_text: row.legal_text ?? "",
      show_social_links: row.show_social_links,
      show_contact_info: row.show_contact_info,
    },
    seo: {
      default_seo_title: row.default_seo_title ?? "",
      default_seo_description: row.default_seo_description ?? "",
      default_og_image_url: row.default_og_image_url ?? "",
      robots_index: row.robots_index,
      robots_follow: row.robots_follow,
    },
    system: {
      maintenance_mode: row.maintenance_mode,
      updated_at: row.updated_at,
    },
  };
}

async function readFromSupabase(): Promise<SiteSettings | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return rowToSettings(data as Parameters<typeof rowToSettings>[0]);
  } catch {
    return null;
  }
}

async function writeToSupabase(settings: SiteSettings): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const flat = flattenSettings(settings) as Record<string, unknown>;
    flat.updated_at = new Date().toISOString();
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (existing) {
      const { error } = await supabase
        .from("site_settings")
        .update(flat)
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("site_settings")
        .insert({ id: SETTINGS_ID, ...flat } as SiteSettingInsert);
      if (error) throw error;
    }
    return true;
  } catch {
    return false;
  }
}

function mergeSettings(current: SiteSettings, partial: Partial<SiteSettings>): SiteSettings {
  return {
    site: { ...current.site, ...(partial.site ?? {}) },
    contact: { ...current.contact, ...(partial.contact ?? {}) },
    social: { ...current.social, ...(partial.social ?? {}) },
    footer: { ...current.footer, ...(partial.footer ?? {}) },
    seo: { ...current.seo, ...(partial.seo ?? {}) },
    system: { ...current.system, ...(partial.system ?? {}), updated_at: new Date().toISOString() },
  };
}

export async function getSettings(): Promise<SiteSettings> {
  const fromSupabase = await readFromSupabase();
  if (fromSupabase) {
    return fromSupabase;
  }
  const data = await readJsonFile<Partial<SiteSettings>>(FILE_NAME, {});
  return { ...DEFAULT_SETTINGS, ...data };
}

export async function updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const next = mergeSettings(current, data);
  await writeToSupabase(next);
  await writeJsonFile(FILE_NAME, next);
  return next;
}

export async function updateSiteSettings(data: Partial<SiteSettings["site"]>): Promise<SiteSettings> {
  return updateSettings({ site: data } as Partial<SiteSettings>);
}

export async function updateContactSettings(data: Partial<SiteSettings["contact"]>): Promise<SiteSettings> {
  return updateSettings({ contact: data } as Partial<SiteSettings>);
}

export async function updateSocialSettings(data: Partial<SiteSettings["social"]>): Promise<SiteSettings> {
  return updateSettings({ social: data } as Partial<SiteSettings>);
}

export async function updateFooterSettings(data: Partial<SiteSettings["footer"]>): Promise<SiteSettings> {
  return updateSettings({ footer: data } as Partial<SiteSettings>);
}

export async function updateSeoSettings(data: Partial<SiteSettings["seo"]>): Promise<SiteSettings> {
  return updateSettings({ seo: data } as Partial<SiteSettings>);
}

export async function resetSettings(): Promise<SiteSettings> {
  const next = { ...DEFAULT_SETTINGS, system: { ...DEFAULT_SETTINGS.system, updated_at: new Date().toISOString() } };
  await writeToSupabase(next);
  await writeJsonFile(FILE_NAME, next);
  return next;
}
