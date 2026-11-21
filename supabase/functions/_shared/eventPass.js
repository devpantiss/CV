export const escapeEmailHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const clean = value => String(value ?? '').replace(/[\r\n\t]+/g, ' ').trim();
export function eventPassDetails(event, registration) {
  return {
    name: clean(registration.name), email: clean(registration.email), institution: clean(registration.institution),
    title: clean(event.title),
    date: /^\d{4}-\d{2}-\d{2}$/.test(event.date || '') ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeZone: 'Asia/Kolkata' }).format(new Date(`${event.date}T12:00:00+05:30`)) : 'Date to be announced',
    time: clean(event.time) || 'Time to be announced',
    venue: [clean(event.venue), clean(event.location)].filter((item, i, items) => item && items.indexOf(item) === i).join(', ') || 'Venue to be announced',
    reference: clean(registration.id),
    // Compact display reference (64 random UUID bits); full UUID remains authoritative.
    code: `CV-${BigInt('0x' + registration.id.replaceAll('-', '').slice(0, 8) + registration.id.replaceAll('-', '').slice(-8)).toString(36).toUpperCase().padStart(13, '0')}`,
  };
}
export function confirmationEmail(details) {
  const e = escapeEmailHtml;
  const text = `Hello ${details.name},\n\nYour place at ${details.title} is confirmed. Your event admission pass is attached.\n\nDate: ${details.date}\nTime: ${details.time}\nVenue: ${details.venue}\nPass number: ${details.code}\n\nPlease keep the pass on your phone or print it and show it at the registration desk. If the time or venue is to be announced, contact the team before travelling.\n\nWe look forward to seeing you.\nThe Career Valley\n9839048312 / 9573907903`;
  const html = `<!doctype html><html><body style="margin:0;background:#f3f6f3;font-family:Arial,sans-serif;color:#243830"><div style="max-width:600px;margin:24px auto;background:#fff;border:1px solid #dce5dc;border-radius:16px;overflow:hidden"><div style="background:#1d4d43;color:#fff;padding:28px"><p style="margin:0 0 12px;font-size:13px">THE CAREER VALLEY</p><h1 style="margin:0;font-size:28px">Your place is confirmed.</h1></div><div style="padding:28px"><p>Hello ${e(details.name)},</p><p>Your registration for <strong>${e(details.title)}</strong> is confirmed. Your personal admission pass is attached as a PDF.</p><table style="width:100%;border-collapse:collapse;font-size:14px">${[['Date',details.date],['Time',details.time],['Venue',details.venue],['Pass number',details.code]].map(([label,value])=>`<tr><th style="text-align:left;vertical-align:top;padding:12px 10px 12px 0;border-bottom:1px solid #e2e7e3">${label}</th><td style="padding:12px 0;border-bottom:1px solid #e2e7e3;overflow-wrap:anywhere">${e(value)}</td></tr>`).join('')}</table><p style="line-height:1.7">Show your pass on your phone or bring a printed copy to the registration desk.</p><p style="font-size:12px;color:#5c6e65;line-height:1.7">If the time or venue is to be announced, please contact the team before travelling. This confirms your registration; attendance is recorded at the event.</p><p>See you there,<br/>The Career Valley</p><p style="font-size:12px">9839048312 · 9573907903</p></div></div></body></html>`;
  return { subject: `Your event pass — ${clean(details.title)}`, text, html };
}

export async function createEventPassPdf(details, { PDFDocument, rgb, fontkit, fontBytes, logoBytes, photoBytes }) {
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  const font = await document.embedFont(fontBytes, { subset: true });
  const bold = await document.embedFont('Helvetica-Bold');
  const characters = new Set(font.getCharacterSet());
  if (Object.values(details).some(value => [...value].some(char => !characters.has(char.codePointAt(0))))) {
    throw new Error('The PDF font cannot display one or more characters in these details. Please contact the administrator to prepare this pass.');
  }
  document.setTitle(`${details.title} - Event admission pass`);
  document.setAuthor('The Career Valley');
  document.setSubject(`Registration reference: ${details.reference}`);
  const colors = { green: rgb(.055,.25,.21), ink: rgb(.08,.16,.14), muted: rgb(.35,.43,.39), line: rgb(.83,.88,.85), paper: rgb(.94,.96,.93), white: rgb(1,1,1), lime: rgb(.81,.94,.48) };
  const face = (value, weight) => weight && /^[\x20-\x7E]*$/.test(value) ? bold : font;
  const wrap = (value,size,width,weight=false) => {
    const f=face(value,weight), lines=[]; let current='';
    for(const char of value) {
      if(f.widthOfTextAtSize(current+char,size)>width && current) {
        const space=current.lastIndexOf(' ');
        if(space>0){lines.push(current.slice(0,space));current=current.slice(space+1)+char;}
        else {lines.push(current);current=char;}
      } else current+=char;
    }
    if(current)lines.push(current.trim());return lines;
  };
  const displayTitle=details.title.replace(/[–—]/g,'-');
  const titleLines=wrap(displayTitle,30,388,true);
  const heroHeight=Math.max(230,115+titleLines.length*35);
  const blocks=[['ATTENDEE',details.name,22,true],['VENUE',details.venue,13,false],['SCHOOL / COLLEGE',details.institution||'Not provided',12,false]];
  const blockHeights=blocks.map(([,value,size,weight])=>30+wrap(value,size,388,weight).length*(size+5));
  const dateHeight=30+Math.max(wrap(details.date,14,194,true).length*19,wrap(details.time,12,174).length*17);
  const bodyHeight=28+blockHeights.reduce((a,b)=>a+b,0)+dateHeight+16;
  const height=24+72+heroHeight+bodyHeight+138+24;
  const page=document.addPage([480,height]);
  const rect=(x,top,width,h,color,extra={})=>page.drawRectangle({x,y:height-top-h,width,height:h,color,...extra});
  const text=(value,x,top,size=12,color=colors.ink,weight=false)=>page.drawText(value,{x,y:height-top-size,size,font:face(value,weight),color});
  const lines=(value,x,top,size,width,color=colors.ink,weight=false)=>{const rows=wrap(value,size,width,weight);rows.forEach((row,i)=>text(row,x,top+i*(size+5),size,color,weight));return rows.length*(size+5);};
  rect(0,0,480,height,colors.paper);
  rect(22,24,436,height-48,colors.white);
  if(logoBytes){const logo=await document.embedPng(logoBytes);const w=185,h=w*logo.height/logo.width;page.drawImage(logo,{x:42,y:height-44-h,width:w,height:h});}
  else text('THE CAREER VALLEY',42,47,15,colors.green,true);
  text('EVENT',354,43,9,colors.muted,true);text('ADMISSION PASS',304,58,9,colors.green,true);
  const heroTop=96;
  rect(22,heroTop,436,heroHeight,colors.green);
  if(photoBytes){
    const photo=await document.embedJpg(photoBytes);
    // The bundled photo is pre-cropped to the header aspect ratio.
    page.drawImage(photo,{x:22,y:height-heroTop-heroHeight,width:436,height:heroHeight});
    rect(22,heroTop,436,heroHeight,colors.green,{opacity:.68});
    rect(22,heroTop+heroHeight-94,436,94,colors.green,{opacity:.60});
  }
  rect(42,heroTop+22,112,22,colors.lime);text('YOU ARE ON THE LIST',51,heroTop+28,7,colors.green,true);
  titleLines.forEach((row,i)=>page.drawText(row,{x:42,y:height-(heroTop+66+i*35)-30,size:30,font:face(displayTitle,true),color:colors.white}));
  text('Your next opportunity starts here.',42,heroTop+heroHeight-37,10,colors.white);
  let top=heroTop+heroHeight+25;
  const block=(label,value,size,weight)=>{text(label,42,top,8,colors.muted,true);top+=18;top+=lines(value,42,top,size,388,colors.ink,weight)+12;};
  block(...blocks[0]);
  text('DATE',42,top,8,colors.muted,true);text('TIME',260,top,8,colors.muted,true);
  const dl=lines(details.date,42,top+18,14,194,colors.green,true),tl=lines(details.time,260,top+18,12,174);
  top+=18+Math.max(dl,tl)+16;
  block(...blocks[1]);block(...blocks[2]);
  const stubTop=height-162;
  rect(22,stubTop,436,138,colors.green);
  for(let x=36;x<448;x+=10)page.drawLine({start:{x,y:height-stubTop},end:{x:x+4,y:height-stubTop},color:colors.paper,thickness:1});
  for(const x of [22,458])page.drawCircle({x,y:height-stubTop,size:9,color:colors.paper});
  text('PASS NUMBER',42,stubTop+21,8,colors.lime,true);
  text(details.code,42,stubTop+39,20,colors.white,true);
  rect(359,stubTop+24,78,32,colors.lime);text('ADMIT ONE',369,stubTop+35,9,colors.green,true);
  text('Show this pass at the registration desk.',42,stubTop+78,10,colors.white);
  text('Valid for the named attendee only. Keep a digital or printed copy.',42,stubTop+96,8,colors.white);
  text('9839048312  /  9573907903',42,stubTop+114,8,colors.lime);
  return document.save();
}
export function smtpFailureStatus(error) {
  // Only an explicit rejection is safe to retry. A dropped connection may have
  // happened after Gmail accepted DATA, so require review of the Sent folder.
  return error?.code === 'EAUTH' || error?.code === 'EENVELOPE' || Number(error?.responseCode) >= 400 ? 'failed' : 'review';
}

export function gmailApiFailureStatus(status) {
  return status >= 400 && status < 500 && status !== 408 ? 'failed' : 'review';
}
