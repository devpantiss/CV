// One-time send-only Gmail OAuth connection. Credentials are never printed.
import { readFile, writeFile, chmod } from 'node:fs/promises';
import { createServer } from 'node:http';
import { randomBytes, timingSafeEqual, createHash } from 'node:crypto';
const parse = source => Object.fromEntries(source.split('\n').map(line=>line.trim()).filter(line=>line&&!line.startsWith('#')).map(line=>{const i=line.indexOf('=');if(i<1)throw Error('Invalid private configuration.');return[line.slice(0,i),line.slice(i+1).replace(/^['"]|['"]$/g,'')];}));
const config=parse(await readFile('.google-drive-client.local','utf8'));
const sender='info@thecareervalley.com';
if(!config.GOOGLE_CLIENT_ID||!config.GOOGLE_CLIENT_SECRET)throw Error('The local Google OAuth client is not configured.');
const redirect='http://127.0.0.1:8765/callback';
const state=randomBytes(32).toString('hex'), verifier=randomBytes(48).toString('base64url');
const url=new URL('https://accounts.google.com/o/oauth2/v2/auth');
url.search=new URLSearchParams({client_id:config.GOOGLE_CLIENT_ID,redirect_uri:redirect,response_type:'code',scope:'openid email https://www.googleapis.com/auth/gmail.send',access_type:'offline',prompt:'consent select_account',login_hint:sender,state,code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256'}).toString();
let processing=false,complete=false;
const server=createServer(async(request,response)=>{
 response.setHeader('Cache-Control','no-store');response.setHeader('Referrer-Policy','no-referrer');
 const incoming=new URL(request.url,'http://127.0.0.1:8765');const check=Buffer.from(incoming.searchParams.get('state')||'');
 if(request.method!=='GET'||incoming.pathname!=='/callback'||check.length!==state.length||!timingSafeEqual(check,Buffer.from(state))||processing||complete){response.writeHead(400);response.end('Invalid connection request. Restart the helper and use the new sign-in link.');return;}
 if(incoming.searchParams.has('error')){response.writeHead(400);response.end('Google sign-in was not approved. Your Workspace administrator may need to allow this app.');return;}
 const code=incoming.searchParams.get('code');if(!code){response.writeHead(400);response.end('Missing Google authorization.');return;}
 processing=true;
 try {
  const tokenResponse=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code,client_id:config.GOOGLE_CLIENT_ID,client_secret:config.GOOGLE_CLIENT_SECRET,redirect_uri:redirect,grant_type:'authorization_code',code_verifier:verifier}),signal:AbortSignal.timeout(20000)});
  const token=await tokenResponse.json();if(!tokenResponse.ok||!token.refresh_token||!token.scope?.split(' ').includes('https://www.googleapis.com/auth/gmail.send'))throw Error('Google did not grant offline Gmail sending access. Restart the helper and complete consent.');
  const identityResponse=await fetch('https://openidconnect.googleapis.com/v1/userinfo',{headers:{Authorization:`Bearer ${token.access_token}`},signal:AbortSignal.timeout(15000)});
  const identity=await identityResponse.json();if(!identityResponse.ok||!identity.email_verified||identity.email?.toLowerCase()!==sender)throw Error('Please connect the info@thecareervalley.com mailbox itself. The selected Google account does not match the sender.');
  const secrets={GMAIL_SENDER_EMAIL:sender,GMAIL_CLIENT_ID:config.GOOGLE_CLIENT_ID,GMAIL_CLIENT_SECRET:config.GOOGLE_CLIENT_SECRET,GMAIL_REFRESH_TOKEN:token.refresh_token};
  if(Object.values(secrets).some(value=>/[\r\n]/.test(value)))throw Error('Invalid Google connection data.');
  await writeFile('.gmail-secrets.local',Object.entries(secrets).map(([key,value])=>`${key}=${value}`).join('\n')+'\n',{mode:0o600});await chmod('.gmail-secrets.local',0o600);
  complete=true;response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});response.end('<h1>Gmail connected</h1><p>info@thecareervalley.com is connected for sending event confirmations. Private deployment secrets were saved to .gmail-secrets.local. No email has been sent. You may close this tab.</p>');
  console.log('Gmail connected. Private secrets saved to .gmail-secrets.local. No email sent.');server.close();clearTimeout(expiry);
 }catch(error){processing=false;response.writeHead(400,{'Content-Type':'text/plain; charset=utf-8'});response.end(error.message||'Google connection failed. Restart the helper to retry.');console.error(error.message);}
});
const expiry=setTimeout(()=>{server.close();console.error('Gmail connection timed out. Restart the helper for a new link.');},15*60*1000);
server.on('error',()=>{clearTimeout(expiry);console.error('Cannot start the callback. Check that port 8765 is free.');process.exitCode=1;});
server.listen(8765,'127.0.0.1',async()=>{await writeFile('/tmp/cv-gmail-auth-url',url.href,{mode:0o600});console.log('Google sign-in link ready in /tmp/cv-gmail-auth-url. Sign in as info@thecareervalley.com and approve send-only Gmail access.');});
