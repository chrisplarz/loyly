# Mobile bottom navigation

Implements the approved [Ølo Notes Figma component, node 4:49](https://www.figma.com/design/ZFaJvHXzlUXyopMzk3kZm3?node-id=4-49).

- Opaque paper surface and line border.
- A warm button-light selection pill encloses both icon and label.
- DM Sans Regular, 11 px / 17.6 px; source icons render at 22 × 22 px.
- Four equal destinations: Home, Visits, Insights and Profile.
- The navigation is 71 px high before the device safe-area inset. Buttons are 61 px high.
- The current destination retains aria-current=page. Keyboard focus has a visible pine outline.
- Existing navRender(), sections and icon() helpers are reused. The icons are exact source matches documented in Figma; no replacement assets or dependencies are added.
- The existing 680 px breakpoint and desktop sidebar behavior are retained.
- Reduced-motion preferences disable the selection-background transition.

The Figma button-light token is exposed as --olo-button-light. No new design pattern or Figma visual update is required. The user approved the five Code Connect mappings. Figma rejected all five with 'Published component not found'; library publication is required before they can be registered.

The service-worker shell cache advances to v27 so the revised markup and CSS can reach installed clients. Journal storage, exports, authentication and cloud synchronization code are unchanged.

Validation: 21 Node regression checks and 11 existing appearance browser checks passed. Mobile navigation was visually inspected at 360, 390, 430 and 680 px, with desktop sidebar behavior checked at 1280 px. All four destinations and keyboard focus/activation were checked. Physical iPhone safe-area and signed-in production sync were not exercised.

