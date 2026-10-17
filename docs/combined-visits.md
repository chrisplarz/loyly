# Combined Visits page

Visits now contains the former Sessions controls above the visit log: Live timer, Post-visit entry, individual cycles, activity choices, session timeline, and existing help text. Sessions is removed from desktop navigation and from the page set. Both mobile and desktop navigation expose the same Visits destination.

Home Start session, Log a visit, saved-visit Edit, and save completion all route to Visits. The timer's refresh loop now updates on Visits. Switching entry tabs preserves the current draft and manual form state using the existing approach. Data storage, authentication, and cloud sync are unchanged; Set Intention remains reverted.

Changed files: index.html and dist/index.html; service-worker cache in sw.js and dist/sw.js; existing browser test expectations in appearance, cycles, and weather suites; new visits-page.test.cjs.

Verification: 14 automated Node checks passed, including real app execution with DOM/storage stubs for combined navigation, timer refresh/pause across tabs, and manual save/edit. Existing backup and sharing tests passed; inline JavaScript syntax and diff whitespace checks passed. Browser-only tests were updated but not run: preview infrastructure remains unavailable due to the previously observed proc-mount restriction. Mobile visual verification and live authenticated sync remain unverified.

Figma follow-up: move the session controls above the visit log in the Visits screen and remove the Sessions navigation item. No Figma file was changed. No database changes.
