# Quality bar

The portfolio is approved only when the animation is memorable, controlled, and subordinate to readable content. Visual polish and engineering correctness are both release requirements.

## Content and interaction

- No animation may obscure headings, navigation, project links, or contact actions.
- Every active scene remains understandable without decoding game mechanics.
- Every scene has visible navigation controls.
- Wheel, touch, and keyboard input never create overlapping transitions.
- Visitors can skip a transition without losing destination content.
- Focus remains visible and moves predictably when a destination scene is revealed.
- The Contact asset gallery scrolls independently from scene navigation.

## State and reliability

- One transition runs at a time.
- Rapid input does not produce overlapping animations or a broken state.
- Extra requests are ignored predictably while a transition is active.
- Reverse navigation and direct navigation resolve to stable scenes.
- Refreshing at a hash does not expose a half-completed transition.
- Asset failures resolve to reserved-size fallbacks rather than layout collapse.
- A guard timeout cannot leave navigation permanently locked.

## Visual quality

- Character movement remains crisp at common desktop and mobile resolutions.
- Portal alignment is correct when it crosses the anchored character.
- Character scale is intentional in travel and idle poses.
- Layer ordering keeps characters, obstacles, portals, and the background legible.
- Timing and easing make the start, travel, portal, and arrival beats easy to read.
- Ambient background motion is slow enough not to compete with content.
- Mobile scaling does not clip headings, controls, or scene assets.

## Performance

- Animation remains smooth without unnecessary particles or oversized assets.
- Asset sizes are reviewed before launch.
- Scene work does not create avoidable main-thread work or unbounded event listeners.
- Input listeners are cleaned up when the app unmounts.

## Accessibility

- Headings, links, buttons, and project content are present in the semantic document structure.
- Decorative animation is not announced as content by assistive technology.
- Keyboard navigation works without a pointer or gesture.
- Focus indicators remain visible against every scene background.
- Touch targets, skip controls, and visible section navigation are usable on small screens.
- Inactive scenes are not focusable while a different scene is active.

## Visual review checklist

Review every transition and idle state at representative desktop and mobile viewport sizes. Check:

- spacing;
- contrast;
- timing;
- portal alignment;
- character scale;
- arrival poses;
- scene reveal timing;
- fallback appearance; and
- focus visibility.
