# Ølo Notes — Sites v28

Published URL: https://olo.chrisplarz.chatgpt.site
Sites source commit: c4eec14b370a25611a4a3be019e3dea2191838d8
Sites source Git tree: 51b828e35b47a3c5f5b13ac45b9959af0007dabf
Saved version: appgprj_6ad0ed618ee081918f2ce51dc0aca31c~appgver_ec2f2373c570819187fdcca792b8ab96

## Exact source archive

source.tar.gz contains the complete tracked source of the published Sites release, including deployment files and assets. SHA-256: a572f6fd4ba3759deebceb6dd3334ddb7a2d8b5130ae73e3ea2802320ec898de.

The snapshot is separate from the root application because GitHub main also contains reviewed changes (#23 and #24) that have not been published in Sites. This release does not overwrite those changes or publish them implicitly. No GitHub Pages deployment is requested.

## Button changes since Sites v27

Modified index.html and dist/index.html, and advanced the shell cache in sw.js and dist/sw.js to v28. The source and dist mirrors match.

- Reuse Figma Button 3:441: Primary, Light, Outline, Ghost, and Danger.
- Use 13px bold DM Sans, 18.2px line height, 12px radius, 12px by 18px padding, 9px icon gap, and 16px existing source icons. Buttons have a 43px minimum height; Outline has a 45px minimum. Existing narrow-phone padding and contextual hero/timer colors remain.
- Apply the source-backed 1.09 hover brightness only for enabled controls on devices supporting hover; remove hover movement.
- Apply 2px pine keyboard focus rings, using heat for Danger, without shifting neighboring controls.
- Disabled controls keep 40% opacity, a not-allowed cursor, and no hover or pressed effects. High-contrast mode uses system focus and disabled colors.
- Pressing an enabled button restores its base appearance instead of its hover brightness. Figma currently has no separate Press variant; this uses the existing base state, without inventing new design tokens.

## Validation

18 existing checks passed: backup unit/browser checks, Home/Visits refinements, intentions lifecycle, and multi-activity cycles. Additional browser checks passed at 390px (touch) and 1280px for all five variants, hover/press/keyboard focus/disabled, stable control dimensions, 16px source icons, keyboard activation, intention saving, overflow, and high-contrast focus. Screenshots were visually compared with Figma. Source/dist equality and diff whitespace checks passed.

No database, authentication, cloud-sync algorithm, or user-data changes. Physical iPhone Safari and live signed-in cloud sync were not exercised.

Design: https://www.figma.com/design/ZFaJvHXzlUXyopMzk3kZm3?node-id=3-441
Figma follow-up: optionally document that Press reuses Default; no component or visual updates are required for the current design.
