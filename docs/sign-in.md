# Sign In and account management

Implementation status: staged locally; not published. Owner dashboard access is restored and the picture-storage repair is applied. Remaining production acceptance checks for the broader Sign In release are unfinished. Do not deploy or describe the 30-day policy/private image policies as verified until the release dependencies below are resolved.

## Source and preserved features

Started from Sites source commit `385cc39899a1029c90b585012aa0984fde282a64`, app shell 46, opened with the official Sites source helper in `sites/olo-sign-in`. The online GitHub release check passed before editing. Existing recovery/metric-card checkouts were left intact.

The full existing application remains in place: Profile name/gender/weight/weekly goal; Calendar preferences/plans; Thought topic and reflection; Appearance/welcome; Visits, timers, intervals, activities, moods, notes, intentions; JSON/CSV exports, backup preview/safe merge/replacement/recovery, and manual ChatGPT sharing. A profile picture section was added to the existing Profile card. Settings and Cloud Sync were removed from navigation; signed-in Settings is in the account dialog. Guest device preferences remain accessible through footer details, without a Settings link in Sign In.

## Local data and account migration

- Guest journal keeps its existing `loyly-journal-v1` key. Original bytes are not deleted during sign-in or sign-out.
- Account journals use `olo-account-v2:<verified-user-id>:loyly-journal-v1`. Legacy live draft, sync metadata, manual form drafts, recovery snapshots/archives and saved ChatGPT sharing destinations use the same account prefix.
- A stored session identity selects an account's local store on reopening; Auth verifies it before sync. Legacy sessions without an owner ID are verified before selecting a store. Their unscoped journal remains available as the device journal and requires an explicit copy choice.
- Sign-in never attaches device data automatically. The choice is **Keep separate** or **Add a copy**. A copy preserves IDs, account preferences and deletion markers, leaves guest originals intact, and excludes guest timers/manual drafts. Duplicate copies are idempotent.
- Sign-out revokes the current server session with `scope=local` before clearing credentials and selecting the guest journal. A network failure is reported and does not claim server sign-out succeeded. Revoked/invalid sessions are distinct from offline failures.
- Unfinished account timers, manual drafts and unsynced records remain in that account's local store when hidden. Browser storage is not encrypted; these namespaces prevent accidental UI/sync mixing, not access by another person with developer tools on the same browser profile.

## Synchronization

Edits commit locally before scheduling network work. Preferences carry independent leaf-path clocks, with a compatibility baseline for legacy whole-profile timestamps. New-device defaults yield to existing account values. Visits retain tombstones and stable IDs. A three-way comparison against the last acknowledged content preserves concurrent note/plan versions under deterministic conflict IDs; footer details explain that preserved copies need review.

Journal writes retain the existing `loyly_journals` structure and revision-filtered compare-and-swap retries. Account epoch checks and aborted requests prevent late results from applying to another account. Edits during an upload remain pending until a later database acknowledgement. Browser Web Locks serialize token rotation across tabs, with a fresh stored-session expiry check inside the lock. Browsers without Web Locks preserve data and ask for reauthentication rather than rotating tokens unsafely.

Only acknowledged journal snapshots clear the durable pending flag. Footer states cover device-only, pending, saving, saved with last-success time, offline, reauthentication and retry. Timers and manual drafts are excluded from cloud payloads.

## Authentication and pictures

Sign In, optional-name signup, confirmation/resend and password recovery call the existing Supabase Auth service. Password fields have username/current-password/new-password autocomplete, native form validation and Show/Hide. Resend/recovery requests have a client cooldown in addition to service rate limits. Callback tokens are removed from the URL before subsequent work. Recovery-only sessions remain restricted through reload and must choose a new password or revoke the session when canceled. Passwords are never read back or retained by the application.

Picture selection accepts JPEG/PNG/WebP up to 5 MB and rejects invalid/oversized decoded images. Zoom and horizontal/vertical crop controls render a 384px WebP before upload. Profiles retain `<owner-id>/<random-id>.webp` object paths, never expiring URLs. Authenticated private reads use blob URLs in memory. Uploads use unique paths; old objects remain available for older device references. Cancel preserves the previous path; Remove changes the profile reference without destructively deleting historical objects.

The private bucket is `olo-avatars`. Its owner-only INSERT/SELECT/DELETE policies were applied on 26 October 2026 after inspection and explicit approval. Actual app upload, authenticated retrieval and reload were verified with a temporary sample. Database RLS checks verified owner read, cross-owner read/upload denial and anonymous read denial; these checks simulate request roles/claims in SQL, rather than using a second signed Auth session. A later owner-scoped cleanup policy can remove unreferenced objects after retention requirements are agreed.

## Backend and publishing dependencies

Existing Supabase project: `rppmuxmwoocixxrebbxu`. The project is reachable. Its public Auth settings confirm email signup is enabled and email confirmation is required. These public settings do not establish SMTP delivery, redirect allowlists, database policies, session limits, or Storage policies.

The Supabase connector still lacks project access. The owner browser session now provides administrator access. A versioned migration created the private picture bucket and three owner-only Storage policies. Existing journal policies and Auth/Sites audience settings were preserved. Remaining release prerequisites below are still outstanding.

Before publishing:

1. Continue the live backend inspection beyond the completed Storage repair. Inspect journal constraints/grants/triggers/functions and remaining Auth configuration. Do not treat `supabase-setup.sql` as evidence of the live schema. Create only the non-destructive versioned migration actually needed after inspection, including validation, server timestamps and atomic revision enforcement.
2. Verify SMTP delivery, confirmation/resend/reset email, exact redirect allowlist and callback round trips through the existing Sites custom audience gate. Preserve the current Site audience.
3. Enforce the maximum 30-day authenticated lifetime through Supabase or a backend. Built-in time-boxed sessions require Pro or above ([official documentation](https://supabase.com/docs/guides/auth/sessions)); the existing project's plan/configuration remains unknown. Do not purchase an upgrade. If unavailable, report a backend session-age/revocation enforcement option with its operational requirements. This UI does not substitute a browser timer for enforcement, and its approved 30-day note is not yet a verified production guarantee.
4. Verify two real test accounts cannot read/write each other's journal or pictures. Test revocation, expired links, renewal, reconnection, new-device preferences and conflict retries against the actual database.
5. Prepare with the matching service-worker shell revision and `node scripts/release.mjs prepare --version N`, run all suites plus online parity, package through the official helper with `node scripts/release.mjs check --online`, deploy to the existing Sites URL, verify live release/appearance and archive the exact deployed runtime through a reviewed GitHub PR with successful CI and merge. No GitHub Pages deployment.

## Design system

Reviewed existing nodes `7:6` (dialog), `3:515` (field), `3:381`/`3:405`/`3:417` (buttons), `3:44`/`3:107` (user/close), `4:17` (navigation), plus local semantic colors/spacing/radii and shared typography.

Added editable library patterns in the existing design-system file `ZFaJvHXzlUXyopMzk3kZm3`, page `2:7`:

| Pattern | Node |
| --- | --- |
| Account avatar | `69:1163` |
| Account control | `69:1172` |
| Journal sync status, seven states | `69:1190` |
| Sign In, desktop/mobile × default/error/loading | `69:1204` |
| Signed-in account dialog | `72:403` |
| Profile picture editor, empty/editing/error | `72:433` |

The account title uses a scoped shared **Heading/Account dialog** style (Manrope Medium, 24px); all other foundations were reused. Georgia quote text in the app is unchanged. These library additions do not automatically update older full-screen compositions or publish the library. Expanded signup/recovery and full Settings screen compositions remain to be synchronized after backend acceptance.

## Verification

Final validation: **45 Node tests and 87 browser tests passed**, including all 22 focused account scenarios. The guarded shell 50 source/output/online GitHub checks passed. Browser scenarios use isolated sample data and mocked Supabase responses, not production user records. Responsive checks include 320, 375, 390, 430 and 1280px; existing regression suites also exercise intermediate widths. Actual physical iPhone Safari and production emails/Storage/RLS have not been exercised.

Existing tests were retained. Navigation expectations were updated from four tabs to three and Settings sections from six to five. Two stale image-wordmark assertions were updated to the text wordmark already present in the production source; no production branding change was made by this feature.

## Preview review fixes (26 October 2026)

Added matching key/sign-out icons to the account menu and design-system library (`78:83`, `78:86`). The header Account/Sign In control now uses the same mint hover fill, rounded hit area and keyboard focus treatment as account-menu actions. Its Figma pattern includes default/hover states (`79:454`, `79:460`). Profile picture actions align with their label. Calendar actions have 16px from the preceding fields and 16px between the button and help text. Geometry was verified at 320, 390, 1068 and 1280px.

The reported **Bucket not found** response came from the existing Storage service, not image decoding/cropping. Missing-bucket and denied-access errors now explain the failure without showing raw backend wording. The editor retains the selected image and crop for retry, and never writes an avatar path after a failed upload. A new regression verifies failed upload → intact crop → successful retry. These response tests are mocked; the private bucket and ownership policies were subsequently created and verified as described below.

## Applied picture storage repair

On 26 October 2026, inspected the actual project using its owner dashboard session. There were no Storage buckets or Storage object policies; RLS was enabled. Storage logs matched the reported failed uploads. Applied `supabase/migrations/20261026184749_private_profile_pictures.sql` through the SQL Editor after explicit approval. The file was generated using the pinned official Supabase CLI 2.122.0. This manual dashboard application is recorded here; it was not recorded by the CLI migration-history mechanism. Do not blindly reapply: the migration intentionally stops if the bucket already exists.

The bucket is private, capped at 5 MB and accepts WebP. INSERT requires the authenticated user ID to match both `owner_id` and the first path segment; SELECT and DELETE enforce the same ownership. No UPDATE policy is granted; replacement uses a unique object path. Existing journal records/policies were not replaced by this migration.

Verified through the signed-in app using its public icon as a temporary sample: crop → real Storage upload → authenticated image load → reload → account-dialog image load. The server stored a 3,666-byte WebP with the correct owner. RLS verification passed for owner access, a different simulated authenticated subject denied read/upload, and anonymous denied read, with all test SQL changes rolled back. The equivalent reusable check is `docs/verify-private-pictures.sql`. This does not claim a full two-real-account Auth test. Removed the temporary picture reference through the app afterward; its private historical object remains, consistent with the retention behavior. No personal portrait was uploaded by the agent.

Picture saving is now available in the local feature preview. The broader Sign In release remains unpublished pending the remaining Auth/session/redirect and journal-backend acceptance work.

## Source reconciliation after the Storage repair

The final online guard detected GitHub main had advanced to `f03921ab4e7e5252c6a68fc6a3f3c38e68719849` (approved Weekly Activity, PR34). Opened the latest Sites source with the official helper into a separate review checkout: saved Sites version40, commit `6dcb20327b51cc81e6fc6fedf6059a0e9b07c4a5`, app shell48. Compared it with the original source385cc39 and the GitHub baseline.

Three-way reconciled the newer Weekly Activity card, Read more/Read less disclosure and their regression checks with the local Sign In/account changes. Resolved the shared CSS insertion by retaining both sections; kept the newer weekly-goal expectations and account-aware sync fixture. Preserved local branding assets. Reviewed the approved Weekly Activity reference69:761 in the same Figma system. The unused activity-prototype QA asset from the review checkout was not added to this candidate or its future public archive.

Accepted the inspected GitHub baseline in the source lock, then regenerated canonical output through `release.mjs prepare --version 49`. All45 Node and86 browser tests pass. The release remains staged locally; no Site publication or GitHub archive was performed in this step.

A live multi-tab check also exposed stale cached picture markup after another tab removed its picture. The account/header/Profile views now clear mismatched blob URLs and reload pictures after cross-tab journal updates. A focused two-tab regression covers removal while the other Account dialog is open. Final candidate shell50 passes45 Node tests and87 browser tests, plus the online source guard and whitespace check.

### Home review 51

Changed the hero eyebrow to TODAY'S VISIT, bound the weekly divider to the existing line/border token, and routed the weekly goal tile to weekly Insights. Recorded days with one visit open the full existing visit details directly (including today); multiple visits retain a chooser. Recorded-day choosers have only a primary Close action, and visit details use primary Close while preserving existing Edit/Delete controls. Planning remains available on unrecorded upcoming days. No database change.

Figma weekly activity component set 69:760 updated: dividers 69:665 and 69:731 now bind color/border/default (2:79); usage guidance records the revised navigation and Home eyebrow. Full hero/dialog composition synchronization remains part of the outstanding broader design work. Local candidate shell 51; not published.
