# Career Valley content integration

The selected architecture is **Supabase for content and admin login, Google Drive for media, and YouTube links for podcasts**.

Follow [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md) for the current setup and verification steps. The supplied Supabase project URL/publishable key are configured locally. Database setup and media-function deployment are complete. The admin user is created and authorized. Google authorization and secret configuration are complete. Backend media upload/delivery checks pass; final signed-in dashboard upload verification is in progress.

`setup-google-drive.sql` has already been applied to this project; do not run it again. Use it once only when setting up another fresh project. It imports existing content and does not create Supabase Storage buckets. The older `migrations/202610280001_content_studio.sql` and `202610280002_gallery.sql` files describe the previous Storage-based option; do not run both setup paths.

The admin dashboard is at `/admin`; Gallery uploads are at `/admin/gallery`. Lower display-order numbers appear first. Publish controls website visibility; uploaded media remains accessible to anyone with its capability URL. Admin sessions are kept in memory and require signing in after a page reload. Existing student login is separate.

Google credentials belong only in ignored local setup files and Supabase Edge Function secrets, never `VITE_` variables. YouTube podcasts use the original YouTube video URL and thumbnail; no podcast file is uploaded to Drive.

To review sample layouts without a project connection, remove the two local Supabase environment variables and restart Vite. Preview data stays in browser memory and resets on refresh.
