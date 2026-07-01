-- Fix trash_items.deleted_by: change from uuid FK to text
-- because the project uses local auth, not Supabase Auth
alter table if exists public.trash_items
  alter column deleted_by type text using deleted_by::text;
