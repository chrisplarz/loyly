# Nordic appearance and welcome experience

This is an incremental enhancement of the existing single-file app. The current typography, layout, palette, hero copy, controls and navigation remain in place. No authentication, Supabase configuration, SQL, session or sync algorithm changes.

## Missing production media — required before final visual acceptance

The supplied references are composed UI mockups, not standalone landscape assets. No unrelated stock photography or generated substitutes have been introduced. Supply approved, licensed images at these paths:

- `assets/welcome-lake.webp`: mist-covered evergreen forest beside a still lake with natural stone.
- `assets/welcome-mountain.webp`: mountain forest partially obscured by fog.

Use desaturated forest greens, sage and gray; no people, lettering, phone frames or baked-in UI. Compose with a central crop safe for portrait and desktop, with the wordmark overlay near the lower third. Suggested maximum 1600px long edge, each ideally under 200KB, stripped metadata, WebP. Check both crops on iPhone and desktop before approval. If separate portrait crops are necessary, add responsive image selection before release.

Until both images load, automatic welcome playback silently skips. Preview reports unavailable images. No daily view is recorded on failure or timeout. Images are not added to the required service-worker install list, so missing media cannot prevent app installation. The app remains fully usable during image loading (maximum 1.2 seconds) and playback. The source points to the two paths above; adding approved assets enables playback without code changes.

## Preferences and daily playback

Profile → Appearance contains previewed radio choices, the daily welcome checkbox and a replay action. Preferences are stored as optional `profile.appearance = {background: 'contours' | 'botanical', dailyIntro: boolean}` in the existing journal profile. Defaults are Nordic Contours and enabled. Changes save immediately through existing `persist()` and existing profile sync timestamps; existing profile-level conflict resolution still applies. Saving other profile fields preserves appearance. JSON exports include appearance; imports validate/normalize it, with old backups still supported.

Playback uses local calendar dates in a separate device-local `loyly-welcome-day-v1` key, independent of journal and session data. It records the day only when both images load and playback starts; Skip counts as seen. Preview never reads or writes that daily marker. Playback stops at three seconds, or immediately on Skip, Escape, Tab, interaction with the app, tab hiding, or enabling Reduce Motion. An unfinished session skips the automatic intro. Reduced motion skips both automatic playback and preview; a message explains this for preview. Storage failure skips automatic playback. Daily tracking is per browser/device; it is deliberately excluded from synced journal data. Cross-tab changes cancel automatic playback in other tabs.

The current app has no functioning dark appearance setting (the sun is decorative). This change adds no color-scheme override, so it retains the existing appearance. Decoration uses existing palette colors and does not change content colors.

## Verification and design handoff

Run `node tests/backup.test.cjs`, `node tests/backup.browser.test.cjs` and `node tests/appearance.browser.test.cjs` (Playwright and Chromium required). Welcome browser tests use explicit SVG test fixtures, not production scene assets. Browser checks cover mobile/desktop overflow, persistence, cloud profile adoption, profile saves, unchanged visits, daily playback/day rollover, three-second duration, Skip/keyboard/essential session access, preview independence, reduced motion, missing/stalled media and storage failure.

No database changes. No live Supabase writes are needed for tests. Real-device iPhone Safari and final imagery/cropping remain manual acceptance checks. Figma updates needed: both background variants, Profile Appearance controls and welcome sequence. No Figma file was supplied; no design files were changed.

Local validation: 8 backup unit checks, 3 existing backup browser checks and 8 appearance browser checks passed in Chromium. Mobile widths 360/390px and desktop 1280px checked; home screenshots reviewed for both styles. `git diff --check` passed. Font requests were stubbed offline in browser tests, so screenshots use the existing fallback fonts. Real-device Safari and final production intro imagery are not verified.

## October 2026 background update

The published app uses Botanical Whisper on warm ivory with stronger paper grain. The contour style and background selector were retired after user feedback. Existing saved `contours` preferences and imported backups normalize to `botanical`; daily welcome and journal records remain unchanged. No Figma file was updated.
