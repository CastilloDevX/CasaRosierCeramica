-- =============================================================================
-- Migration 002: Add SEO columns to site_settings
-- =============================================================================
-- Los campos SEO del modelo TypeScript (SiteSettings.seo) no estaban incluidos
-- en la migración 001. Esta migración los añade para que Supabase pueda
-- almacenar todos los campos del modelo.
-- =============================================================================

alter table if exists public.site_settings
  add column if not exists default_seo_title text,
  add column if not exists default_seo_description text,
  add column if not exists default_og_image_url text,
  add column if not exists robots_index boolean not null default true,
  add column if not exists robots_follow boolean not null default true;
