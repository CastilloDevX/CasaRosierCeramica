alter table public.offerings
add column if not exists details jsonb not null default '{}'::jsonb;
