# Share with ChatGPT

Profile → Data action → Share with ChatGPT → Run action.

Save a ChatGPT project name and link on this browser. Download a fresh analysis JSON snapshot, open the project, and attach it in a chat. Notes and reflections require a separate opt-in on each download. Demographics, credentials and unfinished timers are omitted. Exports are snapshots of the current local journal; run cloud sync first if other devices may have newer visits.

The indicator is “Project saved · Manual sharing,” not a verified live connection. Automatic delivery and project account authorization are not implemented. Disconnect removes only the saved destination. Uploaded files must be removed in ChatGPT itself.

A future ongoing connection requires an authenticated server integration with per-user access, consent/revocation, a supported ChatGPT destination, and delivery acknowledgment. Do not convert local settings into a “Connected” status or simulate successful uploads.

Changed UI: Data action dropdown, sharing dialog, saved-project status panel. Figma needs corresponding components and manual/unavailable states; no Figma file changed. No database/auth/cloud sync changes.

Validation: 11 Node tests (backup compatibility, destination validation, export privacy and saved-project disconnect) and inline JavaScript syntax. Managed preview failed to start because the container could not mount proc; browser/device/live sync checks remain unverified.
