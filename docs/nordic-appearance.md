# Nordic appearance and welcome experience

This is an incremental enhancement of the existing single-file app. The current typography, layout, palette, hero copy, controls and navigation remain in place. No authentication, Supabase configuration, SQL, session or sync algorithm changes.

## Single approved landscape and packaging status

The welcome uses **one approved landscape only**: the user's misty forest/lake artwork. There is no second scene or crossfade requirement. The three-second sequence fades in the image with an extremely gentle camera push, reveals the wordmark/tagline around the second second, holds briefly, and dissolves into Home. The composition follows the approved artwork: a warm paper upper area with the wordmark above the forest/lake scene. Approved image colors are retained without an additional saturation filter. Skip, daily tracking, preview and reduced motion work as before.

The approved image is visible inline in the conversation, but no downloadable attachment path, file ID or URL was exposed to the execution workspace. The exact approved image must be made available as a file attachment or direct image download URL to finish packaging. This is the same image, not a request for new artwork. No stock or generated replacement has been introduced.

Production path: `assets/welcome-landscape.webp`. Use the approved image's landscape area, excluding the outer phone frame, status icons, home indicator and baked-in lettering so the app can animate its own wordmark without duplication. Preserve the approved colors and scenery. The downloadable source is needed for that crop/export; it is not yet committed. Suggested optimized export: maximum 1600px long edge, ideally under 250KB, WebP with metadata stripped. Review the portrait and desktop crops against the original image before approval.

Until this one image loads, automatic playback silently skips and Preview reports unavailable media. No daily view is recorded on failure or timeout. The image is not in the required service-worker install list, so unavailable media cannot prevent app installation. The app stays usable during loading (maximum 1.2 seconds) and playback. Adding the approved image at the path above enables playback without further code changes.

## Preferences and daily playback

Profile → Appearance contains previewed radio choices, the daily welcome checkbox and a replay action. Preferences are stored as optional `profile.appearance = {background: 'contours' | 'botanical', dailyIntro: boolean}` in the existing journal profile. Defaults are Nordic Contours and enabled. Changes save immediately through existing `persist()` and existing profile sync timestamps; existing profile-level conflict resolution still applies. Saving other profile fields preserves appearance. JSON exports include appearance; imports validate/normalize it, with old backups still supported.

Playback uses local calendar dates in a separate device-local `loyly-welcome-day-v1` key, independent of journal and session data. It records the day only when the approved image loads and playback starts; Skip counts as seen. Preview never reads or writes that daily marker. Playback stops at three seconds, or immediately on Skip, Escape, Tab, interaction with the app, tab hiding, or enabling Reduce Motion. An unfinished session skips the automatic intro. Reduced motion skips both automatic playback and preview; a message explains this for preview. Storage failure skips automatic playback. Daily tracking is per browser/device; it is deliberately excluded from synced journal data. Cross-tab changes cancel automatic playback in other tabs.

The current app has no functioning dark appearance setting (the sun is decorative). This change adds no color-scheme override, so it retains the existing appearance. Decoration uses existing palette colors and does not change content colors.

## Verification and design handoff

Run `node tests/backup.test.cjs`, `node tests/backup.browser.test.cjs` and `node tests/appearance.browser.test.cjs` (Playwright and Chromium required). Welcome browser tests use an explicit single-image SVG test fixture, not replacement production imagery. They assert that exactly one image is rendered and that the wordmark appears mid-sequence. Browser checks cover mobile/desktop overflow, persistence, cloud profile adoption, profile saves, unchanged visits, daily playback/day rollover, three-second duration, Skip/keyboard/essential session access, preview independence, reduced motion, missing/stalled media and storage failure.

No database changes. No live Supabase writes are needed for tests. Real-device iPhone Safari and final imagery/cropping remain manual acceptance checks. Figma updates needed: both background variants, Profile Appearance controls and welcome sequence. No Figma file was supplied; no design files were changed.

Local validation: 8 backup unit checks, 3 existing backup browser checks and 8 appearance browser checks passed in Chromium. Mobile widths 360/390px and desktop 1280px checked; home screenshots reviewed for both styles. `git diff --check` passed. Font requests were stubbed offline in browser tests, so screenshots use the existing fallback fonts. Real-device Safari and final production intro imagery are not verified.

## October 2026 background update

The published app uses Botanical Whisper on warm ivory with stronger paper grain. The contour style and background selector were retired after user feedback. Existing saved `contours` preferences and imported backups normalize to `botanical`; daily welcome and journal records remain unchanged. No Figma file was updated.
