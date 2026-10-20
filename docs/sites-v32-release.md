# Sites v32 — Visit intention flow

Published October 20, 2026 at https://olo.chrisplarz.chatgpt.site with the existing owner-only audience.

- Sites project: `appgprj_6ad0ed618ee081918f2ce51dc0aca31c`
- Saved version: `appgprj_6ad0ed618ee081918f2ce51dc0aca31c~appgver_27800e9a8ea4819190e85e22c297bd31`
- Published source commit: `7056bffc65e034fa1f50463ec1de6c53c94d146f`
- Deployment: `appgdep_6ad7aa0d30a08191be66952bba0de466` — succeeded
- Source snapshot: [sites-v32-source.tar.gz](../releases/sites-v32-source.tar.gz)
- Source snapshot SHA-256: `59493456246988c089a9e796f76e1dd3d9b92a08074914bdcd0c2517a09700a8`
- index.html / dist/index.html SHA-256: `6b82430bde7d1d9431d06535d1783e4ec1a1ef21f0fcc8ca82142dfda6b03617`
- sw.js / dist/sw.js SHA-256: `8c495d4cff45d75877dd849ccea4481f717d6ecc10b3d36d07c744d52c987920`

The compressed snapshot is the complete tracked Sites source commit, including the exact published runtime. Root runtime, assets and tests also match that release. GitHub's newer AGENTS.md instructions are retained at the root; the snapshot preserves the original Sites instructions. This archive does not deploy GitHub Pages.

Home Set Intention opens Visits → Live timer → intention dialog. Saving persists a stopped upcoming visit; first session activates the same ID and records the actual date/start. Intention lives below the activity controls, with Edit and Remove actions. Drafts do not contribute to completed totals. Explicit discard, legacy-intention migration/review, optional reflection, history, JSON/CSV/recovery backups, and existing sync remain supported. Intention timeline remains deferred. See [intentions-design.md](intentions-design.md) for migration and backup rules.

Validation: 30 Node checks passed. All 31 unique browser cases passed across the existing regression run and the final intention/backup run; the latter includes recovery export and 320px controls. Main flow verified at 390px and 1280px with short-viewport, focus and failure-recovery checks. Authentication, session refresh, sync and sign-out use mocked Supabase responses. Published private Site returned HTTP 200 with the new flow. No schema, database, RLS, credentials or origin changes.

Figma: reused existing Ølo Notes Design System patterns; updated intention-card Upcoming/Active labels, headings and usage plus dialog flow guidance. No new tokens or components. Production Georgia quote typography is preserved.

Unverified: physical iPhone Safari/keyboard behavior and real-account cross-device sync. No personal journal/cloud records were changed during QA.
