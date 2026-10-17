# Intentions — interaction design

Status: design and implementation plan; runtime implementation has not started. Based on the complete intention brief in the conversation. The newly attached Pasted text.txt could not be retrieved, so any attachment-only revisions remain unverified.

## Visual direction

Use existing typography, pine green, cream surfaces, rounded cards and spacing. Keep this a quiet invitation below the Home ritual actions, rather than a competing hero. Before saving, show a small leaf icon, Set an intention, and a brief optional invitation. After saving, use a compact cream card: For your next visit, the intention, Edit, and a separate Start visit button. Intention text uses the existing readable body face, never an oversized headline. No badges, completion scores or streaks.

On Visits, place the compact Your intention card immediately above the timer. Preserve direct access to sauna, cold plunge and rest controls. If a live draft exists, Home and Visits edit that draft's intention. Without a live draft, Home edits the pending intention. Completed visits own their independent intention.

## Form

Use a native accessible dialog with a labelled title. On narrow screens it becomes a bottom sheet with a scrollable body and visible action footer using dynamic viewport height and safe-area padding. Initial focus goes to the textarea; native focus containment, Escape handling and return focus must be verified.

Title: Set an intention

Supporting text: What would feel good to make space for?

Optional single-select suggestion buttons, wrapping naturally on mobile:

| Suggestion | Editable sentence |
| --- | --- |
| Unwind | Give myself permission to unwind and let go. |
| Be present | Give myself time to slow down and be present. |
| Recharge | Make space to rest and feel renewed. |
| Recover | Listen to my body and give it time to recover. |
| Find clarity | Create a little quiet to find clarity. |

Label: Your intention. Placeholder: Slow down and leave feeling more grounded. Maximum 200 characters with a subtle live character count. Only trimmed text is required; no chip selection is required. Editing is always allowed. Primary Save intention; secondary Cancel. Editing includes a separate Remove intention action.

Keep unsaved state in memory while open. Detect changes against the initial saved value. Dirty dismissal shows Discard changes? with Keep editing and Discard inside the dialog without stacking another modal. Failed persistence keeps entered text visible, shows an inline error and Retry, and never emits success. Guard submission against duplicate activation.

## Lifecycle and transaction design

The existing app stores the journal and active timer draft in separate localStorage keys. A pending-to-draft transfer must not clear the journal slot before a durable draft exists. Implement a recoverable transfer record with an intention ID and target draft ID, with idempotent read reconciliation; verify each possible interrupted write. Avoid claiming cross-key localStorage writes are atomic.

Saving a pending intention never creates a draft, visit or timer. Start visit follows the existing navigation flow; transfer occurs only at successful creation of the live draft. Opening the timer alone does not consume it. Failed creation preserves the pending intention. A resumed draft never consumes another pending intention.

Attach intention text to the completed visit when saving the live draft. A failed final save leaves the live draft and intention recoverable. Visit deletion removes its own intention and never requeues it. Manual historical entry never consumes the pending slot. Manual edit exposes independent intention text and reflection.

Add optional fields only: journal pending intention and recovery metadata, draft intention, visit intention and intention reflection. Legacy records without fields remain valid. Keep the pending intention local to this device unless the existing cloud merge is explicitly extended with a conflict policy; never accidentally erase it during adoptMerged. Confirm this policy during implementation.

## Optional reflection

In the existing end-of-visit sheet, display the intention and ask Did your visit support your intention? Offer Yes, Somewhat, Not today as optional single-select toggle buttons using aria-pressed. Clicking a selected response clears it. No response is required to save. Continue using existing visit notes for written reflection. Visit detail shows the intention and any response, with editing through the existing visit edit flow. Clearing the intention also clears an orphan reflection response.

## Import, export and verification

Extend existing JSON backup validation, merge and replacement deliberately, including pending intention and optional visit fields. Include intention and reflection in CSV and the existing Share with ChatGPT data payload. Validate maximum length and allowed reflection values without rejecting legacy records. Never transfer a pending intention as a side effect of importing a historical visit.

Required checks: refresh and reopen; edit and remove pending; cancel and dirty dismissal; persistence failures; interrupted transfer and retry; attach exactly once; active draft add/edit; historical entry isolation; optional reflection toggling; visit deletion; old backup compatibility; export/import round trip; cloud adoption preserving local pending; keyboard focus, Escape and mobile keyboard actions.

No authentication changes, new backend, database migration or Figma changes are planned. Implement on this separate branch based on My Visit updates; do not restore the previously rejected intention UI wholesale.
