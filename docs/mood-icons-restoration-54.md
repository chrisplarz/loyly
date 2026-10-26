# Restore the approved mood faces — local candidate 54

The original mood-face implementation remained unpublished in `sites/olo-metric-cards` after the user interrupted its GitHub publication to add dialog changes. It was never committed to GitHub or deployed to Sites. Later releases therefore retained the old text-only controls. The source parity guard did not detect unpublished work in another checkout; this restoration adds dedicated mood coverage to the current CI workflow.

Reused the five original unchanged 32 × 32 SVGs and the exact approved selector markup/styles. Rechecked app Figma component `69:1401`, file `2xNboef6xqT9T3EHYEyNQm`, against its high-fidelity design context and screenshot. The separate design system provides supporting foundations. The current form, dialogs, account behavior, tile states and intention controls are preserved.

Labels: Upset, Down, OK, Good, Excellent. Numeric values remain 1–5. Selected backgrounds use the original per-mood colors. Desktop gaps cap at 64px; widths at or below 768px use equal space-between spacing without wrapping. Assets are included in the offline cache. No database changes, migrations, dependency additions, or Figma edits.

Focused browser tests cover nine widths from 280 to 1920px, asset loading and geometry, labels, selected-state colors, saving numeric values, and restoring selected values when editing. All 45 Node and 102 browser checks passed. Actual DM Sans and unchanged SVG artwork verified at phone and desktop sizes. User explicitly approved publishing this focused restoration on 26 October 2026.
