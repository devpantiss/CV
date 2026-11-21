import { mediaTypes } from '../_shared/file-policy.js';
import { verifyFile } from '../_shared/signing.js';
import { googleToken, required } from '../_shared/drive.ts';

Deno.serve(async (request: Request) => {
  const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'range, content-type, apikey', 'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges, Content-Type', 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS' };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id || !await verifyFile(id, url.searchParams.get('token'), required('MEDIA_SIGNING_SECRET'))) return new Response('Media link is invalid', { status: 403, headers: corsHeaders });
    const headers: Record<string, string> = { Authorization: `Bearer ${await googleToken()}` };
    const range = request.headers.get('range');
    if (range) {
      if (!/^bytes=(?:\d+-\d*|-\d+)$/.test(range)) return new Response('Unsupported range', { status: 416, headers: corsHeaders });
      headers.Range = range;
    }
    const upstream = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?alt=media`, { method: 'GET', headers });
    if (![200, 206, 416].includes(upstream.status)) { await upstream.body?.cancel(); return new Response('Media is unavailable', { status: upstream.status === 404 ? 404 : 502, headers: corsHeaders }); }
    const mime = upstream.headers.get('content-type')?.split(';')[0].trim();
    if (upstream.status !== 416 && !Object.hasOwn(mediaTypes, mime || '')) { await upstream.body?.cancel(); return new Response('Unsupported media', { status: 415, headers: corsHeaders }); }
    const outgoing = new Headers(corsHeaders);
    for (const name of ['content-type', 'content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified']) { const value = upstream.headers.get(name); if (value) outgoing.set(name, value); }
    outgoing.set('X-Content-Type-Options', 'nosniff');
    outgoing.set('Referrer-Policy', 'no-referrer');
    outgoing.set('Cache-Control', upstream.status === 416 ? 'no-store' : 'public, max-age=3600');
    if (request.method === 'HEAD') await upstream.body?.cancel();
    return new Response(request.method === 'HEAD' ? null : upstream.body, { status: upstream.status, headers: outgoing });
  } catch { return new Response('Media service is not connected', { status: 503, headers: { ...corsHeaders, 'Cache-Control': 'no-store' } }); }
});
