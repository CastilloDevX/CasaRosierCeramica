-- Migration 033: optional social gallery block for the Shop page.

alter table public.shop_page_settings
  add column if not exists show_social_gallery_section boolean not null default false;

