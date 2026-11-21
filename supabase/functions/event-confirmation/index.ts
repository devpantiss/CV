import { createClient } from 'npm:@supabase/supabase-js@2.118.0';
import { Buffer } from 'node:buffer';
import nodemailer from 'npm:nodemailer@10.6.1';
import { PDFDocument, rgb } from 'npm:pdf-lib@1.17.1';
import fontkit from 'npm:@pdf-lib/fontkit@1.1.1';
import { cors } from '../_shared/drive.ts';
import { eventPassDetails, confirmationEmail, createEventPassPdf, smtpFailureStatus, gmailApiFailureStatus } from '../_shared/eventPass.js';
import { passFontBase64 } from './font.js';
import { passLogoBase64, passPhotoBase64 } from './artwork.js';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const service = () => createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const credentials = () => ({ user: (Deno.env.get('GMAIL_SENDER_EMAIL') || Deno.env.get('GMAIL_SMTP_USER'))?.trim() || '', pass: Deno.env.get('GMAIL_SMTP_APP_PASSWORD')?.replace(/\s/g, '') || '', clientId: Deno.env.get('GMAIL_CLIENT_ID') || '', clientSecret: Deno.env.get('GMAIL_CLIENT_SECRET') || '', refreshToken: Deno.env.get('GMAIL_REFRESH_TOKEN') || '' });
const oauthConfigured = () => { const c=credentials(); return Boolean(c.clientId&&c.clientSecret&&c.refreshToken); };
const configured = () => { const { user, pass } = credentials(); return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(user) && (oauthConfigured() || pass.length === 16); };
let cachedGmailToken='', gmailTokenExpiry=0;
async function gmailAccessToken() {
  if(cachedGmailToken&&Date.now()<gmailTokenExpiry)return cachedGmailToken;
  const c=credentials();
  const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:c.clientId,client_secret:c.clientSecret,refresh_token:c.refreshToken,grant_type:'refresh_token'}),signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('Reconnect the Workspace Gmail account with Google sign-in.');
  const token=await response.json();if(!token.access_token)throw Error('Google returned an incomplete mail connection.');
  cachedGmailToken=token.access_token;gmailTokenExpiry=Date.now()+Math.max(0,(Number(token.expires_in)-60))*1000;return cachedGmailToken;
}
const bytesToBase64 = (bytes: Uint8Array) => { let binary=''; for(let i=0;i<bytes.length;i+=8192) binary+=String.fromCharCode(...bytes.subarray(i,i+8192)); return btoa(binary); };
const logoBytes = Uint8Array.from(atob(passLogoBase64), c => c.charCodeAt(0));
const photoBytes = Uint8Array.from(atob(passPhotoBase64), c => c.charCodeAt(0));
const fontBytes = Uint8Array.from(atob(passFontBase64), character => character.charCodeAt(0));
Deno.serve(async request => {
  let headers: Record<string,string> = {};
  try {
    const allowed = cors(request); if(!allowed) return new Response('Forbidden',{status:403});
    headers = { ...allowed, 'Content-Type':'application/json' };
    if(request.method === 'OPTIONS') return new Response(null,{headers});
    if(request.method !== 'POST') return Response.json({error:'Method not allowed'},{status:405,headers});
    const userClient = createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_ANON_KEY')!,{global:{headers:{Authorization:request.headers.get('authorization') || ''}},auth:{persistSession:false}});
    const {data:identity,error:identityError}=await userClient.auth.getUser();
    if(identityError||!identity.user) return Response.json({error:'Sign in as an administrator.'},{status:401,headers});
    const {data:admin,error:adminError}=await userClient.rpc('is_site_admin');
    if(adminError||!admin) return Response.json({error:'Administrator access required.'},{status:403,headers});
    const reader=request.body?.getReader(); if(!reader) throw Error('Missing request.');
    let body='',size=0; const decoder=new TextDecoder();
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2048){await reader.cancel();throw Error('Request too large.');}body+=decoder.decode(value,{stream:true});}
    body+=decoder.decode();const input=JSON.parse(body);
    if(!input||Array.isArray(input)||typeof input!=='object')throw Error('Invalid request.');
    if(input.action==='status')return Response.json({ready:configured(),provider:oauthConfigured()?'gmail-api':'gmail-smtp'},{headers});
    if(!['send','preview','resolve'].includes(input.action)||!uuid.test(input.eventId||'')||!uuid.test(input.registrationId||''))throw Error('Invalid event or registration.');
    const client=service();
    const [{data:event,error:eventError},{data:registration,error:registrationError}]=await Promise.all([
      client.from('site_content').select('id,content').eq('id',input.eventId).eq('kind','events').maybeSingle(),
      client.from('event_registrations').select('*').eq('id',input.registrationId).eq('event_id',input.eventId).maybeSingle(),
    ]);
    if(eventError||registrationError)throw Error('Unable to load event registration.');
    if(!event||!registration)return Response.json({error:'Registration not found for this event.'},{status:404,headers});
    if(input.action==='resolve') {
      const stale=registration.pass_email_status==='sending'&&Date.now()-new Date(registration.pass_email_started_at).getTime()>300000;
      if(!(registration.pass_email_status==='review'||stale)||!['sent','not_sent'].includes(input.resolution))throw Error('This email does not need manual review.');
      const patch=input.resolution==='sent'?{pass_email_status:'sent',pass_email_sent_at:new Date().toISOString(),pass_email_error:null}:{pass_email_status:'failed',pass_email_error:'Administrator checked Gmail Sent and confirmed no email was sent.'};
      const {error}=await client.from('event_registrations').update(patch).eq('id',registration.id).eq('pass_email_status',registration.pass_email_status);
      if(error)throw Error('Unable to save the review.');
      return Response.json({success:true},{headers});
    }
    if(input.action==='send'&&registration.pass_email_status==='sent')return Response.json({success:true,alreadySent:true},{headers});
    if(input.action==='send'&&['sending','review'].includes(registration.pass_email_status))return Response.json({error:'This send is in progress or needs review. Check the sender’s Gmail Sent folder before retrying.'},{status:409,headers});
    if(input.action==='send'&&!configured())return Response.json({error:'Gmail sending is not configured. Connect the Workspace sender with Google sign-in or configure Gmail SMTP credentials.'},{status:503,headers});
    const details=eventPassDetails(event.content,registration);
    const pdf=await createEventPassPdf(details,{PDFDocument,rgb,fontkit,fontBytes,logoBytes,photoBytes});
    const filename=`Career-Valley-Pass-${registration.id}.pdf`;
    if(input.action==='preview')return Response.json({pdf:bytesToBase64(pdf),filename},{headers});
    const {user,pass}=credentials();
    const useGmailApi=oauthConfigured();
    const mailToken=useGmailApi?await gmailAccessToken():null;
    const messageId=`<event-pass.${registration.id}@${user.split('@')[1]}>`;
    const {data:claimed,error:claimError}=await client.from('event_registrations').update({pass_email_status:'sending',pass_email_started_at:new Date().toISOString(),pass_email_message_id:messageId,pass_email_error:null}).eq('id',registration.id).eq('pass_email_status',registration.pass_email_status).is('pass_email_sent_at',null).select('id').maybeSingle();
    if(claimError)throw Error('Unable to start the email.');
    if(!claimed)return Response.json({error:'Another send is running. Refresh the list.'},{status:409,headers});
    const transport=nodemailer.createTransport(useGmailApi?{streamTransport:true,buffer:true,newline:'unix'}:{host:'smtp.gmail.com',port:465,secure:true,auth:{user,pass},connectionTimeout:15000,greetingTimeout:10000,socketTimeout:30000,logger:false,debug:false});
    try {
      const email=confirmationEmail(details);
      const result=await transport.sendMail({from:{name:'The Career Valley',address:user},to:[registration.email],replyTo:user,messageId,...email,attachments:[{filename,content:Buffer.from(pdf),contentType:'application/pdf'}],disableFileAccess:true,disableUrlAccess:true});
      if(useGmailApi) {
        const response=await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send',{method:'POST',headers:{Authorization:`Bearer ${mailToken}`,'Content-Type':'application/json'},body:JSON.stringify({raw:Buffer.from(result.message).toString('base64url')}),signal:AbortSignal.timeout(30000)});
        if(!response.ok)throw Object.assign(Error('Gmail API rejected the message.'),{gmailStatus:response.status});
      } else if(!result.accepted?.length)throw Object.assign(Error('Gmail rejected this recipient.'),{code:'EENVELOPE'});
    } catch(error) {
      const status=useGmailApi?gmailApiFailureStatus(error.gmailStatus):smtpFailureStatus(error);
      const message=status==='review'?'Delivery result is uncertain. Check the sender’s Gmail Sent folder before retrying.':'Gmail rejected the send. Check the Google connection, Gmail API access, recipient address, and sending limits before retrying.';
      await client.from('event_registrations').update({pass_email_status:status,pass_email_error:message}).eq('id',registration.id).eq('pass_email_status','sending');
      return Response.json({error:message,status},{status:502,headers});
    } finally { transport.close(); }
    const {error:markError}=await client.from('event_registrations').update({pass_email_status:'sent',pass_email_sent_at:new Date().toISOString(),pass_email_error:null}).eq('id',registration.id).eq('pass_email_status','sending');
    return Response.json({success:true,statusPending:Boolean(markError),message:markError?'Gmail accepted the email; the saved status needs review. Do not resend.':'Confirmation and PDF pass accepted by Gmail.'},{headers});
  } catch(error) {
    return Response.json({error:error instanceof SyntaxError?'Invalid request.':error instanceof Error?error.message:'Unable to prepare the confirmation.'},{status:400,headers});
  }
});
