# Sites release 43 recovery

The hosted Site was active at saved version 34 (shell 37). Settings jump navigation existed only in a local preview. The source repositories had diverged; no service outage was confirmed.

Opened the latest hosted source commit 3a82aed72534c5caa06c162d91b5287f3e99e3a4 in a separate recovery checkout. Selectively integrated the completed SectionJumpNav implementation, preserving all existing hosted Settings heading icons, planner, branding, navigation, journal, authentication and sync code. Unrelated local draft changes were left in their original checkout.

Changed index.html, sw.js, generated dist equivalents and .openai/source-sync.json; added tests/section-jump-nav.browser.test.cjs and its CI invocation. No database changes or account/data operations.

All 106 Node/browser checks pass. Eight jump-navigation cases cover 320/390/768/1280 widths with reduced motion on/off, active selection, 20px heading offset, manual scroll, no horizontal overflow, unchanged journal storage and remount. Source/output and online GitHub parity checks pass.

Existing visual references recorded by the originating implementation: design system ZFaJvHXzlUXyopMzk3kZm3 Navigation 2:5, Tab variants 4:73 / 4:78, Icons 2:3; app 2xNboef6xqT9T3EHYEyNQm Profile 10:6206. No new visual design was introduced during recovery. Figma still needs the reusable SectionJumpNav component and matching Settings screen; synchronization is not automatic.

Local browser visual review passed. Signed-in live browser review was blocked by automatic approval at the OpenAI authentication origin. Production authentication and actual cloud synchronization remain unverified; tests use isolated sample data and mocks.
