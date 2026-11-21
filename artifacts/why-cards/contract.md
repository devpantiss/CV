# Why Career Valley cards

Reference: user-provided Screenshot 2026-10-25 at 01.44.04.png. Four narrow numbered white panels; one expanded, taller panel with visual, title and details. Keep the current Career Valley light palette and the four existing benefits/actions.

Desktop 1440x900: horizontal cards, all cards collapsed by default, hover or keyboard focus expands a card. Smooth width, height and content transitions; no layout movement outside a fixed-height row. Inactive panels retain a logo-green number, icon and readable title. Active cards reveal illustration, description and next actions.

Mobile 390x844 and tablet 768x1024: vertical accordion cards with tap/keyboard disclosure, generous controls, no hover dependency, no horizontal overflow. Expanded content is available through semantic labelled buttons, aria-expanded/aria-controls; collapsed action links are removed from navigation. Reduced motion removes transitions. Existing consultation modal and destination routes remain functional.

Loading/errors/empty/permission: no new data fetching or permissions; all four items are static. Illustrations are optimized local WebP copies of the site's existing assets. Verify expansion, focus, navigation and modal behavior as the relevant success states.
