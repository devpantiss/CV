create table public.event_registrations (
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.site_content(id) on delete restrict,
 name text not null check(length(name) between 1 and 100),
 email text not null check(length(email) <= 254),
 phone text not null check(length(phone) <= 25),
 institution text not null check(length(institution) <= 160),
 city text not null check(length(city) <= 100),
 sheets_synced_at timestamptz,
 consent_at timestamptz not null default now(),
 created_at timestamptz not null default now(),
 unique(event_id,email)
);
create index event_registrations_event_created on public.event_registrations(event_id,created_at,id);
alter table public.event_registrations enable row level security;
revoke all on public.event_registrations from anon,authenticated;
grant select on public.event_registrations to authenticated;
grant all on public.event_registrations to service_role;
create policy "Admins read event registrants" on public.event_registrations for select to authenticated using ((select private.is_site_admin()));
create table public.event_registration_sheets (
 event_id uuid primary key references public.site_content(id) on delete restrict,
 spreadsheet_id text,
 synced_at timestamptz,
 lease_until timestamptz not null default '-infinity'
);
alter table public.event_registration_sheets enable row level security;
revoke all on public.event_registration_sheets from anon,authenticated;
grant select on public.event_registration_sheets to authenticated;
grant all on public.event_registration_sheets to service_role;
create policy "Admins read event sheets" on public.event_registration_sheets for select to authenticated using ((select private.is_site_admin()));
create table private.registration_limits (key text primary key, window_start timestamptz not null, attempts int not null);
alter table private.registration_limits enable row level security;
revoke all on private.registration_limits from public,anon,authenticated;
create policy "No direct rate limit access" on private.registration_limits for all to anon,authenticated using(false) with check(false);
create function private.consume_registration_limit(bucket text) returns boolean language plpgsql security definer set search_path='' as $$
declare n int;
begin
 insert into private.registration_limits values(bucket,now(),1)
 on conflict(key) do update set attempts=case when private.registration_limits.window_start < now()-interval '1 hour' then 1 else private.registration_limits.attempts+1 end,
 window_start=case when private.registration_limits.window_start < now()-interval '1 hour' then now() else private.registration_limits.window_start end
 returning attempts into n;
 delete from private.registration_limits where window_start < now()-interval '2 days';
 return n<=10;
end $$;
revoke all on function private.consume_registration_limit(text) from public,anon,authenticated;
grant execute on function private.consume_registration_limit(text) to service_role;

grant usage on schema private to service_role;
create function public.consume_registration_limit(bucket text) returns boolean language sql security invoker set search_path='' as $$ select private.consume_registration_limit(bucket); $$;
revoke all on function public.consume_registration_limit(text) from public,anon,authenticated;
grant execute on function public.consume_registration_limit(text) to service_role;
