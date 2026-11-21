import fs from 'node:fs/promises';
const env = Object.fromEntries((await fs.readFile('.env.local','utf8')).split('\n').filter(line => line && !line.startsWith('#')).map(line => { const index=line.indexOf('='); return [line.slice(0,index),line.slice(index+1).trim()]; }));
const base=env.VITE_SUPABASE_URL; const key=env.VITE_SUPABASE_PUBLISHABLE_KEY;
const eventId=process.argv[2]; if (!eventId) throw new Error('Pass a disposable event UUID.');
const headers={apikey:key, Authorization:`Bearer ${key}`, 'Content-Type':'application/json', Origin:'http://127.0.0.1:5181'};
const body={ action:'register', eventId, name:'Integration Test Student', email:process.argv[3] || 'registration-test@example.test', phone:'+91 00000 00000', institution:'Integration Test College', city:'Test City', consent:true };
async function call(data){const response=await fetch(`${base}/functions/v1/event-registration`,{method:'POST',headers,body:JSON.stringify(data)});return {status:response.status,...await response.json()};}
const first=await call(body);const duplicate=await call(body);const invalid=await call({...body,email:'invalid'});const sync=await call({action:'sync',eventId});
const read=await fetch(`${base}/rest/v1/event_registrations?select=id`,{headers});
const report={registration:first,duplicate,invalid,syncWithoutAdmin:sync,anonymousReadStatus:read.status};
await fs.mkdir('artifacts/event-registration',{recursive:true});await fs.writeFile('artifacts/event-registration/api-check.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
if(first.success!==true||duplicate.success!==true||invalid.status!==400||sync.status!==401||read.ok)process.exitCode=1;
