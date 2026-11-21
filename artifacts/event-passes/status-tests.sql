begin;
create temp table pass_qa_results(name text,passed boolean);
do $$
declare e uuid; r uuid; n integer;
begin
 select id into e from public.site_content where kind='events' order by created_at limit 1;
 insert into public.event_registrations(event_id,name,email,phone,institution,city) values(e,'Event pass transactional QA','event-pass-transaction@example.test','0000000000','QA College','QA City') returning id into r;
 update public.event_registrations set pass_email_status='sending',pass_email_started_at=now() where id=r and pass_email_status='not_sent' and pass_email_sent_at is null;
 get diagnostics n=row_count;insert into pass_qa_results values('first sender claims registration',n=1);
 update public.event_registrations set pass_email_status='sending' where id=r and pass_email_status='not_sent' and pass_email_sent_at is null;
 get diagnostics n=row_count;insert into pass_qa_results values('concurrent duplicate blocked',n=0);
 update public.event_registrations set pass_email_status='sent',pass_email_sent_at=now() where id=r;
 update public.event_registrations set pass_email_status='sending' where id=r and pass_email_status in ('not_sent','failed') and pass_email_sent_at is null;
 get diagnostics n=row_count;insert into pass_qa_results values('already sent registration cannot be claimed again',n=0);
end $$;
select * from pass_qa_results;
rollback;
