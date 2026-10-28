# Löyly — Guarded Sites-first publishing workflow

Required release checks and drift recovery: [Source synchronization](source-synchronization.md). Run `node scripts/release.mjs check --online` before edits and packaging; derive dist with the prepare command, verify design parity, and merge the reviewed archive PR after CI. An open PR is not a synchronized GitHub main.


## Target setup
- **ChatGPT Sites:** the sole primary live URL and place to edit, preview, and publish.
- **Supabase:** synced journal data for signed-in accounts; do not create a new database.
- **GitHub:** an archive of reviewed, published source code and version history, **not a second required publishing step**.
- **iPhone:** Home Screen shortcut to the same Sites URL used on desktop, after data verification.

**Migration is NOT yet complete merely because this document exists.** Verify the Sites project and personal data on the actual devices before switching the iPhone shortcut or deactivating GitHub Pages.

## Data-safety checklist — do first
1. Open the current GitHub Pages Löyly on **each device/browser with journal entries**. Sign into the existing Supabase account and run **Profile → Cloud Sync → Sync now**. Confirm success and note visit counts. Offline-only entries must be synced or independently exported.
2. Run **Profile → Export backup** on each device and save the downloaded JSON files outside the browser. Confirm each file parses, has a `visits` array, and its visit count matches the UI. Keep all backups private; **never commit them to GitHub**.
3. Confirm the new Sites deployment points to the **same Supabase project** and uses a publishable/anon key, not a service-role secret. Check the existing Supabase RLS policies remain active. Never delete the journal table.
4. Test the Sites URL in a new browser context: sign in to the existing account, sync, verify total counts, oldest and newest visits, and profile fields. Test a new entry and confirm it appears on the prior installation after syncing. **Do not import by Replace** during migration.
5. If anything differs, **stop**. Keep using the old installation and compare device backups before any import; choose **Safe merge** after reviewing preview counts where appropriate.
6. Only when verified: install the Sites URL using Safari → Share → Add to Home Screen. Confirm the icon opens the Sites address and journal records appear after sign-in. Retain the old icon until this check succeeds. Afterwards consider disabling GitHub Pages; **do not delete the repo**.

Browser `localStorage` is origin-specific: `github.io` and the Sites host cannot share it. The app saves journal and profile locally under `loyly-journal-v1`, cloud credentials under `loyly-cloud-v1`, sync metadata under `loyly-cloud-meta-v1`, and upcoming/active visit drafts plus any retained legacy intentions inside the journal under `loyly-journal-v1`. Legacy `loyly-live-v1` drafts migrate on the first successful journal save. **Live timer drafts do not sync between devices.** Finish active timers before switching apps. Saved visits sync through Supabase when signed in.

## Every release: four steps
1. **Edit in Sites:** change the current working Sites project. Keep one active feature at a time.
2. **Test in Sites preview:** test desktop + iPhone widths; visit create/edit/delete; timers; journal/insights; JSON export; sign-in and Supabase sync. Confirm no regression and preserve compatibility with saved data.
3. **Publish in Sites:** deploy to the existing Sites URL. Open it on your phone and verify that new code and existing journal data appear.
4. **Archive in GitHub:** export/copy the **exact tested/published code** into a short-lived GitHub branch; review a PR and merge into `main`, with a descriptive version message. Archive necessary static assets. This is a separate manual or tool-assisted action unless integration has been explicitly verified. **Do not re-publish to GitHub Pages.**

## Rollback
If a Sites release fails, restore the last known-good Sites version and retest the live URL. Restore **code only**, not journal data. Preserve Supabase records and browser backups. If journal data appears missing, verify sign-in, cloud project, sync status, origin, and backups before taking any import or delete action.

## Repository note
The current repository is a standalone HTML app (`index.html`, assets, manifest, service worker). It contains backup tests, but those tests do not validate a live Sites release or production Supabase records. Do not claim migration is complete without device checks.

## Repository rename — olo-notes

The canonical GitHub repository is `chrisplarz/olo-notes` and the approved remote is `https://github.com/chrisplarz/olo-notes.git`, branch `main`. Update existing checkout remotes with `git remote set-url origin https://github.com/chrisplarz/olo-notes.git`.

Before the next Sites edit or publication, carry the reviewed repository rename changes from GitHub into the existing Sites checkout: `scripts/release.mjs` and `.openai/source-sync.json`, plus the release tests and these instructions. Preserve the checkout's runtime hashes and prepared release data when changing only its remote. Run the release tests and `node scripts/release.mjs check --online` after reconciliation. Do not rely on the old repository URL redirect or overwrite current Sites runtime files.

Existing `loyly-*` storage and backup identifiers, service-worker cache prefixes, and the `loyly_journals` database table are compatibility identifiers; retain them. This repository rename requires no runtime release, database migration, or Figma changes.
