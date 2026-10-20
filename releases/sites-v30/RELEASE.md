# Ølo Notes — Sites v30 intention controls

Live URL: https://olo.chrisplarz.chatgpt.site
Saved version: appgprj_6ad0ed618ee081918f2ce51dc0aca31c~appgver_2c09867c44ec8191988c0840af895422
Source commit: a64c0f488083b6797576eac903d1220c0b57eb9d
Source tree: c6f7e7a34795f36fca175d394105556ad821b697

The intention card shows pencil (Edit intention) and trash (Clear intention) icon controls only after an intention is set. Both controls have 44px tap targets, accessible names, titles, and the existing focus styling. Remove the Add an intention card link; keep the hero Set Intention action. Apply the same controls to pending and active intentions. Clear reuses the existing guarded removal workflow and retry UI, preserving the active timer and saved visits.

Modified: index.html, dist/index.html, sw.js, dist/sw.js, tests/intentions.browser.test.cjs. No database, authentication, cloud-sync algorithm, or schema changes.

13 checks passed: intention lifecycle/unit tests, pending/active icon actions on 390px and 1280px, reload, failed-clear storage recovery, keyboard clearing, unchanged timer and visits, and Home/Visits regressions. Screenshots were visually reviewed on mobile and desktop. Physical iPhone Safari and live authenticated cross-device sync were not tested.

Figma was updated in place: Intention card 6:396, Pending 6:388 and Active 6:392 now compose the existing Icon/edit and Icon/trash instances with existing spacing, radius, and size tokens. The prior component set is preserved as archive 24:308. Updated variants and their existing examples were checked for layout; no new tokens or unrelated components were introduced.
Figma: https://www.figma.com/design/ZFaJvHXzlUXyopMzk3kZm3?node-id=6-396

source.tar.gz is the complete exact tracked published source. SHA-256: e44d9dd86d3ead39d57bd98a615618d40b8337186ecff0371863bd79facc5809. Snapshot storage preserves unpublished GitHub root changes; no GitHub Pages deployment is requested.
