-- Run in the Supabase SQL editor as project owner.
begin;
create table public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.site_admins enable row level security;
revoke all on public.site_admins from anon, authenticated;

create function public.is_site_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.site_admins where user_id = (select auth.uid())); $$;
revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to anon, authenticated;

create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('events', 'team', 'testimonials')),
  content jsonb not null check (jsonb_typeof(content) = 'object' and octet_length(content::text) <= 50000),
  published boolean not null default false,
  sort_order integer not null default 0 check (sort_order between 0 and 9999),
  created_at timestamptz not null default now(),
  constraint content_required_fields check (coalesce((
    (kind = 'events' and length(trim(content->>'title')) > 0 and length(trim(content->>'desc')) > 0 and length(trim(content->>'location')) > 0 and coalesce(content->>'date','') ~ '^\d{4}-\d{2}-\d{2}$')
    or (kind = 'team' and length(trim(content->>'name')) > 0 and length(trim(content->>'role')) > 0)
    or (kind = 'testimonials' and length(trim(content->>'name')) > 0 and length(trim(content->>'stage')) > 0 and length(trim(content->>'challenge')) > 0 and length(trim(content->>'support')) > 0 and length(trim(content->>'result')) > 0)
  ), false)),
  constraint registration_https check (coalesce(content->>'registrationUrl','') = '' or content->>'registrationUrl' ~ '^https://')
);
create index site_content_public_listing on public.site_content(kind, published, sort_order, created_at);
alter table public.site_content enable row level security;
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
create policy "Published content is public" on public.site_content for select to anon, authenticated using (published or public.is_site_admin());
create policy "Admins insert content" on public.site_content for insert to authenticated with check (public.is_site_admin());
create policy "Admins update content" on public.site_content for update to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "Admins delete content" on public.site_content for delete to authenticated using (public.is_site_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 5242880, array['image/jpeg','image/png','image/webp']);
create policy "Public website images" on storage.objects for select to anon, authenticated using (bucket_id = 'site-images');
create policy "Admins upload website images" on storage.objects for insert to authenticated with check (bucket_id = 'site-images' and public.is_site_admin() and (storage.foldername(name))[1] in ('events','team','testimonials'));
create policy "Admins delete website images" on storage.objects for delete to authenticated using (bucket_id = 'site-images' and public.is_site_admin());
commit;
