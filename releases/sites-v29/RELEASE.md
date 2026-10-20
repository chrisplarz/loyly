# Sites v29 — Figma tile copy

Saved version: appgprj_6ad0ed618ee081918f2ce51dc0aca31c~appgver_bf33ddfb4dd48191bb435f25cb53ba7b
Source commit: b026da326b16ac639aac581a132190932c077492
Source Git tree: a78ee3978f28d1812637ecd1474d5f163251c074
Site: https://olo.chrisplarz.chatgpt.site

Correct Home metric labels to Visits, Sauna, and Cold Plunge. Remove This week from each visible label and remove the goal/warmth/cold footer copy, matching the current Figma metric component (6:116). Keep the two-line label slot, live totals, accessible weekly context, navigation, and existing interaction styling.

Modified source files: index.html and dist/index.html; sw.js and dist/sw.js advance the offline shell to v29. No database or Figma changes are needed. Insights period-specific copy and visit details are outside this correction.

Passed exact-label/footer, live total, state, focus, Rest detail, and overflow checks at 320px, 390px, and 1280px; visually reviewed mobile and desktop screenshots. Both existing Home/Visits browser checks passed. Source/dist equality and whitespace checks passed. Physical iPhone Safari and live cloud sync were not exercised.

source.tar.gz contains the complete exact tracked Sites source, including deployment output and assets. SHA-256: f64f58fbe6183fb76d56e972f59af902acddd499efc2f12d4c6ac04b7cb3e219.

The snapshot preserves unpublished root application changes already present in GitHub. No GitHub Pages deployment is requested.
