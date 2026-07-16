# Milestone 07: Portfolio content

## Goal

Add real portfolio information after animation completion while keeping the content semantic, readable, and independent from animation logic.

## Implementation scope

- Add real Hero, About, Projects, and Contact content.
- Keep content semantic and independently readable within the controlled scene layout.
- Add project cards or case studies without coupling their content to animation logic.
- Add resume, email, social, and project links.
- Confirm every action remains reachable through visible controls and scene skips.
- Preserve headings, link names, document order, and stable section hashes.

## Explicit non-goals

- Do not rewrite the approved animation system to fit unreviewed copy changes.
- Do not hide project or contact information behind a transition.
- Do not add content that requires a backend unless separately approved.
- Do not remove asset fallbacks or scene recovery behavior.

## Acceptance criteria

- All four scenes contain real, reviewed content.
- Projects and contact actions are reachable through visible navigation and keyboard controls.
- Content remains readable during and after transitions.
- Skip paths expose the same portfolio information.
- Project and contact links are valid and clearly labeled.
- Animation modules can change without requiring content components to change.

## Exit condition

Real portfolio content is integrated without coupling it to animation logic, and every key action remains available through visible navigation and skip paths.
