import test from 'node:test';
import { Buffer } from 'node:buffer';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import nodemailer from 'nodemailer';
import { passLogoBase64, passPhotoBase64 } from '../supabase/functions/event-confirmation/artwork.js';
import { passFontBase64 } from '../supabase/functions/event-confirmation/font.js';
import { eventPassDetails, confirmationEmail, createEventPassPdf, smtpFailureStatus, gmailApiFailureStatus } from '../supabase/functions/_shared/eventPass.js';
const event={title:'Career Catalyst 4.0 — Hyderabad',date:'2026-12-02',time:'Time to be announced',venue:'Hotel Hyatt',location:'Hyderabad'};
const registration={id:'12345678-1234-4234-8234-123456789abc',name:'Aarav Sharma',email:'attendee@example.test',institution:'Example College'};
const options={PDFDocument,rgb,fontkit,fontBytes:Buffer.from(passFontBase64,'base64'),logoBytes:Buffer.from(passLogoBase64,'base64'),photoBytes:Buffer.from(passPhotoBase64,'base64')};
test('pass identifies the attendee and event; HTML safely escapes stored fields',()=>{
 const details=eventPassDetails({...event,title:'Fair <script>alert(1)</script>\r\nBcc: test'}, {...registration,name:'Zoë <img src=x>'});
 const email=confirmationEmail(details);
 assert.match(details.code,/^CV-[0-9A-Z]{13}$/);
 assert.equal(details.reference,registration.id);
 assert.equal(details.code,eventPassDetails(event,registration).code);
 assert.notEqual(details.code,eventPassDetails(event,{...registration,id:'92345678-1234-4234-8234-123456789abc'}).code);
 assert.equal(details.venue,'Hotel Hyatt, Hyderabad');
 assert.match(details.date,/2 December 2026/);
 assert.ok(!email.html.includes('<script>'));assert.ok(!email.html.includes('<img src=x>'));
 assert.ok(email.html.includes('&lt;script&gt;'));assert.ok(!/[\r\n]/.test(email.subject));
});
test('PDF pass is readable and can be attached as real SMTP MIME without sending',async()=>{
 const details=eventPassDetails(event,registration);
 const pdf=await createEventPassPdf(details,options);
 assert.equal(new TextDecoder().decode(pdf.slice(0,5)),'%PDF-');
 const document=await PDFDocument.load(pdf);assert.equal(document.getPageCount(),1);assert.match(document.getTitle(),/admission pass/);
 assert.ok(document.getSubject().includes(registration.id));
 assert.equal(document.getPage(0).node.Resources().lookupMaybe((await import('pdf-lib')).PDFName.of('XObject'),(await import('pdf-lib')).PDFDict).keys().length,2);
 await fs.writeFile('artifacts/event-passes/sample-pass.pdf',pdf);
 await fs.writeFile('output/pdf/modern-event-pass.pdf',pdf);
 const transporter=nodemailer.createTransport({streamTransport:true,buffer:true});
 const result=await transporter.sendMail({from:'Career Valley <sender@example.test>',to:registration.email,...confirmationEmail(details),attachments:[{filename:'Event-Pass.pdf',content:Buffer.from(pdf),contentType:'application/pdf'}]});
 const mime=result.message.toString();assert.match(mime,/Content-Type: application\/pdf/);assert.match(mime,/filename=Event-Pass.pdf/);assert.match(mime,/Content-Transfer-Encoding: base64/);assert.match(mime,/attendee@example.test/);
 transporter.close();
});
test('ambiguous SMTP outcomes require manual review; explicit rejection permits retry',()=>{
 assert.equal(smtpFailureStatus({code:'EAUTH'}),'failed');
 assert.equal(smtpFailureStatus({responseCode:550}),'failed');
 assert.equal(smtpFailureStatus({code:'ETIMEDOUT'}),'review');
 assert.equal(smtpFailureStatus({code:'ESOCKET'}),'review');
});

test('Gmail API rejection permits retry; timeout and server uncertainty require review',()=>{
 for(const status of [400,401,403,404,429])assert.equal(gmailApiFailureStatus(status),'failed');
 for(const status of [undefined,408,500,502,503])assert.equal(gmailApiFailureStatus(status),'review');
});

test('long attendee, event and venue details expand the ticket without losing a page',async()=>{
 const details=eventPassDetails({...event,title:'Career Catalyst - University and Career Discovery Summit for Students and Parents',venue:'Grand Convention Hall, Main Campus, University Road, Near Central Metro Station'}, {...registration,name:'Alexandra Catherine Montgomery-Wellington',institution:'International Institute of Advanced Engineering and Management Studies'});
 const pdf=await createEventPassPdf(details,options);
 const document=await PDFDocument.load(pdf);assert.equal(document.getPageCount(),1);
 await fs.writeFile('artifacts/event-passes/long-pass.pdf',pdf);
});
