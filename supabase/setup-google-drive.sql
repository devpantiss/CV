-- Fresh project setup for Supabase content/auth + Google Drive media.
-- Run once. Do not also run the legacy Storage bucket migrations.
-- Run in the Supabase SQL editor as project owner.
begin;
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;
create table private.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table private.site_admins enable row level security;
create policy "No direct client access" on private.site_admins for all to anon, authenticated using (false) with check (false);
revoke all on private.site_admins from anon, authenticated;

create function private.is_site_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select (select auth.uid()) is not null and exists(select 1 from private.site_admins where user_id = (select auth.uid())); $$;
revoke all on function private.is_site_admin() from public;
grant execute on function private.is_site_admin() to anon, authenticated;
create function public.is_site_admin() returns boolean
language sql stable security invoker set search_path = ''
as $$ select private.is_site_admin(); $$;
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
create policy "Published content is public" on public.site_content for select to anon, authenticated using (published or (select public.is_site_admin()));
create policy "Admins insert content" on public.site_content for insert to authenticated with check ((select public.is_site_admin()));
create policy "Admins update content" on public.site_content for update to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
create policy "Admins delete content" on public.site_content for delete to authenticated using ((select public.is_site_admin()));

alter table public.site_content drop constraint site_content_kind_check;
alter table public.site_content add constraint site_content_kind_check check (kind in ('events','team','testimonials','gallery'));
alter table public.site_content drop constraint content_required_fields;
alter table public.site_content add constraint content_required_fields check (coalesce((
  (kind = 'events' and length(trim(content->>'title')) > 0 and length(trim(content->>'desc')) > 0 and length(trim(content->>'location')) > 0 and coalesce(content->>'date','') ~ '^\d{4}-\d{2}-\d{2}$')
  or (kind = 'team' and length(trim(content->>'name')) > 0 and length(trim(content->>'role')) > 0)
  or (kind = 'testimonials' and length(trim(content->>'name')) > 0 and length(trim(content->>'stage')) > 0 and length(trim(content->>'challenge')) > 0 and length(trim(content->>'support')) > 0 and length(trim(content->>'result')) > 0)
  or (kind = 'gallery' and length(trim(content->>'title')) between 1 and 200 and content->>'mediaType' in ('image','video','audio','podcast') and (
    (content->>'mediaType' = 'podcast' and content->>'youtubeUrl' ~ '^https://(www\.)?(youtube\.com/|youtu\.be/)')
    or (content->>'mediaType' in ('image','video','audio') and content->>'url' ~ '^https://')
  ))
), false));
-- Optional: run once after the migration to preserve existing published profiles.
insert into public.site_content (kind, content, published, sort_order) values
('team', '{"name":"Divya Rupainwar","role":"Founder & CEO","photo":"https://res.cloudinary.com/du3i8e0se/image/upload/v1721847900/qkvrjqtsook5wjnzbzwb.jpg","bio":"Divya founded Career Valley in 2013 to give students more context, confidence and ownership when choosing their educational direction.","email":"divya@thecareervalley.com"}'::jsonb, true, 0),
('team', '{"name":"Sonali Mulay","photo":"https://i.postimg.cc/nVjg34sd/Sonali-Mulay-expert-1.jpg","role":"Education expert"}'::jsonb, true, 1),
('team', '{"name":"Ishita Kundu","photo":"https://i.postimg.cc/vBjjQBKL/Ishita-Kundu-expert-1.jpg","role":"Education expert"}'::jsonb, true, 2),
('team', '{"name":"Prof. Satya Kiran Sastry","photo":"https://i.postimg.cc/43fjPjtt/Prof-Satya-Kiran-Sastry-expert-1.jpg","role":"Education expert"}'::jsonb, true, 3),
('team', '{"name":"Pranab Kumar","photo":"https://i.postimg.cc/PrZG5WTL/Pranab-kumar-Misra-expert-1.jpg","role":"Education expert"}'::jsonb, true, 4),
('testimonials', '{"name":"Saurav Singh","stage":"Undergraduate decision","image":"https://res.cloudinary.com/du3i8e0se/image/upload/v1723024885/saurav_nhznqm.png","challenge":"Needed clarity on undergraduate programmes and a college choice.","support":"Programme guidance, scholarship support and help navigating an education loan.","result":"Moved forward with confidence at his preferred college."}'::jsonb, true, 0),
('testimonials', '{"name":"Sneha Singh","stage":"Management pathway","image":"https://res.cloudinary.com/du3i8e0se/image/upload/v1723024924/sneha_n4jhjf.png","challenge":"Was uncertain about the right B-school after completing her undergraduate degree.","support":"Campus immersion, application guidance, scholarship support and education-loan assistance.","result":"Joined Welingkar Institute of Management, Bangalore."}'::jsonb, true, 1),
('testimonials', '{"name":"Abhishek","stage":"College selection","image":"https://res.cloudinary.com/du3i8e0se/image/upload/v1723024960/Abhisek_ib0xuw.png","challenge":"Needed help choosing a management programme and understanding the practical trade-offs.","support":"College guidance plus scholarship and education-loan support.","result":"Joined Badruka School of Management with a clearer plan."}'::jsonb, true, 2);
-- Optional: run once after both migrations to preserve existing gallery images.
insert into public.site_content (kind, content, published, sort_order) values
('gallery', '{"title":"Career Valley moments 1","description":"Students and educators coming together at Career Valley.","mediaType":"image","url":"https://i.postimg.cc/qvtqJv1S/IMG-0946.jpg","image":"https://i.postimg.cc/qvtqJv1S/IMG-0946.jpg"}'::jsonb, true, 0),
('gallery', '{"title":"Career Valley moments 2","description":"Students and educators coming together at Career Valley.","mediaType":"image","url":"https://i.postimg.cc/ZnT04PQx/IMG-1135.jpg","image":"https://i.postimg.cc/ZnT04PQx/IMG-1135.jpg"}'::jsonb, true, 1),
('gallery', '{"title":"Career Valley moments 3","description":"Students and educators coming together at Career Valley.","mediaType":"image","url":"https://i.postimg.cc/Bn1ZWw6G/IMG-0895.jpg","image":"https://i.postimg.cc/Bn1ZWw6G/IMG-0895.jpg"}'::jsonb, true, 2),
('gallery', '{"title":"Career Valley moments 4","description":"Students and educators coming together at Career Valley.","mediaType":"image","url":"https://i.postimg.cc/NjVymHyQ/IMG-1269.jpg","image":"https://i.postimg.cc/NjVymHyQ/IMG-1269.jpg"}'::jsonb, true, 3),
('gallery', '{"title":"Career Valley moments 5","description":"Students and educators coming together at Career Valley.","mediaType":"image","url":"https://i.postimg.cc/5yny0Ydd/IMG-1133.jpg","image":"https://i.postimg.cc/5yny0Ydd/IMG-1133.jpg"}'::jsonb, true, 4),
('gallery', '{"title":"Career Valley moments 6","description":"Students and educators coming together at Career Valley.","mediaType":"image","url":"https://i.postimg.cc/WpX10kKx/IMG-0911.jpg","image":"https://i.postimg.cc/WpX10kKx/IMG-0911.jpg"}'::jsonb, true, 5),
('gallery', '{"title":"Career Valley moments 7","description":"Students and educators coming together at Career Valley.","mediaType":"image","url":"https://i.postimg.cc/P5BxPncx/IMG-0944.jpg","image":"https://i.postimg.cc/P5BxPncx/IMG-0944.jpg"}'::jsonb, true, 6),
('gallery', '{"title":"Career Valley moments 8","description":"Students and educators coming together at Career Valley.","mediaType":"image","url":"https://i.postimg.cc/sDg1Lc7V/IMG-1180.jpg","image":"https://i.postimg.cc/sDg1Lc7V/IMG-1180.jpg"}'::jsonb, true, 7),
('gallery', '{"title":"Career Valley moments 9","description":"Students and educators coming together at Career Valley.","mediaType":"image","url":"https://i.postimg.cc/CMNzJtZP/IMG-1227.jpg","image":"https://i.postimg.cc/CMNzJtZP/IMG-1227.jpg"}'::jsonb, true, 8);

-- Restrict a default project event trigger helper when present.
do $$ begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end $$;
-- The Auth user must exist before this grant takes effect. No password is set here.
insert into private.site_admins(user_id)
select id from auth.users where lower(email) = 'dev.careervalley@gmail.com'
on conflict do nothing;
commit;
-- Verify setup and whether the admin user has been created:
select exists(select 1 from auth.users where lower(email) = 'dev.careervalley@gmail.com') as admin_auth_user_exists;
