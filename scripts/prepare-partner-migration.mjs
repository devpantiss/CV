import fs from 'node:fs/promises';
import { partnerDefaults } from '../src/features/partners/defaults.js';
const ddl=`alter table public.site_content drop constraint site_content_kind_check;
alter table public.site_content add constraint site_content_kind_check check(kind in ('events','team','testimonials','gallery','partners'));
do $$ declare previous text; begin
 select pg_get_constraintdef(oid) into previous from pg_constraint where conrelid='public.site_content'::regclass and conname='content_required_fields';
 if previous is null then raise exception 'Existing content validation constraint not found'; end if;
 alter table public.site_content drop constraint content_required_fields;
 execute 'alter table public.site_content add constraint content_required_fields ' || replace(previous,'CHECK (','CHECK (kind = ''partners'' OR ');
end $$;
alter table public.site_content add constraint partner_required_fields check(kind <> 'partners' or coalesce(
 length(trim(content->>'name')) between 1 and 200 and
 length(trim(content->>'image')) > 0 and
 ((content->>'image') ~ '^https://' or (content->>'image') in ('/affiliates/affiliates-sheet-1.jpeg','/affiliates/affiliates-sheet-2.jpeg')) and
 (coalesce(content->>'website','')='' or (content->>'website') ~ '^https://') and
 (not(content ? 'logoPosition') or (content->>'logoPosition') ~ '^[0-9.]+% [0-9.]+%$'),false));
`;
const seed=partnerDefaults.map((partner,index)=>`insert into public.site_content(kind,content,published,sort_order) select 'partners','${JSON.stringify(partner).replaceAll("'","''")}'::jsonb,true,${index} where not exists(select 1 from public.site_content where kind='partners' and content->>'name'='${partner.name.replaceAll("'","''")}');`).join('\n');
await fs.writeFile('supabase/partner-colleges.sql',ddl+seed+'\n');
