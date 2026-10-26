# Weekly activity card

Home groups the calendar and all three activity metrics inside one card titled “This week's activity”. Its description reads “Tap a day to revisit or schedule an upcoming visit.” The week range aligns with the final date circle and cold plunge tile.

Date circles are Sunday first, with weekday labels below. A completed day displays a check inside a filled circle. Today receives an additional outer ring in both visited and unvisited states. A dot indicates a scheduled visit. Existing review, multiple-visit selection, planning, and scheduled-visit editing actions are retained.

Below a divider, equal tiles show Weekly visit goal, Sauna time, and Cold plunge time. The goal retains its target icon and displays the distinct completed-day count with a smaller denominator. Sauna and cold retain their flame/snowflake icons and activity colors. The goal opens Settings; time tiles open weekly Insights. There is no segmented progress bar, remaining-days copy, or progress explanation.

Only completed local visit dates through today count toward attendance and totals. Multiple visits on one day count once; all their recorded minutes contribute. Plans and stopped drafts never count. Unset goals offer Set goal, exceeded goals remain uncapped, and the week rolls over locally on Sunday.

The layout supports 320px through desktop with three side-by-side tiles, wrapping labels, visible focus and keyboard activation. Tests cover alignment, equal tile geometry, overflow, visited and unvisited today, multiple visits, planning, numeric goals, focus return and rollover.

Design references: Ølo Notes Design System ZFaJvHXzlUXyopMzk3kZm3. Weekly activity card component set 69:760 and review 69:761 compose existing variables, styles and icon components. No database, schema, authentication or dependency changes.

This is a focused GitHub integration of the Weekly Activity component already published on Sites in release 47. Other Sites changes and private design/prototype attachments are excluded. It is not a full snapshot of the latest Sites release.
