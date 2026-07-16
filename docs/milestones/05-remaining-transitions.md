# Milestone 05: Remaining transitions

## Goal

Implement and polish the remaining source-mode transitions, then verify them as one complete sequence.

## Inputs and required assets

- Ship, Ball, and Wave icons.
- Ball and Wave portals.
- Cube portal for destinations back to Hero.
- Obstacles, blocks, background, and approved decorations.
- The completed animation foundation and Cube-to-Ship transition.

## Implementation scope

Implement and review transitions for:

1. Ship to Ball.
2. Ball to Wave.
3. Wave to Contact completion.
4. Reverse navigation to earlier scenes using the current source-mode profile and destination portal.

For each transition:

- author its own source-mode values;
- author its own obstacle arrangement;
- author its own portal treatment;
- author its own character handoff;
- author its own arrival pose and idle state; and
- review it independently before chaining it with earlier scenes.

## Acceptance criteria

- Every source mode has a complete forward and backward treatment.
- Each arrival pose is stable and visually distinct.
- Direct navigation reaches the requested destination in one source-mode handoff.
- Contact completion does not leave a dangling transition or locked navigator.
- Repeated input does not overlap timelines or skip content unintentionally.

## Automated tests

- Add isolated tests for each source and destination pair.
- Add a complete forward-sequence Playwright test.
- Test direct navigation, reverse navigation, refresh, rapid input, and history hashes.

## Exit condition

All transitions work independently and through the complete sequence, with source-specific behavior and stable destination states.
