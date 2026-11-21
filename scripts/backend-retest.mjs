import fs from 'node:fs/promises';
const parse = text => Object.fromEntries(text.split('\n').filter(line=>line&&!line.startsWith('#')).map(line=>{const i=line.indexOf('=');return[line.slice(0,i),line.slice(i+1).trim()];}));
const env=parse(await fs.readFile('.env.local','utf8'));const base=env.VITE_SUPABASE_URL;const key=env.VITE_SUPABASE_PUBLISHABLE_KEY;
const headers={apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Origin:'http://127.0.0.1:5181'};
const eventId='2848a8e8-23a2-4298-bc5a-6e15faac1388',pastId='90c39ca3-1ee1-44a9-b7aa-b527ad37935f',draftId='68933cab-ac16-482d-99ba-34d07ded53a1';
const submissionId='2b066cdc-990e-4312-b184-3e44d412ac0b';
const checks=[];
async function request(path,options={}){try{const r=await fetch(base+path,{...options,headers:{...headers,...options.headers},signal:AbortSignal.timeout(25000)});const raw=await r.text();let data;try{data=JSON.parse(raw);}catch{data=null;}return{status:r.status,data};}catch(e){return{status:0,error:e.name};}}
async function check(name,path,options,expected){const result=await request(path,options);const pass=expected(result);checks.push({name,pass,status:result.status,...(!pass?{response:result.data||result.error}:{})});console.log(JSON.stringify(checks.at(-1)));return result;}
const post=body=>({method:'POST',body:JSON.stringify(body)});
const event={action:'register',eventId,name:'BACKEND QA Student',email:'backend-qa-20261120@example.test',phone:'+91 00000 00000',institution:'QA College',city:'QA City',consent:true};
const query={action:'submit',submissionId,name:'BACKEND QA Visitor',email:'backend-qa-20261120@example.test',phone:'',topic:'Other',message:'=1+1\nDisposable backend verification. No response needed.',consent:true};
await check('published content readable','/rest/v1/site_content?select=kind&published=eq.true',{},r=>r.status===200&&r.data.length>0);
await check('anonymous is not admin','/rest/v1/rpc/is_site_admin',post({}),r=>r.status===200&&r.data===false);
for(const table of ['event_registrations','event_registration_sheets','contact_queries','contact_query_sheet'])await check(`anonymous denied ${table}`,`/rest/v1/${table}?select=*`,{},r=>[401,403].includes(r.status));
await check('draft hidden',`/rest/v1/site_content?id=eq.${draftId}&select=id`,{},r=>r.status===200&&r.data.length===0);
await check('anonymous content insert denied','/rest/v1/site_content',{...post({kind:'team',content:{name:'BACKEND QA denied',role:'QA'}}),headers:{Prefer:'return=representation'}},r=>[401,403].includes(r.status));
for(const method of ['PATCH','DELETE'])await check(`anonymous ${method} denied`,`/rest/v1/site_content?id=eq.${eventId}`,{method,headers:{Prefer:'return=representation'},...(method==='PATCH'?{body:JSON.stringify({published:false})}:{})},r=>[401,403].includes(r.status)||(r.status===200&&r.data.length===0));
await check('wrong password rejected','/auth/v1/token?grant_type=password',post({email:'backend-qa-nonexistent@example.test',password:crypto.randomUUID()}),r=>r.status===400);
for(const fn of ['event-registration','contact-query'])await check(`${fn} anonymous sync denied`,`/functions/v1/${fn}`,post({action:'sync',eventId}),r=>r.status===401);
await check('anonymous media upload denied','/functions/v1/drive-upload',post({}),r=>r.status===401);
await check('invalid signed media URL denied','/functions/v1/drive-media?id=qa_invalid_file_123456&token='+'0'.repeat(64),{headers:{Origin:'http://127.0.0.1:5181'}},r=>r.status===403);
await check('unapproved origin denied','/functions/v1/contact-query',{...post(query),headers:{Origin:'https://unapproved.example.test'}},r=>r.status===403);
for(const [label,changes] of [['invalid email',{email:'invalid'}],['missing consent',{consent:false}],['oversize field',{name:'x'.repeat(101)}]])await check(`event ${label}`,'/functions/v1/event-registration',post({...event,...changes}),r=>r.status===400);
await check('event registration saved','/functions/v1/event-registration',post(event),r=>r.status===200&&r.data.success===true);
await check('event duplicate retry accepted','/functions/v1/event-registration',post(event),r=>r.status===200&&r.data.success===true);
for(const [label,id] of [['past',pastId],['draft',draftId]])await check(`${label} event registration rejected`,'/functions/v1/event-registration',post({...event,eventId:id}),r=>r.status===400&&/closed/.test(r.data?.error));
for(const [label,changes] of [['invalid topic',{topic:'invalid'}],['missing consent',{consent:false}],['invalid email',{email:'invalid'}]])await check(`contact ${label}`,'/functions/v1/contact-query',post({...query,...changes}),r=>r.status===400);
await check('contact query saved','/functions/v1/contact-query',post(query),r=>r.status===200&&r.data.success===true);
await check('contact duplicate retry accepted','/functions/v1/contact-query',post(query),r=>r.status===200&&r.data.success===true);
await check('oversized request rejected','/functions/v1/contact-query',post({...query,message:'x'.repeat(17000)}),r=>r.status===400);
const content=await request('/rest/v1/site_content?kind=eq.partners&select=content&published=eq.true');
const uploaded=content.data?.find(row=>row.content.image?.includes('/functions/v1/drive-media?'))?.content.image;
if(uploaded){const result=await fetch(uploaded,{signal:AbortSignal.timeout(25000)});await result.body?.cancel();checks.push({name:'existing Drive image delivery',pass:result.status===200,status:result.status});console.log(JSON.stringify(checks.at(-1)));}
await fs.mkdir('artifacts/backend-retest',{recursive:true});await fs.writeFile('artifacts/backend-retest/public-api.json',JSON.stringify({checkedAt:new Date().toISOString(),eventId,pastId,draftId,submissionId,checks},null,2));
console.log(JSON.stringify({passed:checks.filter(c=>c.pass).length,total:checks.length}));
if(checks.some(c=>!c.pass))process.exitCode=1;
