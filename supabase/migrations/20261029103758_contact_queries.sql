create table public.contact_queries (
 id uuid primary key default gen_random_uuid(),
 submission_id uuid not null unique,
 name text not null check(length(name) between 1 and 100),
 email text not null check(length(email) between 3 and 254),
 phone text not null default '' check(length(phone)<=25),
 topic text not null check(topic in ('Career counselling','Choosing a course','Choosing a college','Admission support','Education events','Other')),
 message text not null check(length(message) between 1 and 3000),
 created_at timestamptz not null default now(),
 consent_at timestamptz not null default now(),
 sheets_synced_at timestamptz
);
create index contact_queries_created on public.contact_queries(created_at,id);
alter table public.contact_queries enable row level security;
revoke all on public.contact_queries from anon,authenticated;
grant select on public.contact_queries to authenticated;
grant all on public.contact_queries to service_role;
create policy "Admins read contact queries" on public.contact_queries for select to authenticated using((select private.is_site_admin()));
create table public.contact_query_sheet (
 id text primary key check(id='contact'),
 spreadsheet_id text,
 synced_at timestamptz,
 lease_until timestamptz not null default '-infinity'
);
alter table public.contact_query_sheet enable row level security;
revoke all on public.contact_query_sheet from anon,authenticated;
grant select on public.contact_query_sheet to authenticated;
grant all on public.contact_query_sheet to service_role;
create policy "Admins read query sheet" on public.contact_query_sheet for select to authenticated using((select private.is_site_admin()));
insert into public.contact_query_sheet(id) values('contact');
