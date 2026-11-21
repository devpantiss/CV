import fs from 'node:fs/promises';
const env=Object.fromEntries((await fs.readFile('.env.local','utf8')).trim().split('\n').map(line=>{const i=line.indexOf('=');return[line.slice(0,i),line.slice(i+1)];}));
const submissionId=process.argv[2]||crypto.randomUUID();
const headers={'Content-Type':'application/json',apikey:env.VITE_SUPABASE_PUBLISHABLE_KEY,Authorization:`Bearer ${env.VITE_SUPABASE_PUBLISHABLE_KEY}`,Origin:'http://127.0.0.1:5181'};
const body={action:'submit',submissionId,name:'Contact API Test',email:'contact-api-test@example.test',phone:'',topic:'Other',message:'Temporary API verification. Please ignore.',consent:true};
async function call(body){const res=await fetch(`${env.VITE_SUPABASE_URL}/functions/v1/contact-query`,{method:'POST',headers,body:JSON.stringify(body)});return {status:res.status,...await res.json()};}
const report={submissionId,submission:await call(body),duplicate:await call(body),invalid:await call({...body,email:'invalid'}),anonymousSync:await call({action:'sync'})};
const read=await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/contact_queries?select=id`,{headers});report.anonymousReadStatus=read.status;
await fs.mkdir('artifacts/contact-query',{recursive:true});await fs.writeFile('artifacts/contact-query/api-check.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
if(!report.submission.success||!report.duplicate.success||report.invalid.status!==400||report.anonymousSync.status!==401||read.ok)process.exitCode=1;
