# Milestone 05: Remaining transitions

## Goal

Implement and polish the remaining authored transitions individually, then verify them as one complete sequence.

## Inputs and required assets

- Ship, Ball, and Wave icons.
- Ball and Wave portals.
- Obstacles, blocks/platforms, background, and foreground layers as required by each scene.
- Completed animation foundation and Cube-to-Ship transition.
- Test section labels instead of real portfolio content.

## Implementation scope

Implement transitions in this order:

1. Ship to Ball.
2. Ball to Wave.
3. Wave to Contact completion state.

For each transition:

- author its own timing;
- author its own obstacle arrangement;
- author its own portal treatment;
- author its own character handoff;
- author its own arrival pose and idle state;
- support reset, reduced motion, and stable destination reveal; and
- review it independently before chaining it with earlier transitions.

## Explicit non-goals

- Do not add real About, Projects, or Contact copy.
- Do not treat the three transitions as one generic timeline.
- Do not add backend behavior.
- Do not make progression mandatory for accessing a destination section.

## Acceptance criteria

- Ship-to-Ball, Ball-to-Wave, and Wave-to-Contact each have a distinct authored treatment.
- Each scene works independently and in the complete forward sequence.
- Each arrival pose is stable and visually distinct.
- Contact completion does not leave a dangling transition or locked navigator.
- Direct section navigation and reduced motion reach the same readable destination states.
- Repeated input does not overlap timelines or skip content unintentionally.

## Manual visual checks

- Review each transition at desktop and mobile viewport sizes.
- Check obstacle readability, portal alignment, character scale, easing, and arrival pose for each mode.
- Review the complete sequence from Hero through Contact for visual rhythm and accumulated state errors.
- Confirm each destination section becomes readable at the correct time.

## Automated tests

- Add isolated tests for each source and destination pair.
- Add a complete forward-sequence Playwright test.
- Test direct navigation, reverse navigation where supported, refresh, rapid input, and reduced motion.
- Verify the navigator unlocks after Contact completion.

## Exit condition

All transitions work independently and through the complete sequence, with their own authored behavior and stable destination states.

