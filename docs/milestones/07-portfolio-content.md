# Milestone 07: Portfolio content

## Goal

Add real portfolio information after animation completion while keeping the content semantic, readable, and independent from animation logic.

## Inputs and required assets

- Approved standalone animation system from Milestone 06.
- Final Hero, About, Projects, and Contact copy.
- Project images or case-study assets.
- Resume, email, social, and project links.
- Approved logo, wordmark, favicon, and social preview metadata.

## Implementation scope

- Add real Hero, About, Projects, and Contact content.
- Keep content semantic and independently readable.
- Add project cards or case studies without coupling their content to animation logic.
- Add resume, email, social, and project links.
- Confirm animation can be skipped without losing content.
- Preserve headings, link names, document order, and stable section anchors.

## Explicit non-goals

- Do not rewrite the approved animation system to fit unreviewed copy changes.
- Do not hide project or contact information behind a transition.
- Do not add content that requires a backend unless separately approved.
- Do not remove fallbacks or reduced-motion behavior.

## Acceptance criteria

- All four sections contain real, reviewed content.
- Projects and contact actions are reachable through normal scrolling and visible navigation.
- Content remains readable during and after transitions.
- Skip and reduced-motion paths expose the same portfolio information.
- Project and contact links are valid and clearly labeled.
- Animation modules can change without requiring content components to change.

## Manual visual checks

- Check content density, line length, hierarchy, spacing, and contrast at desktop and mobile sizes.
- Confirm animation does not obscure headings, project links, or contact actions.
- Check project image cropping and fallback behavior.
- Check the page when animation is skipped and when reduced motion is enabled.

## Automated tests

- Test every section heading, primary link, project link, contact action, and resume link.
- Test skip and reduced-motion paths for content parity.
- Run accessibility checks for landmarks, heading structure, link names, and focus order.
- Run Playwright tests with realistic content fixtures.

## Exit condition

Real portfolio content is integrated without coupling it to animation logic, and every key action remains available through normal browsing, skip, and reduced-motion paths.

