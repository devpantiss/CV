import { createClient } from 'npm:@supabase/supabase-js@2.118.0';
import { cors, googleToken, required, folderId, projectTag } from '../_shared/drive.ts';
import { registrationDetails } from '../../../src/features/events/validation.js';
declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void };
const db = () => createClient(required('SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } });
async function google(url: string, token: string, body: unknown, method = 'POST') {
  const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error('Google Sheets sync is unavailable. Enable the Google Sheets API in your Google Cloud project, then retry.');
  return res.json();
}
async function sync(eventId: string, title: string) {
  const client = db();
  await client.from('event_registration_sheets').upsert({ event_id: eventId }, { onConflict: 'event_id', ignoreDuplicates: true });
  const lease = new Date(Date.now() + 600000).toISOString();
  const { data: lock, error: lockError } = await client.from('event_registration_sheets').update({ lease_until: lease }).eq('event_id', eventId).lt('lease_until', new Date().toISOString()).select().maybeSingle();
  if (lockError) throw new Error('Unable to start Sheets sync.');
  if (!lock) return { pending: true };
  try {
    const token = await googleToken();
    let sheetId = lock.spreadsheet_id;
    if (!sheetId) {
      // Find a previous creation if saving its ID was interrupted.
      const q = `'${folderId()}' in parents and trashed=false and appProperties has { key='career_valley_event' and value='${eventId}' }`;
      const existing = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id)`, { headers: { Authorization: `Bearer ${token}` } });
      if (!existing.ok) throw new Error('Unable to access the event spreadsheet folder.');
      sheetId = (await existing.json()).files?.[0]?.id;
      if (!sheetId) {
        const created = await google('https://www.googleapis.com/drive/v3/files?fields=id', token, { name: `${title} — registrations`, mimeType: 'application/vnd.google-apps.spreadsheet', parents: [folderId()], appProperties: { career_valley_project: projectTag(), career_valley_event: eventId } });
        sheetId = created.id;
      }
      const { error } = await client.from('event_registration_sheets').update({ spreadsheet_id: sheetId }).eq('event_id', eventId).eq('lease_until', lease);
      if (error) throw new Error('Unable to save the spreadsheet connection.');
    }
    const snapshotAt = new Date().toISOString();
    const rows: Record<string, string>[] = [];
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await client.from('event_registrations').select('*').eq('event_id', eventId).lte('created_at', snapshotAt).order('created_at').order('id').range(offset, offset + 999);
      if (error) throw new Error('Unable to read event registrations.');
      rows.push(...data); if (data.length < 1000) break;
    }
    const metadata = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets(properties)`, { headers: { Authorization: `Bearer ${token}` } });
    if (!metadata.ok) throw new Error('Enable Google Sheets API in Google Cloud, then retry sync.');
    const sheet = (await metadata.json()).sheets[0].properties;
    if (sheet.gridProperties.rowCount < rows.length + 1) await google(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, token, { requests: [{ updateSheetProperties: { properties: { sheetId: sheet.sheetId, gridProperties: { rowCount: rows.length + 100 } }, fields: 'gridProperties.rowCount' } }] });
    const values = [['Registration ID', 'Event', 'Name', 'Email', 'Phone', 'School / college', 'City', 'Registered at', 'Consent at'], ...rows.map(row => [row.id, title, row.name, row.email, row.phone, row.institution, row.city, row.created_at, row.consent_at])];
    const range = encodeURIComponent(`'${sheet.title.replaceAll("'", "''")}'!A1:I${values.length}`);
    await google(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=RAW`, token, { values }, 'PUT');
    for (let index = 0; index < rows.length; index += 500) {
      const { error: markError } = await client.from('event_registrations').update({ sheets_synced_at: snapshotAt }).in('id', rows.slice(index, index + 500).map(row => row.id));
      if (markError) throw new Error('Spreadsheet updated; retry to refresh sync status.');
    }
    const { error } = await client.from('event_registration_sheets').update({ synced_at: snapshotAt }).eq('event_id', eventId).eq('lease_until', lease);
    if (error) throw new Error('Spreadsheet updated, but sync status could not be saved. Retry safely.');
    return { count: rows.length };
  } finally {
    await client.from('event_registration_sheets').update({ lease_until: new Date(0).toISOString() }).eq('event_id', eventId).eq('lease_until', lease);
  }
}
Deno.serve(async (request: Request) => {
  let headers: Record<string, string> = {};
  try {
    const allowed = cors(request); if (!allowed) return new Response('Forbidden', { status: 403 });
    headers = { ...allowed, 'Content-Type': 'application/json' };
    if (request.method === 'OPTIONS') return new Response(null, { headers });
    if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers });
    // Bound bodies independently of Content-Length.
    const reader = request.body?.getReader(); let body = ''; let bytes = 0;
    if (!reader) throw new Error('Missing registration details.');
    const decoder = new TextDecoder();
    while (true) { const { value, done } = await reader.read(); if (done) break; bytes += value.length; if (bytes > 8192) { await reader.cancel(); throw new Error('Submission too large.'); } body += decoder.decode(value, { stream: true }); }
    body += decoder.decode(); const input = JSON.parse(body); if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid submission.');
    if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(input.eventId || '')) throw new Error('Invalid event.');
    const client = db();
    if (input.action === 'sync') {
      const auth = request.headers.get('authorization') || '';
      const userClient = createClient(required('SUPABASE_URL'), required('SUPABASE_ANON_KEY'), { global: { headers: { Authorization: auth } }, auth: { persistSession: false } });
      const { data: user, error } = await userClient.auth.getUser();
      if (error || !user.user) return Response.json({ error: 'Sign in as an administrator.' }, { status: 401, headers });
      const { data: admin } = await userClient.rpc('is_site_admin');
      if (!admin) return Response.json({ error: 'Administrator access required.' }, { status: 403, headers });
      const { data: event } = await client.from('site_content').select('content').eq('id', input.eventId).eq('kind', 'events').single();
      if (!event) throw new Error('Event not found.');
      return Response.json({ success: true, ...await sync(input.eventId, event.content.title) }, { headers });
    }
    if (input.action !== 'register') throw new Error('Invalid request.');
    if (input.website) return Response.json({ success: true }, { headers });
    const details = registrationDetails(input);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${required('MEDIA_SIGNING_SECRET')}:event-registration:${ip}`));
    const bucket = Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('');
    const { data: allowedSubmit, error: rateError } = await client.rpc('consume_registration_limit', { bucket });
    if (rateError) throw new Error('Registration is temporarily unavailable.');
    if (!allowedSubmit) return Response.json({ error: 'Too many attempts. Please try again in an hour.' }, { status: 429, headers });
    const { data: event } = await client.from('site_content').select('content').eq('id', input.eventId).eq('kind', 'events').eq('published', true).single();
    const date = event?.content?.date;
    if (!event || !date || date < new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10)) throw new Error('Registration is closed for this event.');
    const { error: saveError } = await client.from('event_registrations').upsert({ event_id: input.eventId, ...details }, { onConflict: 'event_id,email', ignoreDuplicates: true });
    if (saveError) throw new Error('Unable to save your registration. Please try again.');
    // Database confirmation is independent of Google availability; admins can retry sync.
    EdgeRuntime.waitUntil((async () => {
      try { const { data: linked } = await client.from('event_registration_sheets').select('spreadsheet_id').eq('event_id', input.eventId).maybeSingle(); if (linked?.spreadsheet_id) await sync(input.eventId, event.content.title); } catch { /* Pending registrations remain visible to admins. */ }
    })());
    return Response.json({ success: true }, { headers });
  } catch (error) {
    return Response.json({ error: error instanceof SyntaxError ? 'Invalid submission.' : error instanceof Error ? error.message : 'Unable to complete the request.' }, { status: 400, headers });
  }
});
