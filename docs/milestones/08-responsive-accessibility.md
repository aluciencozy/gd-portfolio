# Milestone 08: Responsive accessibility

## Goal

Adapt the complete portfolio for mobile and accessibility needs without removing its content or navigation.

## Implementation scope

- Adapt scenes for mobile widths and orientations.
- Reduce unnecessary decoration on smaller devices.
- Verify keyboard navigation and visible focus states.
- Confirm headings, links, buttons, and project content work without relying on animation timing.
- Test screen-reader-readable structure and controlled wheel/touch navigation.
- Ensure touch targets, skip controls, and visible scene navigation remain usable.

## Explicit non-goals

- Do not solve mobile by only scaling down scenes if review identifies clipping.
- Do not remove content to simplify responsive behavior.
- Do not require a gesture, animation, or color alone for navigation.
- Do not add a new scrolling abstraction as a substitute for responsive design.

## Acceptance criteria

- Mobile scenes do not clip important content.
- Keyboard users can navigate, skip, and reach every scene and action.
- Focus states are visible against every relevant background.
- Screen-reader users encounter a logical document structure with useful names and landmarks.
- The Contact gallery remains independently scrollable.

## Exit condition

The portfolio is intentionally adapted for mobile and remains usable with keyboard navigation, touch, screen readers, visible controls, and stable scene recovery.
