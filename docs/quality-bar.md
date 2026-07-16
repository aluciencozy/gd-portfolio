# Quality bar

The portfolio is approved only when the animation is memorable, controlled, and subordinate to readable content. Visual polish and engineering correctness are both release requirements.

## Content and interaction

- No animation may obscure headings, navigation, project links, or contact actions.
- Every section remains understandable without animation.
- Every section has a visible navigation fallback.
- No transition traps keyboard or touch users.
- Visitors can skip the intro and bypass a transition without losing content.
- Focus remains visible and moves predictably when a destination section is revealed.

## State and reliability

- One transition runs at a time.
- Rapid input does not produce overlapping animations or a broken state.
- A queued request is limited and resolves predictably.
- Reverse navigation and direct section navigation resolve to stable scenes.
- Refreshing at any section does not expose a half-completed transition.
- Asset failures resolve to reserved-size fallbacks rather than layout collapse.
- No layout shift occurs when assets load.

## Visual quality

- Character movement remains crisp at common desktop resolutions.
- Portal alignment is correct at the moment of entry and arrival.
- Character scale is intentional in both travel and idle poses.
- Layer ordering keeps characters, obstacles, portals, and foreground decorations legible.
- Spacing and contrast support quick scanning of section content.
- Timing and easing make the start, travel, portal, and arrival beats easy to read.
- Idle states are subtle enough not to compete with content.
- Mobile is intentionally adapted, not merely scaled down.

## Performance

- Animation remains smooth without unnecessary particles or oversized assets.
- Asset sizes are reviewed before launch.
- Large raster assets use an appropriate compressed format.
- Scene work does not create avoidable main-thread work or unbounded event listeners.
- Reduced-motion mode removes unnecessary movement and atmosphere while preserving the experience structure.

## Accessibility

- Reduced-motion mode exposes the same content and navigation.
- Headings, links, buttons, and project content are present in the semantic document structure.
- Decorative animation is not announced as content by assistive technology.
- Keyboard navigation works without a pointer or gesture.
- Focus indicators remain visible against every scene background.
- Touch targets and skip controls are usable on small screens.
- Normal browser scrolling remains available.

## Visual review checklist

Review every transition and idle state at representative desktop and mobile viewport sizes. Check:

- spacing;
- contrast;
- timing;
- portal alignment;
- character scale;
- arrival poses;
- section reveal timing;
- fallback appearance;
- focus visibility; and
- reduced-motion presentation.

