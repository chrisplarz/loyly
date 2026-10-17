# Set an intention

Home offers an optional intention for the next live visit. Suggestion chips fill editable text; only nonblank text is required (200 characters maximum). Saved text appears in a compact card with Edit and a separate Start visit action. The form uses the existing palette, type, buttons, and card spacing. At mobile widths the native dialog becomes a bottom sheet; visualViewport height and keyboard inset keep its sticky actions above the keyboard. Native dialog focus confinement, explicit return focus, visible focus, Escape and a discard confirmation support keyboard use. Existing end-of-visit dialogs also have keyboard focus confinement and Escape behavior.

## Lifecycle and persistence

- `pendingIntention`: optional string at the journal root. Device-local, survives reopening, and included in JSON backups.
- `intention`: optional string on an active draft or saved visit.
- `intentionResponse`: optional `Yes`, `Somewhat`, or `Not today` on that visit. No scores. Choosing the same response clears it. Written reflections use the existing notes field.
- `activeVisit`: canonical locally saved draft, or null. The legacy `loyly-live-v1` draft is read only until the first successful new save. Pending, active draft, journal and sync metadata are committed together in one `loyly-journal-v1` localStorage write. A failed primary write restores in-memory committed state and keeps the form input open. Auxiliary metadata mirrors do not determine success.
- Start visit creates a current draft and transfers pending text in one commit, without starting a timer. Timer entry points do the same if no draft exists. Repeated start/resume uses the same draft. Saving an intention never creates a visit.
- An active visit owns its intention. Home edits the active visit while it exists. Editing/removing an intention clears a response that referred to the previous text. Discarding the draft or deleting a saved visit never requeues it.
- Post-visit entries never consume pending text, including backdated entries. Their intention and optional response are editable with the rest of that visit.
- Completion saves the visit and clears the active draft together. Failure keeps the draft and intention for retry. Notes remain in the open form.
- Existing cloud sync carries attached fields as part of each visit. Cloud adoption preserves local pending/active slots. Authentication, policies and schema are unchanged.

## Export and restore

JSON exports contain optional pending and attached intention fields; unfinished timers and internal sync metadata remain excluded. CSV adds Intention and Intention response columns. ChatGPT analysis snapshots include intention and response only when the user opts into notes/intentions/reflections.

Import validates optional fields while accepting legacy backups. Safe merge keeps local pending text, or restores incoming text when the local slot is empty. Explicit replacement uses the backup's pending text. Both preserve the active timer on this device. Existing conflict previews protect saved visits; pending behavior is explained in the preview.

## Verification and limits

26 automated Node checks cover the real journal code with a DOM/storage harness plus existing backup/share tests: refresh, edit/remove, cancel/discard, editable chips, blank validation, duplicate submission, failed writes/retry, atomic start, legacy draft migration, active edits, historical isolation, optional and deselected responses, completion failure, visit deletion, cloud adoption, JSON/CSV/private analysis exports, and backup validation/restore. JavaScript parsing and diff whitespace checks also pass.

Browser preview is unavailable in this container: its supervisor previously failed to mount proc. Native dialog rendering, physical iPhone keyboard behavior, responsive visual appearance, and live authenticated cloud sync remain unverified. Figma needs the intention card, form/bottom sheet, chips, dirty-discard state and optional response controls. No Figma file was modified.
