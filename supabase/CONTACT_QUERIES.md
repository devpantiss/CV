# Contact queries

The existing /contact_us page now saves visitor queries directly through the contact-query Edge Function. Fields: name, email, optional phone, topic, message, explicit consent. No visitor login required. Frontend and server validate bounded input. An idempotent submission UUID prevents duplicate rows on request retries; a new successful form submission gets a new UUID. Honeypot and the existing hashed-IP hourly limiter provide basic abuse control.

Deployed schema source: migrations/20261029103758_contact_queries.sql (applied via Supabase connector, whose remote migration timestamp may differ). Tables contact_queries and contact_query_sheet have RLS and admin-only SELECT policies. Anonymous/client inserts are revoked. The Edge Function uses server-only service-role credentials. The existing private admin allowlist is reused.

Each accepted query saves to Supabase immediately, then triggers background export to the separate private spreadsheet Career Valley — Contact Queries in the existing Career Valley Media folder. Existing Google OAuth drive.file scope and secrets are reused. The sheet is identified by appProperties.career_valley_collection=contact_queries, independent of event exports.

Admin → Queries (/admin/queries) supports search, pending sync counts, manual retry and opening the query sheet. Supabase is the source of truth. The generated first worksheet is managed as a stable ordered snapshot with RAW input values (formula execution disabled). Use a separate worksheet for manual notes or analysis. Concurrent arrivals during another sync can remain pending; retry from admin. Worker leases expire after ten minutes; no scheduled retry job is configured. Do not publish the private sheet.

Verified: browser submission success; deployed endpoint saving and duplicate retry; invalid input rejection; anonymous reads and admin sync denial; authenticated nonadmin reads return zero; both browser/API test records automatically exported and read back from the private sheet. Fictional test rows were cleared from Sheets and removed from Supabase. The production contact sheet and headers remain ready for visitor queries. Local lint/build, 16 Node tests and Deno typecheck passed.

The security advisor reports the existing disabled leaked-password-protection setting, with no new table or policy findings: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
