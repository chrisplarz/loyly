# Home and Visits refinements — shell release 55

The Home week range now has stable Today/Back/Next controls. Dates, attendance and exposure totals follow the selected week, and metric links open that same week in Insights. Past numeric dates use muted moss; completed checks and today's ring stay clear. The Fort Union card shows the supplied address and regular hours, an Open now pill based on America/Denver, a map link, and the existing calendar planner. It sits beside Today's Thought from1000px upward, stacks below on smaller screens, and does not stretch when the thought expands.

Fort Union:7198 S Union Park Ave, Midvale UT84047. Regular hours: Mon–Thu6am–9pm, Fri–Sat6am–10pm, Sunday8am–2pm. Status derives from these regular hours, not a live business API.

Activity buttons reuse the exact source-matched icons and Figma default/selected border colors. Timer backgrounds use subtle activity-colored circular gradients. Their waves expand from top center, taper from5px to0.6px, and fade downward. Ripple speed eases to a stop/resumes over1.4seconds with the timer controls while retaining phase. Home's existing rings expand and settle over7.2seconds on entry, with a gentle button hover/press response. Reduced motion is respected.

End Visit opens one shared confirmation with Keep going and an owner-scoped device-local Do not show again preference. Cancellation changes nothing. Confirming captures the final session and locks additional sessions, then opens reflection. Existing session details remain correctable. The new endedAt marker is stored with newly ended visits; existing records are not migrated. Dialog primary actions appear first on the left. Signed-in headers greet the user's first name and preserve avatar/account-dialog behavior.

Changed runtime files: index.html and sw.js, generated dist equivalents and source-sync manifest. Supporting changes: focused Home/Visits tests, existing test harness/flow updates, CI and this document. No database schema, authentication, or hosting-audience changes. Private journal/design references and screenshots are excluded from source and GitHub.

Validation:45/45 Node checks and119/119 browser checks passed. Coverage includes calendar/time-zone boundaries, responsive cards, matching selected-week Insights, year/midnight navigation, modal cancellation/failure/dismissal, ended-visit persistence, greeting escaping, hover/reduced motion, smooth pause/resume, existing mood icons, backups, accounts, and design parity. Desktop and390px phone visual review passed; the user's paused draft was not ended. Existing production cross-device authentication/email acceptance gaps remain outside this UI release; mocks do not establish those guarantees. Physical iPhone motion rendering was not exercised.

Figma references reviewed: ZFaJvHXzlUXyopMzk3kZm3 nodes34:381,76:737 and3:664; original mood assets from2xNboef6xqT9T3EHYEyNQm69:1401 remain unchanged. Existing card/button/dialog foundations are composed without new semantic tokens. Final Home composition, motion and End Visit screen synchronization to Figma remains outstanding; code and Figma do not synchronize automatically.

Publishing workflow: exact tested Sites source/artifact, unchanged audience, then reviewed GitHub archive PR and successful CI before merge. Deployment/version/merge identifiers are retained in the private release record.
