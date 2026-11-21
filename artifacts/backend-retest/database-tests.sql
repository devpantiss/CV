begin;
create temporary table qa_results(test text,passed boolean) on commit drop;
grant all on qa_results to anon,authenticated;
select set_config('request.jwt.claim.sub',(select id::text from auth.users where email='dev.careervalley@gmail.com'),true);
set local role authenticated;
insert into qa_results values('allowlisted_admin',public.is_site_admin());
insert into public.site_content(kind,content,published,sort_order) values
('events','{"title":"BACKEND QA Event","date":"2099-01-01","location":"QA City","desc":"Disposable transactional test","image":"https://example.com/qa.png"}',false,9999),
('team','{"name":"BACKEND QA Team","role":"QA","bio":"QA","image":"https://example.com/qa.png","photo":"https://example.com/qa.png"}',false,9999),
('testimonials','{"name":"BACKEND QA Testimonial","stage":"QA","challenge":"QA","support":"QA","result":"QA","image":"https://example.com/qa.png"}',false,9999),
('partners','{"name":"BACKEND QA Partner","image":"https://example.com/qa.png","website":"https://example.com"}',false,9999),
('gallery','{"title":"BACKEND QA Gallery","mediaType":"image","url":"https://example.com/qa.png"}',false,9999);
insert into qa_results select 'admin_reads_five_drafts',count(*)=5 from public.site_content where sort_order=9999 and coalesce(content->>'name',content->>'title') like 'BACKEND QA%';
update public.site_content set published=true where sort_order=9999 and coalesce(content->>'name',content->>'title') like 'BACKEND QA%';
set local role anon;
select set_config('request.jwt.claim.sub','',true);
insert into qa_results select 'anonymous_reads_published',count(*)=5 from public.site_content where sort_order=9999 and coalesce(content->>'name',content->>'title') like 'BACKEND QA%';
insert into qa_results values('anonymous_not_admin',not public.is_site_admin());
do $$ begin
 begin insert into public.site_content(kind,content) values('team','{"name":"QA denied","role":"QA"}'); raise exception 'Anonymous write unexpectedly allowed'; exception when insufficient_privilege then insert into qa_results values('anonymous_insert_denied',true); end;
end $$;
reset role;
select set_config('request.jwt.claim.sub',(select id::text from auth.users where email='dev.careervalley@gmail.com'),true);
set local role authenticated;
update public.site_content set published=false where sort_order=9999 and coalesce(content->>'name',content->>'title') like 'BACKEND QA%';
set local role anon;
select set_config('request.jwt.claim.sub','',true);
insert into qa_results select 'anonymous_cannot_read_drafts',count(*)=0 from public.site_content where sort_order=9999 and coalesce(content->>'name',content->>'title') like 'BACKEND QA%';
set local role authenticated;
insert into qa_results values('authenticated_nonadmin_not_admin',not public.is_site_admin());
insert into qa_results select 'nonadmin_cannot_read_drafts',count(*)=0 from public.site_content where sort_order=9999 and coalesce(content->>'name',content->>'title') like 'BACKEND QA%';
insert into qa_results select 'nonadmin_cannot_read_registrations',count(*)=0 from public.event_registrations;
insert into qa_results select 'nonadmin_cannot_read_queries',count(*)=0 from public.contact_queries;
do $$ begin
 begin insert into public.site_content(kind,content) values('team','{"name":"QA denied","role":"QA"}'); raise exception 'Nonadmin write unexpectedly allowed'; exception when insufficient_privilege then insert into qa_results values('nonadmin_insert_denied',true); end;
 begin insert into public.event_registrations(event_id,name,email,phone,institution,city) values(gen_random_uuid(),'QA','qa@example.test','0000000000','QA','QA'); raise exception 'Client registration insert unexpectedly allowed'; exception when insufficient_privilege then insert into qa_results values('direct_registration_insert_denied',true); end;
end $$;
reset role;
select set_config('request.jwt.claim.sub',(select id::text from auth.users where email='dev.careervalley@gmail.com'),true);
set local role authenticated;
with removed as(delete from public.site_content where sort_order=9999 and coalesce(content->>'name',content->>'title') like 'BACKEND QA%' returning id) insert into qa_results select 'admin_delete_five_types',count(*)=5 from removed;
reset role;
select json_agg(qa_results) as checks from qa_results;
rollback;
