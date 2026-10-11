
# Löyly — Codex Development Instructions

## Product Overview
Löyly is a mobile-first Nordic spa journal for tracking
sauna sessions, cold plunges, visits, mood, and wellness trends.

## Source of Truth
- GitHub owns production code.
- Figma owns approved visual designs.
- Supabase stores synced user data.
- ChatGPT helps define features and acceptance criteria.

## Development Workflow
1. Review the existing code before making changes.
2. Use a new feature branch for each enhancement.
3. Follow approved Figma designs when provided.
4. Reuse existing components and patterns.
5. Keep changes focused and reversible.
6. Test before requesting a merge.
7. Create a pull request for review.

## Design Standards
- Preserve the calm, Nordic visual aesthetic.
- Prioritize iPhone-friendly responsive layouts.
- Maintain consistent typography, spacing, and colors.
- Follow accessibility best practices.
- Use existing design tokens whenever possible.
- Avoid unnecessary visual changes.

## Functional Standards
- Preserve all existing journal functionality.
- Maintain Supabase authentication and cloud sync.
- Never delete or overwrite user data.
- Preserve existing data export/import functionality.
- Support both desktop and mobile browsers.
- Avoid adding dependencies unless necessary.

## Testing
Before completing a task:
- Run available build and test checks.
- Verify modified functionality.
- Check mobile responsiveness.
- Review potential effects on existing features.
- Document any untested behavior.

## Data Security
- Never expose Supabase secret or service-role keys.
- Public configuration keys may be used client-side
  only with appropriate access controls.
- Never disable database security policies.
- Request approval before destructive migrations.

## Figma Synchronization
- Implement approved Figma frames faithfully.
- Identify UI components affected by code changes.
- Document changes requiring Figma updates.
- Do not assume code automatically syncs to Figma.

## Completion Requirements
For every completed development task, provide:
1. Summary of changes.
2. Files modified.
3. Tests performed and results.
4. Any database changes.
5. Any Figma updates needed.
6. Pull request link or next review step.

## Important
Do not push unreviewed changes directly to main.
Preserve existing working features unless explicitly
instructed otherwise.
