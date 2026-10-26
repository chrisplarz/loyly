# Metric Card label alignment — shell 53

Vertically centers each Home tile label with its adjacent icon, as requested in the annotated browser review. Removes the desktop label’s empty second-line slot so single-line labels center correctly; wrapped labels center as a block. Narrow cards keep the existing icon-above-label composition and left alignment. Typography, palette, hover/press feedback and navigation are unchanged.

Verified icon/text centers in the responsive metric browser checks at 320, 390, 768 and 1280px. Prepared through the guarded release workflow. No database changes, new dependencies or new Figma patterns.

## Intention removal review

Removed the redundant Discard draft action from an upcoming, unstarted visit. The intention card’s trash icon is the single intention-removal control and preserves the upcoming visit ID. The active visit cancellation action remains available as Discard visit, clearly separate from removing an intention. Existing regression scenarios verify removal storage failures, persistence, upcoming-ID preservation and active-visit cancellation. No user data is removed as part of deployment.
