# LÖYLY — Nordic Wellness Journal with cloud sync

A standalone, mobile-friendly web application. Your journal is stored locally first. Optionally add **Supabase email/password sign-in and cloud synchronization** so your devices share the same visits and preferences.

## Publish Ølo Notes

The live host is the existing [Ølo Notes Site](https://olo.chrisplarz.chatgpt.site). GitHub is the approved source/version archive; publishing GitHub Pages is not part of this workflow.

Before editing, run `node scripts/release.mjs check --online` in the Sites checkout and compare affected UI with the required Ølo Notes Figma design system. Prepare output with `node scripts/release.mjs prepare --version N`, then run the application and design-parity tests. The final Sites packaging commands must include `node scripts/release.mjs check --online`. Archive the exact published source with a reviewed, passing GitHub PR and merge it. Do not describe an open archive PR as synchronized.

See [source synchronization](docs/source-synchronization.md) for the guard, installed hooks, drift recovery, and exact release checks. There is no automatic Figma ↔ GitHub ↔ Sites synchronization.

**Before upgrading:** Open your existing journal and select **Profile → Export backup** on each device containing entries. Keep those JSON backups. This release keeps the same Sites origin, local storage keys and cloud project.

## One-time Supabase cloud setup

1. Create a project at https://supabase.com/dashboard (a free project may be enough for a personal journal; check Supabase's current pricing).
2. Open your project → **SQL Editor**, paste `supabase-setup.sql` from this folder, and **Run**. This creates the journal table and row-level security rules.
3. Open project **Settings → API Keys** (or **Project Settings → Data API**) and copy the **Project URL** and **publishable/anon public key**. **NEVER** copy the service_role key, secret API key, database password, or any private credential into the web app or GitHub.
4. Publish the tested update to the existing Sites project using the guarded publishing workflow above.
5. On your **desktop**, go to **Profile → Cloud sync**, enter the project URL and publishable/anon key, click **Connect project**. Then **Create account** using an email and password. If email confirmation is enabled, open the verification email and sign in afterward.
6. Choose **Sync now**. Your desktop journal uploads to your private account.
7. On your **phone**, open the updated GitHub Pages site, go to **Profile → Cloud sync**, enter the **same URL/key** and **sign in with the same email/password**. Tap **Sync now**. Your phone will merge its existing visits with the cloud journal.
8. After setup, the app syncs automatically after saves and on app focus, plus periodic foreground checks. You can also tap **Sync now**.

## Privacy and behavior

- **Cloud sync is optional.** The app works offline with local browser storage.
- Supabase hosts the journal when cloud sync is enabled. Profile information, visit information, notes, and activity tags are stored in Supabase under the authenticated user's ID. Treat this as personal health-related data.
- Row Level Security ensures signed-in users can only access their own rows. This is not HIPAA-certified clinical record software.
- **Never publish your personal JSON export to GitHub.** The public Supabase publishable/anon key is designed for browser use *with Row Level Security enabled*.
- Cloud email/password sign-in tokens are stored in browser `localStorage` for convenience. Avoid shared/public devices. Signing out does not wipe the journal saved locally on that browser.
- Visits merge by stable ID and last-edit timestamp. Deletions are synced using tombstones. When disconnected, edits remain saved locally. For simultaneous edits of **the same visit** from different devices, last edit timestamp wins; there is no full conflict-review interface. Keep JSON backups.
- Cloud **live timer drafts remain local** to the device that started the timer. Saved completed visits sync.
- A browser's local entries remain visible after sign-out. This is designed for one private user per browser, not for switching among unrelated accounts in one browser.

## Data export

**Profile → Export backup** saves a JSON file. **Import backup** restores it into the browser and, if signed in, schedules a cloud sync. **Export CSV** exports visit intervals. Do not discard backups until you confirm both devices have the correct records.

This is a wellness journal, not a medical device, and does not calculate medical risk reductions.

## Safe backup and restore (LÖY-01)

Import backup first validates the entire JSON file and shows counts of new,
duplicate, and conflicting visits. Existing v1 JSON exports and older exports
without a format field remain supported. Duplicate IDs inside one file are
rejected as ambiguous. Files larger than 20 MB are rejected.

**Safe merge (recommended)** adds new IDs only. Existing entries, conflicting
local versions, preferences, and deletion tombstones remain intact. Visits
previously deleted on this device are skipped. **Replace** requires a separate
confirmation and acknowledgement: it adopts backup visits/preferences, records
tombstones for removed visits, and intentionally restores backup visits that had
been deleted. These changes use the existing Supabase sync when connected;
restoring offline saves locally and syncs later. Live timer drafts are unchanged.

A recovery snapshot is saved locally before each restore. Profile → Download
recovery snapshot exports the latest pre-restore journal as compatible JSON.
Older snapshots remain in browser storage under keys starting with
`loyly-before-restore-v1-archive-`; they are not automatically deleted or
uploaded to Supabase. Recovery snapshots consume browser storage; if storage is
full, restoration is refused. Downloaded recovery JSON can be imported and
explicitly replaced to restore its entries. A merge intentionally keeps newer
local conflicts, so use replacement when deliberately rolling back.

### Automated checks

No build step or runtime dependency was added. With Node 20 or newer:

```sh
node tests/backup.test.cjs
# Browser tests need Playwright and Chromium (development tools only).
npm install --no-save --package-lock=false playwright@1.56.1
npx playwright install chromium
node tests/backup.browser.test.cjs
```

Set `CHROMIUM_PATH` to use an installed Chromium executable. The browser suite
covers preview/cancel, safe merge, export/import, explicit replacement,
tombstones, draft preservation, malformed files, stale previews, sync in flight,
storage failure rollback, and a 390px mobile viewport. Live Supabase credentials
are not required; authenticated cross-device sync should also be checked during
review. No database schema or security-policy changes are required.


## Daily Reflection

Home includes a collapsed Daily Reflection beside the weekly rhythm, below the session controls and key statistics. Its 30 curated messages are bundled in
`index.html`, so no network, account, or AI API is needed. The header supports
keyboard activation, announces its expanded state, and respects reduced motion. Weeks start on Sunday across Home and Insights; weekly attendance goals reset with that boundary.

`reflectionProvider.getDaily(date)` is the replacement boundary for a future
Supabase or AI content source. The current provider uses the browser's local
calendar date and saves its selection plus cycle history under
`loyly-daily-reflection-v1`, separately from journal, backup, timer, and cloud data.
It draws from unused messages, starts a fresh cycle after all 30, and avoids a
repeat across the cycle boundary. Days without visits do not consume messages.
The card refreshes after local midnight or on returning to the app without
rerendering session controls. If storage is blocked or full, the message remains
stable in memory for that page; reload persistence then depends on browser storage
being available. Clearing site data resets the rotation.

Run `node tests/reflection.browser.test.cjs` with the same Playwright setup above
for mobile/desktop interaction, daily rotation, reload persistence, content length,
storage failure, and timer regression checks. No database changes are required.
Figma should receive the new collapsed/expanded card states beside weekly rhythm;
this code change does not update Figma automatically.


## Ølo Notes — branding, launch welcome and weather

The visible name is Ølo Notes, with the tagline Your Nordic Wellness Journal. Browser and installable-app names follow the new brand. Existing journal, cloud, timer, backup and recovery keys remain unchanged for compatibility.

The five-second welcome plays on page launch and returning from the background, without resetting running timers or daily thought rotation. The existing preference still controls playback; reduced motion, Skip and media failure remain supported. The former once-a-day marker is ignored.

The header weather control opens a city picker. City search uses Open-Meteo geocoding; current temperature, weather code and day/night state use its forecast API. Only the selected city is stored on this device under `olo-weather-location-v1`; it is separate from journal data and cloud sync. No automatic geolocation is requested. Refreshes are limited to roughly every 15 minutes, and current data older than 30 minutes is marked unavailable. Missing location and network failures do not invent weather readings. The weather dialog links to Open-Meteo attribution and supports changing/removing the city.

Weather integration: https://open-meteo.com/en/docs and https://open-meteo.com/en/docs/geocoding-api. Run `node tests/weather.browser.test.cjs` for mocked condition mapping, city selection, persistence and network-failure checks. Physical iPhone Safari remains unverified.

## Home and calendar review candidate

Unpublished preview v36 introduces the weekly attendance/goal layout and calendar planner. See [review notes](docs/home-week-and-planning.md) for behavior, Figma references, tests, and publication limits. This branch is a review candidate, not an archive of a published release.
