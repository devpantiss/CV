import fs from 'node:fs/promises';
const env=Object.fromEntries((await fs.readFile('.env.local','utf8')).split('\n').filter(line=>line.includes('=')).map(line=>{const i=line.indexOf('=');return[line.slice(0,i),line.slice(i+1).trim()];}));
const url=env.VITE_SUPABASE_URL+'/functions/v1/event-confirmation';
const results=[];
for(const [name,headers,expected] of [
 ['anonymous send blocked',{Origin:'http://127.0.0.1:5181'},401],
 ['publishable key cannot send',{Origin:'http://127.0.0.1:5181',Authorization:`Bearer ${env.VITE_SUPABASE_PUBLISHABLE_KEY}`},401],
 ['unapproved origin blocked',{Origin:'https://unapproved.example.test'},403],
]) {
 const response=await fetch(url,{method:'POST',headers:{apikey:env.VITE_SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json',...headers},body:JSON.stringify({action:'send',eventId:'12345678-1234-4234-8234-123456789abc',registrationId:'12345678-1234-4234-8234-123456789abc'}),signal:AbortSignal.timeout(25000)});
 const raw=await response.text();results.push({name,status:response.status,passed:response.status===expected,...(response.status!==expected?{response:raw.slice(0,200)}:{})});
}
await fs.writeFile('artifacts/event-passes/endpoint-checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));if(results.some(r=>!r.passed))process.exitCode=1;
