# Gmail event confirmations and admission passes

## Admin workflow

Open Admin → Events → View registered students. Each attendee has:

- **PDF pass**: download a personalized PDF without sending email.
- **Send confirmation & pass**: send to that attendee’s registered email address through the connected Workspace Gmail account.
- **Sent**: Gmail accepted the email. This does not mean inbox delivery or actual event attendance.
- **Retry confirmation**: available only after an explicit provider rejection.
- **Check Gmail Sent**: an ambiguous response or interrupted send must be reviewed before another send. After checking the sender’s Gmail Sent folder, mark the record sent or confirm it was not sent to allow retry. A send still marked in progress becomes reviewable after five minutes.

No public client can choose a different recipient: the endpoint reads the attendee and event from the database and requires an approved admin session. Repeated clicks use an atomic database claim; already-sent records do not send again. Neither transport provides exactly-once delivery after an ambiguous network failure.

## Google sign-in setup (selected)

The sender is `info@thecareervalley.com`. Enable Gmail API in the existing Google Cloud project. If the OAuth app is in Testing, add this mailbox as a test user. Run `node scripts/connect-google-mail.mjs` from the project root, open the generated sign-in link privately, and have the mailbox owner approve consent. The helper requests only identity and `gmail.send`, verifies the selected mailbox, and writes `.gmail-secrets.local` with mode 0600. It leaves the Drive connection untouched.

The owner must privately paste its four entries into Supabase → Edge Functions → Secrets: `GMAIL_SENDER_EMAIL`, `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`. Never paste values into chat or frontend environment variables. The function builds a MIME email with the PDF attachment and calls Gmail API using a server-side refreshed access token.

The Cloud OAuth app was observed in External / Testing mode. Gmail grants in Testing expire after seven days; production publishing and any required Google verification must be completed for a durable deployment. Do not treat a successful test connection as production readiness. Workspace policy can also require administrator approval.

An optional SMTP fallback accepts `GMAIL_SMTP_USER` and `GMAIL_SMTP_APP_PASSWORD` via implicit TLS on port 465. OAuth takes precedence when its three credentials exist. App Passwords are unavailable for the chosen account, so the selected connection is Gmail API.

References: https://developers.google.com/workspace/gmail/api/auth/scopes and https://developers.google.com/identity/protocols/oauth2#expiration

## Deployment

Apply `supabase/migrations/202611200002_event_confirmation_emails.sql` and deploy `event-confirmation` with gateway legacy verification off. The function verifies the admin JWT and allowlist itself. The migration and function were deployed on 20 November 2026; the Gmail API update is deployed. Owner Google consent and Supabase sender secret deployment succeeded. One authorized self-addressed test email was accepted by Gmail on 20 November 2026 at 21:17 IST. No student was contacted.

The font is bundled in `font.js` under the SIL Open Font License in `assets/FONT-LICENSE.txt`. Backend npm dependencies are pinned in the function. Node dev dependencies are for local PDF/MIME validation only.

## Validation performed

- Local tests: event identity and safe email HTML/header content; valid one-page PDF and SMTP MIME attachment; explicit rejection vs ambiguous SMTP and Gmail API outcomes.
- Rendered and visually reviewed the sample PDF.
- Three live endpoint checks: missing identity denied, publishable key cannot send, unapproved origin denied.
- Three transactional database assertions: first send claim succeeds, concurrent duplicate blocked, sent registration cannot be claimed. Rolled back without leaving test attendees.
- Signed-in admin service readiness and the unconfigured-send state were verified. Live per-attendee PDF download succeeded and was visually reviewed. Google consent succeeded for the selected mailbox. Live Gmail API send succeeded; the registration persisted Sent and its send button was removed. The owner confirmed receipt with the PDF attachment. After explicit cleanup approval, exactly the temporary test registration was deleted and the admin attendee list showed zero registrations. The self-addressed test and its cleanup are complete.

## Pass format

The PDF includes attendee name, event title, date/time, venue, institution, and a compact 16-character display number derived from 64 bits of the registration ID. The full registration UUID remains in PDF metadata and is the authoritative identifier; the compact code is not an authentication token or a guaranteed unique database key. It is a registration/admission pass, not proof of attendance. There is no QR scanner or attendance check-in implementation in this feature.

The modern ticket design bundles the existing Career Valley transparent logo and events hero photograph, uses a green photo overlay and perforated admission stub, and expands vertically for longer details. Both the download and email attachment share this template; previously sent emails keep their original attachments. No additional email was sent for this design change.

Deployment status for the visual redesign: owner reported manually deploying output/event-confirmation-deploy.ts on 20 November 2026. Post-deploy unauthorized access checks passed (401/401/403). Authenticated PDF verification is pending because the available admin tab is signed out. Local 29-test suite and lint passed; standard and long-detail passes were visually reviewed.
