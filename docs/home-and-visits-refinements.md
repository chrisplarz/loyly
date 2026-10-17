# Home and Visits refinements

Home metric tiles are native buttons: Visits focuses and scrolls to Recent Visits; Sauna and Cold open weekly Insights. Weekly rhythm uses deeper pine green and its heading is now Visits this week.

Profile offers AI inspiration, Quotes from Tolle (the default), and Zen principles. The existing 30 original AI reflections remain bundled. Five short attributed Tolle excerpts include links to their verified official pages; accompanying text is separately labeled as original Ølo Notes reflection. Five original Zen-inspired reflections are provided. There is no live quotation API. Selection is stable per local day and per topic. The profile choice uses existing profile persistence/sync and is included in backups.

Tolle sources:
- https://teachings.eckharttolle.com/the-power-of-presence-sign-up-for-a-free-video-series-with-eckhart-tolle/
- https://teachings.eckharttolle.com/awakening-presence-in-times-of-adversity/
- https://eckharttolle.com/finding-balance/
- https://eckharttolle.com/eckhart-on-our-creative-universe/
- https://eckharttolle.com/falling-below-and-rising-above-thought/

Timer help is behind an accessible info button in the timer's upper-left corner. A native dialog places the phone-overheating warning first, followed by timestamp/draft guidance. Recent Visits initially shows the newest five; when more exist, See all visits expands the collection and Show recent visits collapses it. Add visit aligns to the collection's right edge. The Insights attendance denominator has normal letter spacing and a visible gap.

No backend, authentication, or schema changes. Figma follow-up: metric links, richer weekly colors, thought-topic settings and attribution, timer help dialog, Recent Visits expansion and alignment.

Validation includes existing Node and browser regressions plus a dedicated 390px/1280px browser suite covering tile activation, log focus/alignment, expansion, info placement/order/Escape, denominator spacing, preference persistence, backups and save failure. The prior local thought implementation passed 17 Node checks before a workspace outage blocked publication. These combined refinements were subsequently prepared through GitHub while the workspace connection remained unavailable.
