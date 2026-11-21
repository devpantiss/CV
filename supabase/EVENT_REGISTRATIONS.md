# Event registrations and Google Sheets

Applied to official_site (lmmessylsqmmnndbakvt): remote migration 20261029102106_event_registrations. The local CLI-generated source is migrations/20261029080908_event_registrations.sql. Do not apply twice.

Students register directly from an upcoming published event on /events. Required details: name, email, phone, school/college, city and consent. No student account/password is required. Each event/email combination creates one registration; repeats confirm receipt without exposing whether an email already registered. Past and unpublished events reject submissions.

The event-registration Edge Function validates bounded input, uses a honeypot and an hourly hashed-IP rate limit (10 attempts), and writes via a server-only service role. This is basic abuse control; email ownership is not verified. The Data API does not permit client inserts. Only allowlisted site admins can read registrations or spreadsheet metadata. No contact form leads or general website user data are exported.

In Admin → Events → View registered students, search the list and choose Create & sync Google Sheet. This creates a private spreadsheet in the existing Career Valley Media Drive folder, using the existing drive.file OAuth permission. Google Sheets API must be enabled in the same Cloud project. Open sheet opens it in a new tab. After the first connection, registrations trigger a background sync. Pending counts expose unsynced rows and Sync to Google Sheets retries safely. Supabase remains the source of truth; Sheets failure never reverses registration success.

The server serializes sync with a renewable-by-retry 10-minute lease, then writes a stable ordered snapshot to the first worksheet, using RAW values so student input cannot execute formulas. Repeated sync replaces the snapshot rather than appending duplicates. Keep the generated worksheet as the managed export; use a second worksheet for manual analysis. Do not move, share publicly or delete the generated sheet. Google permissions remain private by default. If a worker stops mid-sync, pending rows remain retryable; a failed worker lease expires within 10 minutes. Concurrent arrivals while a sync is running may need a manual retry. There is no scheduled retry worker.

Registrations retain a consent timestamp. Events with registrations cannot be deleted; unpublish them to hide them from the public site while retaining the student list.

Deployed: event-registration version 2 (background sync). Existing GOOGLE_* credentials, GOOGLE_DRIVE_FOLDER_ID, MEDIA_SIGNING_SECRET and ALLOWED_ORIGINS are reused. No new frontend secrets.

Verification: local lint/build, 14 Node tests, Deno typecheck; deployed public form accepted one fictional registration, duplicates retained one row, invalid email rejected, anonymous admin-sync rejected, anonymous reads denied, authenticated nonadmin read returned zero and allowlisted admin read returned one. A disposable private Google Sheet write/read preserved '=1+1' literally and was moved to Trash. The owner verified the student list in the signed-in dashboard; the database independently confirms creation and successful sync of that event’s Google Sheet. A second fictional registration verified automatic background sync. The generated sheet was read back to check both rows and private permissions, then moved to Trash; temporary database records were removed.

Security advisor has no new database findings. It reports the project's existing disabled leaked-password-protection setting: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection . Performance advisor has no findings.
