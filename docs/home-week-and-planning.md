# Home weekly rhythm and visit planning

Prepared for review as release 35. Not published. The existing Sites URL, journal storage keys, Supabase project, authentication, and RLS remain unchanged.

## Home

Recent Visits stays under Visits. Home combines Days you visited above Weekly visit goal, with date numerals in circles and status markers underneath: completed check, today/future plus, blank missed past day. Today has a pine fill, ring, label, and accessible current-date state. Completed visits on today offer both details and planning.

The existing goal counts distinct completed spa days, not the number of sessions or journal entries. Multiple visits on one day yield one check and one goal segment. Plans and upcoming timer drafts never contribute. Goal segments support absent, reached, and exceeded goals. The Sunday-start week refreshes after local midnight and on return to the app.

Sauna time and Cold plunge time retain their insight links and existing activity icons/colors. Their larger numerals and matching tile geometry follow the approved mockup. Desktop widths above 1000px use a wider attendance card with stacked time tiles; mobile/tablet keep a matching pair below. Today’s Thought preserves its existing content, Georgia quote font, expansion, and rotation.

## Planning and calendars

Today/future dates open Plan a spa visit. Recorded past dates open actual visit details, with a chooser for multiple visits. Plans include date, local start time, time zone, elapsed duration, location, and calendar destination. Location is a dropdown with exactly Fort Union, Orem, and Salt Lake. The most recently saved location and calendar are selected for the next plan, saved atomically with the plan. Before any location is saved, Fort Union is selected. Editing an existing plan preserves its own location. They are independent of timers and completed journal visits.

Save plan only does not require a calendar destination. Add to calendar saves the plan, then prepares an explicit provider link or calendar file for review. Google and Outlook links open event composition; Apple/other calendars use a standards-compliant `.ics` file. No calendar event is automatically created and no confirmed calendar save is claimed. The planner has no intention field or sharing checkbox. Legacy plan intentions remain in stored journal data, but are never included in calendar exports or provider links. Visit notes, mood, demographic details, and credentials are excluded.

Below Start time, a compact label such as Mountain Daylight Time describes the selected event date. Edit reveals the time-zone selector; Done collapses it. Winter dates display Mountain Standard Time automatically. The user explicitly selects between repeated times at daylight-saving transitions; nonexistent local times are rejected. UTC DTSTART/DTEND preserve the chosen instant and elapsed duration, and the selected time zone appears in the event description. ICS uses CRLF, UTF-8-aware line folding, escaped text, stable UID, and a monotonically increasing update-based SEQUENCE. External calendars may still duplicate manually imported events; editing/cancellation in Ølo Notes cannot update or delete an already exported event. The interface explains this.

Repeated preparation in one unchanged form reuses the handoff. Matching time/duration/location plans are rejected as duplicates. Changes arriving through cloud sync are detected before overwriting a plan in an open editor. Cancelling retains a timestamped tombstone.

## Settings and data

The Profile destination is labeled Settings; its internal route remains `profile` for compatibility. Profile remains a section within it. Calendar preferences initially default to Ask each time, 17:30, 90 minutes, and use existing profile persistence/sync. Successful plan saves remember the chosen calendar and location. Closing or a failed save does not change those defaults. Settings changes retain the saved location.

Plans live in `plannedVisits` alongside `profile` and `visits` in the existing journal JSON. No database migration, auth change, dependency, or security-policy change is required. Cloud merge reconciles plans by stable ID and update timestamp, including cancellations. Existing profile last-write-wins behavior remains in place. The sync deletion check now requires an actual tombstone; untimestamped legacy visits are preserved when synchronizing plans.

JSON backups include plans and calendar preferences. Restore validates both. Plans merge conservatively by ID even during explicit journal replacement: existing local plans/cancellations win, new IDs are imported, and older backups cannot erase plans. This rule is disclosed in the restore preview. Recovery snapshots include the journal’s plan data.

Older application versions do not understand plans and should not be used to edit a journal after upgrading; their exports cannot carry the new fields. Keep a current-version JSON backup. No storage clearing, service-worker removal, origin change, or real-user data modification was performed during this task.

## Figma

Required file: https://www.figma.com/design/ZFaJvHXzlUXyopMzk3kZm3

Reviewed foundations and patterns: `3:183`, `6:194`, `6:116`, `4:49`, `4:17`, `7:78`, and form controls on `2:4`.

Added/reconciled in the same design system:

- `34:355`: Home week day variants (Visited, Missed, Today, Upcoming).
- `34:381`: combined attendance and goal pattern; original `6:194` preserved.
- `37:676`: wider desktop pattern.
- `37:796`, `37:812`: paired/stacked Home time tiles using Number/Metric emphasis.
- `36:475`, `36:479`: target/calendar icons matching the source icon grid.
- `37:183`: simplified visit planner composed from existing fields and button components.
- `41:326`, `41:287`: collapsed/expanded time-zone variants. Previous planner retained privately in the design file at `41:267`.
- Navigation labels updated from Profile to Settings without altering the navigation treatment.
- Number/Metric emphasis style and font-size variable added for the requested larger logged-time values.

The Figma specimens document reusable patterns and do not automatically synchronize to source. Full application screens and error-state matrices were not regenerated.

## Verification limits

Verified on 2026-10-20:

- 45 Node tests passed, including backup, intentions, Visits, calendar generation, time-zone boundaries, plan merge, and release guards.
- 50 browser tests passed in installed Chrome, including existing appearance, artwork, branding, navigation parity, timers, intentions, backup/recovery, reflection, and the new planning flows.
- Actual calendar-file download and mocked authenticated HTTP sync checks passed in a further focused two-test run.
- Responsive checks passed at 320, 390, 768, 1024, and 1280 pixels. Mobile and desktop screenshots were visually inspected.
- `node scripts/release.mjs prepare --version 36` and `node scripts/release.mjs check --online` passed; source, generated output, release identity, service-worker revision, and approved GitHub runtime baseline agree.
- Inline script syntax and `git diff --check` passed.

Changed files: `index.html`, `sw.js`, guarded generated `dist/index.html` / `dist/sw.js`, `.openai/source-sync.json`, `README.md`, this document, new `tests/planning.test.cjs` / `tests/planning.browser.test.cjs`, and updated assertions in `tests/intentions.test.cjs`, `tests/home-refinements.browser.test.cjs`, and `tests/reflection.browser.test.cjs`. Existing regression coverage remains in place; retired Home selectors were adapted to the approved layout.

Automated browser checks use isolated test journals and mocked network responses; they do not sign into the real user account or create calendar events. Physical iPhone Safari, the installed iPhone PWA, actual provider sign-in/import/save, and authenticated two-device cloud sync require review on the user’s devices before publication. Keep all existing device backups and installations.

Next step: review the local preview and approve publishing. Publishing must use the existing guarded Sites workflow, then archive the exact approved published runtime through a reviewed, passing GitHub PR. This work has not been published or archived as a production release.

## Calendar dialog refinement

Removed intention entry and intention-sharing UI. Added the three-location selector, remembered calendar/location choices, and the compact date-aware time-zone label with Edit disclosure. Focused checks passed at 320, 390, and 1280 pixels for reopen/reload persistence, cancellation, storage rollback, winter/summer labels, DST ambiguity, backups, and preservation of legacy intentions without export. The full 45-test Node and 50-test browser suites passed; three additional focused checks verified final mobile field alignment. The production journal and database schema remain unchanged.

## Final review refinements (preview v36)

- Attendance and visit goal now use Weekly rhythm's paper surface and neutral border, matching Figma `6:194`; updated reusable nodes `34:381` and `37:676`.
- Removed Save plan only and the bottom Close button. Add to calendar is the only primary action; the X still dismisses. Existing saved-plan cancellation remains available.
- Add to calendar launches the chosen composer or prepares/downloads an ICS file, then closes the planner. Persistent feedback explains the required final save/import step and offers reopen/download and dismissal. Popup blocking and file-preparation errors keep inputs in place with simple retry instructions. A provider save cannot be confirmed by this static handoff, so the app never reports one as confirmed.
- Planner variants `37:183`, `41:287` and guidance in `41:326` reflect the simplified flow. No new design tokens or database/schema changes.
- Private design screenshots are excluded from the public review branch. This remains an unpublished review candidate, not an archive of a deployed release.

Final refinement validation: all 45 Node checks and all 17 focused planning/browser checks passed, including actual ICS download, failure/retry, dialog dismissal, persistence and responsive layouts. The PR records the final full-suite and CI outcome.

## Last-visit feeling check-in (preview v37)

The approved mockup included this card, but the original implementation prompt explicitly excluded a new reflection system. The user has now added it to scope.

Home shows **How did your last visit feel?** for the most recent completed, non-future visit with recorded time, above Today's Thought. Choices are **Calmer**, **Energized**, and **About the same**. They save immediately to that visit, independently from numeric moods, intention responses, notes, timers, plans, and attendance. The selected choice and save feedback remain visible; change or clear it at any time. **View visit** opens the existing details and the same editable controls. **Not now** hides the Home prompt for that visit while preserving any response; it remains available in details. A newer completed visit receives its own prompt. No completed visits means no prompt.

Optional JSON fields `visitFeeling` (one of the three responses or null) and `visitFeelingSkipped` (boolean) use the existing journal persistence, timestamped cloud merge, export/import and recovery paths. No database/schema migration, auth/RLS changes, or dependencies. Failed saves roll back the journal and offer Retry save. Existing manual edits preserve the response. Backups validate and retain both fields, CSV includes the response, and analysis exports include it only with the explicit notes/reflections opt-in. Calendar descriptions exclude it.

Reused paper surface, border, heading/body styles and Choice chip `3:628` (`3:624` / `3:626`). Added **Last visit check-in** `46:853`, with Unanswered `46:715`, Answered `46:761`, and Save error `46:807` specimens and behavior guidance. No new tokens. Figma and browser mobile/desktop screenshots were reviewed.

Added focused browser coverage for response/edit/clear/reload, optional dismissal/new visits, absent/empty/future visits, failed save/dismissal/retry, existing mood/notes preservation, backup, timestamped sync merge and export privacy. Added backup validation coverage and retained all existing suites. This remains an unpublished review candidate for follow-up PR #32 (PR #31 is already merged); physical iPhone and real-account two-device checks remain outstanding.

Check-in validation: all 46 Node checks and all 59 browser checks passed, including mobile/desktop visual review. A final focused rerun also covers keyboard focus restoration after editing the visit response.

## PR #32 conflict resolution (review candidate v48, 2026-10-26)

Merged the current GitHub main (deployed archive v43) into the check-in branch, preserving both the optional Home check-in and the later Settings jump navigation and planner refinements. Both browser suites remain in CI. Source, dist, service worker and release fingerprints were regenerated with the guarded release prepare command for candidate v48. This does not publish or replace the newer Sites preview v47 or merge an unpublished candidate into the production archive.

The Home card appears above Today's Thought when there is a completed visit with recorded time. Choosing Not now hides it for that visit; a newer completed visit restores the prompt. The response remains editable in visit details. No database or Figma changes were needed for this conflict resolution.
