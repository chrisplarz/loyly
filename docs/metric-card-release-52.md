# Metric Card release 52

Matches the approved Ølo Notes Metric Card component `6:116` in Figma file `ZFaJvHXzlUXyopMzk3kZm3`: uppercase DM Sans labels, bold Manrope metric numbers (38px desktop / 27px mobile), muted 11px units, the activity-colored 1px hover outline, and darker activity-colored press fills. Existing Home icons and composition remain intact. Pointer feedback clears on release, cancellation, pointer exit, scrolling, blur and hiding the page. Keyboard focus remains visible. All three Home tiles open weekly Insights.

## Source reconciliation

Sites was still on shell 48 (`6dcb20327b51cc81e6fc6fedf6059a0e9b07c4a5`). Before publishing, compared it with reviewed GitHub main `c90bad809828f50b6b03b170627f163a746854ad` (shell 51). The GitHub index exactly matches the baseline used for local metric development. Reconciled those approved runtime and regression-test updates into Sites, then applied the focused metric change. Retained the pre-existing Sites activity prototype asset. Recorded the reviewed baseline in `.openai/source-sync.json` and used the official release preparation command to generate shell 52 output.

## Verification

The reviewed metric implementation passed 45 Node and 93 browser checks. Compared actual-font renders at mobile and desktop sizes with the component states; retained the Home icons. The source checkout repeats checks after reconciliation, and the final packaging guard checks online source/output parity. No user attachments or private QA screenshots are included in the source or deployment archive.

No database changes, policy changes, dependency additions or Figma updates. Account behavior from approved GitHub shell 51 is preserved; this tile work does not claim additional production Auth/backend acceptance beyond that release's documented verification.
