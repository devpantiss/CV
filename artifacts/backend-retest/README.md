# Backend retest — 20 November 2026

Google connection renewed and server secret updated. Media delivery and private Sheets exports now pass. Browser upload permission and QA cleanup confirmation remain pending. Only fictional, clearly labelled QA records are used. No production records are intentionally changed.

Verified so far:
- Supabase database and Auth HTTP 200 after resume.
- 13 transactional permission/CRUD assertions passed for events, team, testimonials, partners and gallery. Changes rolled back.
- 5 transactional validation/rate assertions passed, including valid podcast save, rejecting unsafe URLs/invalid order, and the eleventh hourly attempt being denied. Changes rolled back.
- Registration retention protected by foreign key; no transactional fixture rows leaked.
- Initial public API run: 29/30 passed. Media was blocked by an expired Google grant; renewed media smoke test now passes GET 200, exact bytes/MIME, Range 206, HEAD 200, and invalid-signature rejection 403 (media-final.json).
- Registration and contact retry tests each retained one row, consent timestamps saved, all exposed app tables have RLS enabled.
- Admin browser sign-in passed. Test student visible only within matching event.
- Podcast unsafe URL rejected, valid share link normalized/saved/published, public target=_blank confirmed, edit/unpublish persisted and removed public entry.
- Public browser contact and event-registration submissions returned success without student sign-in.
- Admin query inbox retained pending submission during Sheets failure.
- Local 21 existing tests plus 2 new error-response tests passed; lint and production build passed.

Identified:
- Expired Google grant resolved by owner renewal and server secret update. Event export passed with one registration, contact export passed with two enquiries and zero pending. Repeat contact sync passed; matching test row remained unique. Both Sheets verified private. Formula-like input remains literal text (sheets.json).
- Chrome extension currently blocks programmatic local-file uploads (Allow access to file URLs disabled). Owner asked to enable it or choose the test image manually.
- Existing public student login/signup/OTP/password reset uses a separate legacy API. VITE_APP_SERVER_BASE_URL is absent; this flow is not a working Supabase student-auth implementation.
- Career Catalyst calendar is static announced content linked to contact enquiries; it is not a database event registration.

Small fix made during testing: normalized function error parsing so network/transport failures don't show a `json is not a function` exception. Tests cover server error responses, absent/non-JSON/nonfunction contexts.

All three QA events and the QA podcast are unpublished. Disposable persisted fixtures pending final cleanup: three event IDs and contact submission ID are in public-api.json; unpublished BACKEND QA Podcast; browser contact name BACKEND QA Browser Visitor/email backend-qa-browser-20261120@example.test. Uploaded fixtures are in fixtures/. Google files created by smoke checks were moved to Trash even when server verification failed. Both browser forms succeeded; the browser contact query uses backend-qa-browser-20261120@example.test and is also pending sync.

20 November final Google checks: disposable Drive file moved to Trash by smoke test. Event QA Sheet ID: 1LA9JJn8aQ3PHcq_7sJYzTRwO3UH7CsE26KBnN48oHd8, pending cleanup approval. Contact Sheet retained. Background sync after successful connection, authenticated image/audio/video uploads, and logout still pending verification.

Final follow-up:
- Automatic event sync PASSED: second fictional registration returned HTTP 200, both DB sync timestamps set, and second email verified in Google Sheet without manual sync.
- Approved cleanup completed: 3 events, their 2 registrations, 2 enquiries, test podcast removed. Verified zero QA content/enquiries/registrations remaining. Two QA contact Sheet rows cleared; main contact Sheet retained. Disposable event Sheet moved to Trash.
- Owner reported manual QA image save, but no matching image or recent new gallery record was found in the live database. Authenticated image/audio/video uploads remain unverified; do not count them as passed.
- Sign out click did not visibly end the session during observation. Reload then showed standalone login without sidebar (memory-only session reset confirmed). Explicit sign-out behavior needs follow-up.
- Legacy student authentication remains unconfigured as noted above.
