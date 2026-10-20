# Sites v33 — Restore approved appearance and prevent source drift

Published October 20, 2026 at https://olo.chrisplarz.chatgpt.site with the same owner-only audience and origin.

- Published source commit: `91ea6d98f0bcf7f39d7872d2e6baf81155545d65`
- Version: `appgprj_6ad0ed618ee081918f2ce51dc0aca31c~appgver_4392c1a5c6a0819194b270909294acc5`
- Deployment: `appgdep_6ad7adf0af148191aacbd7a2362cab1e` — succeeded
- Public source snapshot (user attachment excluded): [sites-v33-source.tar.gz](../releases/sites-v33-source.tar.gz)
- Snapshot SHA-256: `d1e08ae4d8d419302f5665d2def29c736a37302a6b04904a34fad99e6bbea9a5`
- index.html / dist/index.html SHA-256: `143e6f7c0e234d5455381fae012483dd3b2843ee4fc814a7779d3bd20c4d5a80`
- sw.js / dist/sw.js SHA-256: `5aa1cabff35d3b930cb1c8fdaafa96851358878adda5fd34d7656bbd1aa593f4`

The root runtime/assets match the exact published source; the compressed archive preserves the published code while deliberately excluding the user-provided screenshot reference. The older v32 snapshot is retained as historical evidence, not as the current visual baseline. GitHub Pages is not deployed.

Restored approved GitHub navigation, sidebar lockup and daily-thought treatment while retaining the v32 intention lifecycle. Figma references: Bottom navigation 4:49, Sidebar 4:17, Daily thought 6:397, Intention card/dialog 6:396 and 7:78 in ZFaJvHXzlUXyopMzk3kZm3. No Figma mutation or new token/component was required. Georgia remains the app quote font.

Added a guarded release command, runtime fingerprints, source/dist derivation, online GitHub drift detection, checked-in commit/push hooks, design-parity tests and CI checks. The Sites checkout has the hooks installed. Future fresh checkouts must enable them as documented. An unknown GitHub runtime or stale build output now blocks this publishing workflow. See [source-synchronization.md](source-synchronization.md).

Validation: 36 Node checks passed, including failure cases for the release guard. All 36 browser cases passed across the full regression run and corrected design-parity run, including 320/390/635/1280px, restored styling, intention navigation, timer/draft activation, failures/retry, migration, backup/export/import and mocked authentication/sync. HTTP 200 and live release-33 source/appearance were verified after deployment. CI must pass before the archive PR is merged; then the online guard must confirm GitHub main matches the prepared runtime.

No database, account, RLS, cloud-project, journal-key or origin changes. No personal journal records were modified by QA. Physical iPhone Safari/keyboard and real-account cross-device sync remain outside this automated verification.
