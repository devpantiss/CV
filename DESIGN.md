# Career Valley · ambient light

Career Valley helps students and families compare education pathways and start a guidance conversation. The existing original green logo, course library, photographs, and shared PageHero establish the local design reference; no external design service or new dependency is needed.

The visual hierarchy is logo and navigation → page purpose → guidance action → supporting detail. Preserve existing routes and content. Use warm ivory backgrounds, white cards, pale sage for guidance, and soft peach for selected supporting sections. Deep forest ink provides clear reading contrast; terracotta is a restrained accent. Use the original `public/career-valley-logo.png` without recoloring, filtering, cropping, or stretching.

## Checkable contract

- Default to a light color scheme regardless of operating-system preference. No theme-switching workflow is added.
- Primary actions use deep green with white labels; body and muted text meet 4.5:1 on their solid surfaces.
- Shared tokens in `src/index.css` control surfaces, borders, actions, and status colors. Keep layout and existing content intact.
- Review at 390×844 and 1440×900: logo remains legible, navigation fits, no document overflow, course tables scroll within their containers, forms have labels and visible focus.
- Retain footer video sources and poster with a light overlay; retain reduced-motion behavior. Reduced-motion users receive the static pathway cards.
- Review home, inner-page hero, course guide, college discovery, events, contact, and authentication surfaces.

## States

Existing loading, empty, error, and partial-data states inherit the shared light tokens. Keep their retry or navigation actions. Check the existing event and college discovery states when available; external event service success and authenticated flows require backend access and must not be marked tested without it. Contact success prepares an email in the user's mail client; do not send an email during design validation. This change adds no permission workflows.

## Palette

Forest #286458 · Ink #203b33 · Muted #5c6e65 · Ivory #f8f9f5 · Sage #e7f0e9 · Peach #f6e9df · Terracotta #9b5037 · Border #dce5dc.
