// Disposable, fictional sheet data only; credentials never leave server-side requests.
import fs from 'node:fs/promises';
const parse = text => Object.fromEntries(text.trim().split('\n').map(line => { const i=line.indexOf('='); return [line.slice(0,i),line.slice(i+1)]; }));
const env=parse(await fs.readFile('.drive-secrets.local','utf8'));
let id;let token;const checks={};
try {
 const auth=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:env.GOOGLE_CLIENT_ID,client_secret:env.GOOGLE_CLIENT_SECRET,refresh_token:env.GOOGLE_REFRESH_TOKEN,grant_type:'refresh_token'})});
 if(!auth.ok)throw new Error('Google authorization refresh failed.');token=(await auth.json()).access_token;
 const headers={Authorization:`Bearer ${token}`,'Content-Type':'application/json'};
 const create=await fetch('https://www.googleapis.com/drive/v3/files?fields=id',{method:'POST',headers,body:JSON.stringify({name:'Career Valley disposable Sheets verification',mimeType:'application/vnd.google-apps.spreadsheet',parents:[env.GOOGLE_DRIVE_FOLDER_ID]})});
 if(!create.ok)throw new Error('Test sheet creation failed.');id=(await create.json()).id;
 const write=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/A1:B2?valueInputOption=RAW`,{method:'PUT',headers,body:JSON.stringify({values:[['Test','Literal text'],['Fictional student','=1+1']]})});checks.writeStatus=write.status;
 if(!write.ok){const detail=await write.json();checks.reason=detail.error?.details?.find(d=>d.reason)?.reason || detail.error?.status;throw new Error('Sheets API is not available yet. Enable Google Sheets API in the same Cloud project.');}
 const read=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/A1:B2?valueRenderOption=UNFORMATTED_VALUE`,{headers});const data=await read.json();checks.rawTextPreserved=data.values?.[1]?.[1]==='=1+1';checks.passed=read.ok&&checks.rawTextPreserved;
} catch(error){checks.passed=false;checks.error=error.message;process.exitCode=1;}
finally {if(id&&token){const result=await fetch(`https://www.googleapis.com/drive/v3/files/${id}`,{method:'PATCH',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({trashed:true})});checks.testSheetMovedToTrash=result.ok;}await fs.writeFile('artifacts/event-registration/sheets-check.json',JSON.stringify(checks,null,2));console.log(JSON.stringify(checks));}
