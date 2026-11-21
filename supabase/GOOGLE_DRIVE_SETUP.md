# Connect Career Valley: Supabase + personal Google Drive

## Current state

The supplied project URL and publishable key are configured in ignored `.env.local` using this Vite project's `VITE_` names. The database is now created and public API access verified: 5 team profiles, 3 testimonials and 9 gallery images are live. Both Drive Edge Functions are deployed. Security and performance advisors return no findings. The app now uses Supabase Auth/database and Google Drive for **all new team, event, testimonial and gallery file uploads**. YouTube podcasts still store links only.

The admin account is created and authorized. Google consent and secret configuration are now complete. Backend Drive upload and signed-media delivery checks pass; final signed-in dashboard upload verification is in progress. The publishable key cannot perform privileged setup. Do not send passwords or Google tokens in chat.

## 1. Database and admin

**Already applied to the connected project; do not run again.** For a different fresh project, run `supabase/setup-google-drive.sql` once in its SQL Editor. It creates the tables, admin access function and row policies, and imports existing team/testimonials/gallery. It does not create Supabase Storage buckets. Do not also run the older Storage-based migrations on this fresh project.

In Authentication → Users, create the user **dev.careervalley@gmail.com** and choose its password privately. If the user already exists, keep that account. Then run:

```sql
insert into private.site_admins (user_id)
select id from auth.users where lower(email) = 'dev.careervalley@gmail.com'
on conflict do nothing;
```

Only project owners can grant admin access. Regular authenticated users cannot write site content or upload media.

The connected Supabase app can apply SQL and deploy functions once you authorize its connection. Otherwise use the SQL Editor and CLI instructions below.

## 2. Authorize a dedicated folder in your personal Drive

1. In Google Cloud, create or select a project and enable **Google Drive API**.
2. Configure Google Auth Platform / OAuth consent for your own app. While testing, add the intended Drive account as a test user.
3. Create an OAuth client of type **Web application**. Add this exact authorized redirect URI:
   `http://127.0.0.1:8765/callback`
4. Copy `.google-drive-client.example` to `.google-drive-client.local`. Put the client ID and client secret there. This file is ignored by Git and is never imported by Vite.
5. Run `npm run connect:drive`. Open the printed Google authorization URL in your normal browser, choose the intended Gmail account and approve the app-created-files permission yourself.
6. The local helper requests only `https://www.googleapis.com/auth/drive.file`. It creates an app-owned **Career Valley Media** folder in My Drive and saves offline credentials to `.drive-secrets.local` with owner-only file permissions. It does not make the folder publicly shared or print tokens.

Keep the local callback process running until consent finishes. Tokens for an external Google OAuth app left in **Testing** generally expire after seven days for Drive scopes; configure its production publishing/verification status appropriately before relying on it. Reconnect the same Drive account if a token is revoked. Switching Drive accounts will not give the new account access to old files.

Google references: [drive.file scope](https://developers.google.com/workspace/drive/api/guides/api-specific-auth), [offline OAuth](https://developers.google.com/identity/protocols/oauth2/web-server), [token expiration](https://developers.google.com/identity/protocols/oauth2).

## 3. Deploy the private upload service and public media endpoint

If your CLI account owns the project, you can set secrets with the commands below. If it uses another account or lacks secret-management access, open **Edge Functions → Secrets** in this project’s Supabase dashboard, paste all six `KEY=value` lines from `.drive-secrets.local` and save. Supabase supports bulk pasting, and the deployed functions pick up the secrets without redeployment.

Using the Supabase CLI, sign in to the account that owns the project:

```sh
npx supabase login
npx supabase secrets set --project-ref lmmessylsqmmnndbakvt --env-file .drive-secrets.local
npx supabase functions deploy drive-upload --project-ref lmmessylsqmmnndbakvt --no-verify-jwt
npx supabase functions deploy drive-media --project-ref lmmessylsqmmnndbakvt --no-verify-jwt
```

The managed functions receive `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Supabase. No service-role credential is used by these handlers. `drive-upload` verifies the caller's JWT with `auth.getUser`, then checks `is_site_admin`. `drive-media` requires a valid HMAC file signature. Gateway JWT verification is disabled specifically because media GET requests have no browser login header; access checks happen inside the handlers. Do not deploy a function with these checks removed.

Add the production website origin to `ALLOWED_ORIGINS` in `.drive-secrets.local` (comma-separated, no trailing slash), and upload the secrets again before deploying the website. Local origins are already included.

## 4. How files are stored and served

1. Admin selects a file. Browser validation checks format/size.
2. The authenticated upload function repeats validation and rejects non-admins.
3. It uploads to the private Drive folder via Google's resumable upload API and tags the file for this Supabase project.
4. It returns a stable media endpoint URL with an HMAC signature. Supabase stores that URL, Drive file ID and content details.
5. The website requests that endpoint. It verifies the signature, downloads from Drive using private server credentials, and streams the response. Range requests are forwarded for video/audio seeking.

A normal Drive share URL is not used for inline images. No OAuth tokens or client secrets reach the browser. The `MEDIA_SIGNING_SECRET` must remain stable: rotating it invalidates old media URLs. Keep it backed up privately.

Website media URLs are public capability links: anyone with a valid URL can view that file, including a file attached to a draft. Drive itself stays private. Do not upload confidential media. Responses may remain in browser caches for up to an hour after a Drive file is removed. Download traffic passes through the Edge Function, so choosing Drive does not eliminate Supabase function/data-transfer usage or Google's API quotas.

Failed content saves attempt to move the newly uploaded file to Drive Trash. Replaced images and deleted content entries retain their existing Drive files so reused URLs do not break. Clean up unreferenced files in the dedicated folder manually. Do not delete files still used by published content.

## 5. Verify the live connection

- Open `/admin`, sign in with the admin user, create a draft and upload an image. Confirm it exists in the private Drive folder.
- Publish the entry and inspect its public image URL: it should use `/functions/v1/drive-media`, with no Google OAuth token.
- Create a gallery audio/video entry and check playback and seeking. Existing codec limitations still apply.
- Add a podcast and check its YouTube thumbnail/new-tab link.
- Sign out; uploads must return 401. A regular non-admin user's valid JWT must return 403.
- Alter the media URL signature or file ID; it must return 403 and never read an arbitrary Drive file.
- Check CORS against an unapproved origin and test an oversized/unsupported upload.

Verified live: public reads return 17 published entries, drafts are hidden from anonymous access, anonymous admin checks return false, and non-admin database writes are rejected. Authenticated admin login and Google Drive file transfers remain pending the admin account and Google consent. Local policy/signature tests do not replace the remaining end-to-end checks.
