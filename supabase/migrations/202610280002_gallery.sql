-- Run after 202610280001_content_studio.sql when connecting Supabase.
begin;
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
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media','site-media',true,52428800,array['image/jpeg','image/png','image/webp','image/gif','image/avif','video/mp4','video/webm','video/quicktime','audio/mpeg','audio/wav','audio/x-wav','audio/ogg','audio/mp4','audio/x-m4a','audio/webm','audio/aac','audio/flac']);
create policy "Public gallery media" on storage.objects for select to anon, authenticated using (bucket_id = 'site-media');
create policy "Admins upload gallery media" on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and public.is_site_admin() and (storage.foldername(name))[1] = 'gallery');
create policy "Admins delete gallery media" on storage.objects for delete to authenticated using (bucket_id = 'site-media' and public.is_site_admin());
commit;
