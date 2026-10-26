# Weekly activity card — release 47

Replaces the Home weekly composition with one enclosing card: title and right-aligned range, description, date circles and weekday labels, divider, then three equal metric tiles. Completed dates use checks; today uses an outer ring. Goal is a numeric count and denominator. Existing day review, planning, Settings, and weekly Insights actions are reused.

Data rules are unchanged: completed distinct local visit dates count once, only completed visits through today contribute minutes, and plans/drafts never contribute. No database or authentication changes.

Figma: ZFaJvHXzlUXyopMzk3kZm3. Reviewed foundations 3:187 and 3:241, metric 6:68, weekly patterns 34:381 / 37:796 / 37:812. Added Weekly activity card 69:760 (Desktop 69:628, Mobile 69:694) and instance review 69:761 using existing semantic variables, text styles, and target/flame/snow icon components. Previous patterns remain available. No new variables.

Validation covers 320, 390, 768, 1024 and 1280 px: tile equality/containment, date alignment, no horizontal overflow, completed-day keyboard review/focus return, today both visited and unvisited, real totals, multiple visits on one day, unset/exceeded goals, week rollover, plans, calendar handoff and errors. Existing logo-image assertions were stale against the current approved text wordmark; assertions now verify the wordmark text without changing production branding.

The earlier standalone prototype asset is retained byte-for-byte; it is not used as the homepage.
