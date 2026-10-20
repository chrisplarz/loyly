# Visit intentions

Home’s Set Intention action navigates to Visits, selects Live timer, and opens the existing native intention dialog over that page. Opening and cancelling never create data. Cancel/Escape/backdrop keep Visits visible; dirty dismissal retains the existing Keep editing / Discard protection. Save closes the sheet and keeps a new/upcoming timer stopped. An already running visit continues uninterrupted during intention editing.

Your intention appears directly below the Sauna / Cold plunge / Rest controls on Visits, with 44px Edit intention and Remove intention icon buttons. Home has no intention card. Empty intentions use the existing Set an intention invitation. Upcoming drafts show Ready to begin and explicit Discard draft, without a session timeline or Finish action. Removing an intention clears only that field; discarding explicitly removes the entire unfinished visit, after confirmation. Neither requeues text for a future visit.

## Persistence and activation

Saving creates or updates one `activeVisit` in the journal’s atomic `loyly-journal-v1` commit. An upcoming record has `status: 'upcoming'`, a stable ID, null date/start, no current interval and empty intervals. The first session changes the same record to `status: 'active'`, assigns the actual local date and timestamp, and starts the interval in one commit. Intention and ID remain unchanged. Later sessions retain that first start. Only completed records are added to `db.visits`, the source for history, goals, minutes, insights, CSV and sharing. Drafts remain local to this device, as before; completed visits use existing Supabase sync.

A failed write restores committed journal/draft/sync metadata in memory. The intention editor stays open with its entered text and Retry save. Retry also remembers a failed removal. Failed activation leaves the upcoming record stopped; failed discard leaves it saved. Optional reflection, written notes, history editing and backdated entry remain supported. Historical creation never consumes the current draft or its intention.

## Migration

Existing standalone pending intentions migrate atomically into an upcoming record. Legacy drafts keep their IDs; drafts with actual intervals/current timers remain active, while never-started empty drafts become upcoming with null date/start. The legacy storage key is removed only after a successful commit.

If an active/unfinished visit and a separate old pending intention coexist, preserve both. Visits exposes the earlier text as Previously saved intention with Review saved intention. Saving that review explicitly assigns it to the current/new visit and clears the legacy slot; cancelling preserves both. Its persisted review requirement survives finishing/discarding the active visit, reopening, and backups; it is never automatically attached when another visit starts. Removal in this review removes only the legacy slot.

## Backups and sync

JSON exports include `upcomingVisit` when a stopped upcoming draft exists, including its stable ID. Recovery exports do the same. Import validates its shape and ensures it is distinct from completed records. Merge or replacement preserves a local unfinished visit first; an imported upcoming draft is adopted only when no unfinished visit exists and no completed ID collides. Legacy backups and pending-intention fields remain supported, and the preview explains draft priority. Active timers remain device-local. Completed intention/optional response fields continue round-tripping in JSON/CSV and existing sync. No database, authentication, RLS, dependency or origin changes.

## Design and verification

Reused Ølo Notes Design System: Intention card `6:396`, Intention dialog `7:78`, semantic pine/paper/text colors, existing typography/spacing/radii and icon actions. Updated the existing Pending variant to Upcoming, unified the card heading as Your intention, and aligned component usage descriptions. No new tokens/components or quote-font changes. The Intention timeline stays deferred.

Node and browser suites cover navigation, cancellation/dirty dismissal, focus containment/return, 390px and 1280px layouts, short viewport actions, persistence, ID/date activation, counts, active edits, removal/discard, storage failure/retry, optional reflection, historical isolation, legacy migration, backup/export/recovery/import, and mocked sign-in/session refresh/sync/sign-out. Existing backup, appearance, visits/cycles, weather, daily-thought and Home suites remain required. Physical iPhone Safari/keyboard behavior and real-account cross-device sync still need device verification; automated authentication/sync uses mocked responses and does not modify personal cloud data.
