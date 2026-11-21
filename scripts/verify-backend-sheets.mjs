import fs from 'node:fs/promises';
const parse=text=>Object.fromEntries(text.trim().split('\n').map(line=>{const i=line.indexOf('=');return[line.slice(0,i),line.slice(i+1)];}));
const env=parse(await fs.readFile('.drive-secrets.local','utf8'));
const eventSheet=process.argv[2];const contactSheet='1JakiYbnJJdB-EHj4-H7taPt7nDImxwNLzB4qhv4RUEU';
const auth=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:env.GOOGLE_CLIENT_ID,client_secret:env.GOOGLE_CLIENT_SECRET,refresh_token:env.GOOGLE_REFRESH_TOKEN,grant_type:'refresh_token'})});
if(!auth.ok)throw new Error('Google authorization failed.');const token=(await auth.json()).access_token;const headers={Authorization:`Bearer ${token}`,'Content-Type':'application/json'};
const checks=[];
for(const [kind,id] of [['contact',contactSheet],...(eventSheet?[['event',eventSheet]]:[])]){
 const meta=await fetch(`https://www.googleapis.com/drive/v3/files/${id}?fields=appProperties,parents,permissions(type,role)`,{headers});if(!meta.ok)throw new Error('Unable to verify spreadsheet metadata.');const file=await meta.json();
 const belongs=file.parents?.includes(env.GOOGLE_DRIVE_FOLDER_ID)&&(kind==='contact'?file.appProperties?.career_valley_collection==='contact_queries':file.appProperties?.career_valley_event==='2848a8e8-23a2-4298-bc5a-6e15faac1388');
 if(!belongs)throw new Error('Unexpected spreadsheet ownership.');
 const read=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/A1:I1000`,{headers});if(!read.ok)throw new Error('Unable to read spreadsheet.');const rows=(await read.json()).values||[];
 const emailIndex=kind==='contact'?2:3;const matching=rows.filter(row=>row[emailIndex]==='backend-qa-20261120@example.test');
 const check={kind,qaRowCount:matching.length,oneRowOnly:matching.length===1,private:!!file.permissions?.length&&!file.permissions.some(p=>p.type==='anyone'||p.type==='domain')};
 if(kind==='contact'){
  const grid=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}?includeGridData=true&ranges=A1:H1000&fields=sheets(data(rowData(values(userEnteredValue))))`,{headers});
  if(!grid.ok)throw new Error('Unable to inspect literal spreadsheet cells.');const values=(await grid.json()).sheets[0].data[0].rowData||[];
  check.formulaInputStoredAsText=values.some(row=>row.values?.[2]?.userEnteredValue?.stringValue==='backend-qa-20261120@example.test'&&row.values?.[5]?.userEnteredValue?.stringValue?.startsWith('=1+1\n')&&!row.values[5].userEnteredValue.formulaValue);
 }
 checks.push(check);
}
await fs.writeFile('artifacts/backend-retest/sheets.json',JSON.stringify(checks,null,2));console.log(JSON.stringify(checks));
if(checks.some(c=>!c.oneRowOnly||!c.private||c.formulaInputStoredAsText===false))process.exitCode=1;
