begin;
create temporary table qa_validation(test text,passed boolean) on commit drop;
do $$ declare n int; begin
 begin insert into public.site_content(kind,content) values('partners','{"name":"QA","image":"https://example.com/logo.png","website":"javascript:alert(1)"}'); raise exception 'Unsafe partner URL accepted'; exception when check_violation then insert into qa_validation values('database_rejects_unsafe_partner_url',true); end;
 begin insert into public.site_content(kind,content) values('team','{"name":""}'); raise exception 'Invalid team accepted'; exception when check_violation then insert into qa_validation values('database_rejects_missing_team_fields',true); end;
 begin insert into public.site_content(kind,content,sort_order) values('team','{"name":"QA","role":"QA"}',10000); raise exception 'Invalid order accepted'; exception when check_violation then insert into qa_validation values('database_rejects_invalid_order',true); end;
 insert into public.site_content(kind,content,published) values('gallery','{"title":"BACKEND QA Podcast","mediaType":"podcast","youtubeUrl":"https://www.youtube.com/watch?v=aXEV3fDGkUI"}',false);
 insert into qa_validation values('valid_podcast_database_save',true);
 for n in 1..11 loop
  if public.consume_registration_limit('backend-qa-20261120-transaction') <> (n<=10) then raise exception 'Rate limit failed at %',n; end if;
 end loop;
 insert into qa_validation values('rate_limit_ten_allowed_eleventh_denied',true);
end $$;
select json_agg(qa_validation) as checks from qa_validation;
rollback;
