begin;
alter table public.event_registrations
 add column if not exists pass_email_status text not null default 'not_sent' check (pass_email_status in ('not_sent','sending','sent','failed','review')),
 add column if not exists pass_email_sent_at timestamptz,
 add column if not exists pass_email_started_at timestamptz,
 add column if not exists pass_email_message_id text,
 add column if not exists pass_email_error text;
-- Existing RLS only allows admins to SELECT; service_role performs all writes.
comment on column public.event_registrations.pass_email_status is 'SMTP acceptance status, not attendance or inbox delivery. Ambiguous sends require manual review before retry.';
commit;
