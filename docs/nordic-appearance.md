# Nordic appearance and welcome experience

This is an incremental enhancement of the existing single-file app. The current typography, layout, palette, hero copy, controls and navigation remain in place. No authentication, Supabase configuration, SQL, session or sync algorithm changes.

## Single approved landscape and packaging status

The welcome uses **one approved landscape only**: the user's misty forest/lake artwork. There is no second scene or crossfade requirement. The three-second sequence fades in the image with an extremely gentle camera push, reveals the wordmark/tagline around the second second, holds briefly, and dissolves into Home. The composition follows the approved artwork: a warm paper upper area with the wordmark above the forest/lake scene. Approved image colors are retained without an additional saturation filter. Skip, daily tracking, preview and reduced motion work as before.

The approved source is committed as `assets/landscape-intro.PNG` (1024 × 1536, 2.45 MB). The application loads only `assets/welcome-landscape.webp` (135,048 bytes), an optimized WebP encoding of that same complete image. No stock or generated replacement is used. No second image is required.

The SVG display viewport `96 500 832 970` selects the forest/lake area from the original 1024 × 1536 canvas, excluding baked-in lettering, phone frame, status icons and home indicator. The source artwork is not destructively cropped or retouched. The SVG scales this region proportionally to fill the lower scene area on portrait and desktop screens; the app renders its own animated wordmark over warm paper above it. Colors are preserved without an extra saturation filter.

The WebP was encoded using Sharp with quality 82 and effort 6; Sharp is a development conversion tool, not an application dependency. The original PNG remains available for future re-exports and is never requested by the intro.

If the one image cannot load, automatic playback silently skips and Preview reports unavailable media. No daily view is recorded on failure or timeout. The image is not in the required service-worker install list, so failed media cannot prevent app installation. The app stays usable during loading (maximum 1.2 seconds) and playback.

## Preferences and daily playback

Profile → Appearance contains the daily welcome checkbox and a replay action. The current app retains the botanical background refinement from PR #5. Preferences are stored as optional `profile.appearance = {background: 'contours' | 'botanical', dailyIntro: boolean}` in the existing journal profile. The welcome defaults to enabled; background values normalize to botanical as in the existing app. Changes save immediately through existing `persist()` and existing profile sync timestamps; existing profile-level conflict resolution still applies. Saving other profile fields preserves appearance. JSON exports include appearance; imports validate/normalize it, with old backups still supported.

Playback uses local calendar dates in a separate device-local `loyly-welcome-day-v1` key, independent of journal and session data. It records the day only when the approved image loads and playback starts; Skip counts as seen. Preview never reads or writes that daily marker. Playback stops at three seconds, or immediately on Skip, Escape, Tab, interaction with the app, tab hiding, or enabling Reduce Motion. An unfinished session skips the automatic intro. Reduced motion skips both automatic playback and preview; a message explains this for preview. Storage failure skips automatic playback. Daily tracking is per browser/device; it is deliberately excluded from synced journal data. Cross-tab changes cancel automatic playback in other tabs.

The current app has no functioning dark appearance setting (the sun is decorative). This change adds no color-scheme override, so it retains the existing appearance. Decoration uses existing palette colors and does not change content colors.

## Verification and design handoff

Run `node tests/backup.test.cjs`, `node tests/backup.browser.test.cjs` and `node tests/appearance.browser.test.cjs` (Playwright and Chromium required). Timing and failure tests use an explicit single-image SVG fixture. A separate production-media check loads the actual WebP at 390px and 1280px, verifies its crop and size budget, captures hold-phase screenshots and checks daily playback after reload. Tests assert exactly one scene and a wordmark reveal mid-sequence. Browser checks cover mobile/desktop overflow, persistence, cloud profile adoption, profile saves, unchanged visits, daily playback/day rollover, three-second duration, Skip/keyboard/essential session access, preview independence, reduced motion, missing/stalled media and storage failure.

No database changes. No live Supabase writes are needed for tests. Real-device iPhone Safari remains a manual acceptance check. Figma update needed: single-scene welcome composition and Profile welcome controls. No Figma file was supplied; no design files were changed.

Local validation: 8 backup unit checks, 3 existing backup browser checks and 9 appearance browser checks passed in Chromium. Mobile widths 360/390px and desktop 1280px checked; production welcome screenshots reviewed at 390px and 1280px. `git diff --check` passed. Font requests were stubbed offline in browser tests, so screenshots use the existing fallback fonts. Real-device Safari is not verified. Production intro imagery is now packaged and checked in Chromium.

## October 2026 background update

The published app uses Botanical Whisper on warm ivory with stronger paper grain. The contour style and background selector were retired after user feedback. Existing saved `contours` preferences and imported backups normalize to `botanical`; daily welcome and journal records remain unchanged. No Figma file was updated.
