# Source synchronization and release guard

The October 20 visual drift was real source divergence. The Sites source repository contained older bottom navigation, sidebar markup and daily-thought copy than approved GitHub main. Publishing an intention feature from that checkout preserved the older UI. The previous tests checked functionality but did not catch this visual regression, and an unmerged archive PR left GitHub main behind the published feature.

Sites uses its own source repository. GitHub and Figma do not automatically receive or supply changes. The fix reconciles the approved shared UI into Sites, retains the intention feature, and enforces a checked release path.

## Before editing

1. Open the existing project with the Sites source helper.
2. Run `node scripts/release.mjs check --online` before editing. It verifies the prepared runtime, deployment output, and current GitHub main. A GitHub metadata-only change or the merge of the exact previously prepared runtime is accepted. An unknown runtime change stops the workflow.
3. Inspect affected Figma references. The restored baseline uses Ølo Notes Design System `ZFaJvHXzlUXyopMzk3kZm3`: Bottom navigation `4:49`, Sidebar `4:17`, Daily thought `6:397`; intention card/dialog remain `6:396` / `7:78`. Use the later approved GitHub sidebar lockup and thought copy, and retain Georgia in production as required by AGENTS.md.
4. On a fresh checkout, inspect existing Git hooks before enabling `git config --local core.hooksPath .githooks`. This task installed the tracked hooks in the Sites checkout. CI runs the same checks independently.

## Prepare and publish

Set the next matching `loyly-journal-shell-vN` revision in sw.js. Run:

```sh
node scripts/release.mjs prepare --version N
node --test tests/release.test.cjs tests/backup.test.cjs tests/chatgpt-share.test.cjs tests/intentions.test.cjs tests/planning.test.cjs
```

Preparation fetches GitHub main read-only and compares every runtime file against the reviewed baseline or last prepared release. Unknown upstream changes fail before source/output are changed. After reconciliation it derives dist from the canonical root files, writes the `olo-release` meta value, and records file hashes in `.openai/source-sync.json`. Static assets and icons are included. No journal or account data is read or changed.

Run the browser suites in `.github/workflows/backup-tests.yml`, including `tests/design-parity.browser.test.cjs`. The new parity checks protect the cream icon-and-label navigation pill, regular mobile labels, sidebar wordmark/tagline, clean Read more/Read less copy, and Georgia quote typography at 320/635/1280px. Intention navigation is covered separately by its lifecycle browser tests.

The final Sites source-helper packaging commands must include:

```sh
node scripts/release.mjs check --online
```

This refuses source/output differences, a runtime edited after preparation, mismatched release/cache identifiers, or GitHub changes since review. A blocked check must be resolved before publication. Commit and push hooks repeat the offline/online checks respectively; they do not silently regenerate files or accept a new baseline.

## Reconcile drift explicitly

If GitHub changes are unknown, fetch and compare them with the current Sites runtime and approved Figma design. Preserve both working versions while applying the intended differences. After review, record the reconciled GitHub commit and its runtime hashes in `.openai/source-sync.json`, then prepare, test and publish. Do not bypass a drift failure by blindly replacing the lock file or copying an older index.html over current features.

If preparation reports extra dist files, review and remove only obsolete generated output; never clear browser storage or journal data. If the source/output pair was edited after preparation, prepare and test again.

## Finish all three checks

- Verify the live page shows release N and the approved appearance at matching mobile/desktop widths. Read-only live checks are appropriate; test writes use isolated sample contexts.
- Export the exact pushed Sites source commit, archive through a GitHub feature PR, inspect its runtime diff and successful CI, and merge. Confirm GitHub main runtime hashes match `.openai/source-sync.json` and the published package. Keep development instructions and historical source snapshots where useful.
- Record the Figma nodes reviewed and any actual design updates. Figma remains the design reference; no automatic bidirectional design sync is claimed.

A source guard cannot configure a platform-wide integration that Sites does not expose. It enforces this repository’s publishing workflow and makes an unrecognized source change fail visibly. No permanent deployment credentials are added to GitHub, and GitHub Pages is not deployed.
