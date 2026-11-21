# Career Valley studio design contract

Purpose: manage events, team profiles and student stories. Audience: a small education guidance team returning to update website content. Primary action: add/edit content; secondary actions: search, filter, preview media, publish status.

Direction: quiet editorial workspace, forest navigation, warm neutral canvas, precise small typography, image-led collections. Memorable detail: a CV monogram and an editorial section number on each collection header. Local references: the site's existing primary green/accent tokens and actual expert photography; the prior oversized metric cards pushed content below the first viewport and the inline form required excessive scrolling.

Hierarchy: navigation → collection name and add action → compact counts → search/status filters → content cards. Form: modal slide-over with title, grouped details/media/publication, image preview and sticky footer. Modal must trap focus, return focus to opener, close on Escape unless saving, and expose its heading to assistive technology.

Targets: desktop 1440x900; mobile 390x844. Desktop uses a 220px rail, 3 event columns, adaptive profile cards. Mobile uses a compact horizontal nav and single-column content, full-width form. No horizontal overflow. Minimum 40px controls, visible focus, labelled inputs, reduced motion support, semantic buttons, native modal dialog.

States: loading uses a stable skeleton grid; empty explains the collection and offers add/reset; errors remain near the form with a retry save action; partial media uses a neutral image placeholder; success confirms a temporary preview save or live save; permission uses the existing authenticated boundary (live project unavailable for end-to-end verification). Preview data remains in memory and does not modify the public site.

Gallery extension: /admin/gallery adds a media/podcast chooser; the public gallery contains Images and Podcasts sections. Validate MIME, extensions, size and YouTube video URLs. Keep files local during preview. Test: podcast thumbnail/new-tab attributes, published gallery navigation, file rejection, audio upload/player, mobile 390px form/footer. Live storage policy tests remain deferred.
