# Live deployment status — 28 October 2026

Project: `official_site` (`lmmessylsqmmnndbakvt`), verified through the CV Supabase connection.

Completed:

- Migration `20261028182205` — `career_valley_content_google_drive`.
- Migration `20261028182335` — `harden_content_access`.
- Imported 5 team profiles, 3 testimonials and 9 gallery images.
- Deployed `drive-upload` version 1 and `drive-media` version 1.
- Confirmed the admin Auth user exists and granted its UUID access through `private.site_admins`.
- Completed Google personal Drive consent; verified the offline token refresh and private Career Valley Media folder. Credentials are saved in ignored local files.
- Anonymous publishable-key API reads return 17 published records; anonymous admin RPC returns false.
- Transactional admin-role tests confirm create, read, publish/update and delete work; test changes were rolled back.
- Transactional policy tests confirm drafts are hidden from anonymous clients and authenticated non-admin inserts are denied. Test rows were rolled back.
- Security and performance advisors both return no findings after hardening.
- Local lint, build, 12 policy/validation/signature tests and Deno type checks passed before deployment.

Pending:

- Verify the final signed-in dashboard upload. The backend Drive upload, signed read, HEAD and byte-range tests have passed.

The Drive functions are deployed and their credentials are configured. Existing photos retain their original external URLs; new uploads will go to the app-created private Drive folder. No passwords, OAuth credentials or service-role keys are stored in source code.

29 October update: Google authorization is verified. Supabase CLI secret upload was denied because its current account lacks project secret-management access; awaiting the project owner’s dashboard secret import. Local preview restarted on port 5181.

Live checks on 29 October: verified Google Drive test upload; proxy GET 200 with exact bytes/MIME; byte range 206 with matching Content-Range; HEAD 200 without body; invalid signature 403; unauthenticated upload 401; unapproved-origin request 403. The disposable upstream test image was moved to Drive Trash. Results: artifacts/integration-checks/drive-delivery.json. Google credentials were imported by the project owner through the Supabase secrets dashboard.

Event registrations update (29 October): deployed migration 20261029102106_event_registrations and event-registration Edge Function. Standalone admin login now hides dashboard navigation. Direct event form, admin-only event registrant lists, private Google Sheets snapshot export and pending/retry states are implemented. Live registration, deduplication and access checks passed; disposable Sheets RAW write/read passed. Signed-in owner verification and readback of both initial and automatic background registrations passed. Disposable event, registrations and spreadsheet cleaned up. See EVENT_REGISTRATIONS.md for operations.

Contact queries update (29 October): direct /contact_us form deployed using contact-query Edge Function version 1 and contact query tables. Dedicated private Google Sheet created and verified by readback; kept ready with headers after fictional test-row cleanup. Admin Queries section provides inbox/search, pending counts, sync retry and spreadsheet link. No new secrets required. See CONTACT_QUERIES.md.

Partner Colleges update (29 October): added /admin/partners with college names, locations, optional HTTPS websites, Drive logo uploads, published/draft controls, display order, edit and delete. Homepage featured partners now load from site_content kind=partners; imported all 55 existing institutions. Logo upload allowlist deployed in drive-upload. See PARTNER_COLLEGES.md for verification and operations.
