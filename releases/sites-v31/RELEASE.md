# Sites v31 — keep hero actions on one row

Published URL: https://olo.chrisplarz.chatgpt.site
Saved version: appgprj_6ad0ed618ee081918f2ce51dc0aca31c~appgver_972af5c1149c8191802972f203e94f9c
Sites source commit: 070be1d8cc731b9745c71bcc3439c583c7a31c88
Source tree: 4ea29c61aae2844307773262b7315cb841a1a61b

At mobile widths, give hero content its full available width and disable action-row wrapping. Both controls use flexible widths with single-line labels and compact padding/gaps. Hide the decorative trailing arrow on mobile to preserve label space. No card minimum width or page overflow is introduced. Desktop layout stays intact.

Matches the existing Figma mobile Hero's single-row action pattern (6:22); no Figma updates needed. Existing contextual colors, labels, and action handlers remain.

Modified: index.html, dist/index.html, sw.js, dist/sw.js, and tests/home-refinements.browser.test.cjs. The shell cache advances to v31. No database, authentication, storage-schema, or cloud-sync changes.

Validated at 320, 360, 390, 394, 430, 680, and 1280px: same row, no overlap, no clipped labels, no page overflow. Both action handlers passed. Existing Home/Visits browser checks passed at 390px and 1280px, with new button-bound assertions. Mobile screenshot visually checked. Physical iPhone Safari and live signed-in cloud sync were not exercised.

source.tar.gz is the complete exact published tracked source. SHA-256: 879ca8aef518544ff3779f348685aec764dc20b7e07dc27446b065138dae8f3e. The snapshot preserves unpublished root changes already in GitHub; no GitHub Pages deployment is requested.
