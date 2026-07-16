# Milestone 08: Responsive accessibility

## Goal

Adapt the complete portfolio for mobile and accessibility needs without removing its content or navigation.

## Inputs and required assets

- Complete animation and real portfolio content.
- Desktop and mobile viewport reference sizes.
- Keyboard, touch, and reduced-motion test environments.
- Screen reader-readable semantic content.

## Implementation scope

- Adapt scenes for mobile widths.
- Reduce particle counts and movement on smaller devices.
- Add keyboard navigation and visible focus states.
- Add and verify reduced-motion support.
- Confirm headings, links, buttons, and project content work without animation.
- Test screen reader-readable structure and normal browser scrolling.
- Ensure touch targets, skip controls, and visible section navigation remain usable.

## Explicit non-goals

- Do not solve mobile by only scaling down desktop scenes.
- Do not remove content to simplify responsive behavior.
- Do not require gestures, animation, or color alone for navigation.
- Do not add a new scrolling abstraction as a substitute for responsive design.

## Acceptance criteria

- Mobile scenes are intentionally composed and do not clip important content.
- Particle and motion budgets are reduced appropriately on small devices.
- Keyboard users can navigate, skip, and reach every section and action.
- Focus states are visible against every relevant background.
- Reduced-motion users see the same content and navigation.
- Screen reader users encounter a logical document structure with useful names and landmarks.
- Normal browser scrolling works on desktop and mobile.

## Manual visual checks

- Inspect representative narrow, medium, and wide viewport sizes.
- Test portrait and landscape mobile orientations where relevant.
- Verify no horizontal overflow, clipped headings, obscured actions, or tiny touch targets.
- Review focus visibility, skip control placement, and reduced-motion presentation.
- Inspect scenes at slower network conditions for layout stability.

## Automated tests

- Run Playwright keyboard and touch viewport tests.
- Run reduced-motion tests.
- Run accessibility checks for landmarks, headings, focus order, names, and contrast.
- Test normal scrolling and direct section navigation across representative viewports.

## Exit condition

The portfolio is intentionally adapted for mobile and remains fully usable with keyboard navigation, touch, screen readers, normal scrolling, and reduced motion.

