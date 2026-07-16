# Milestone 02: Animation foundation

## Goal

Build the reusable viewport-sized transition scene and navigation seam that all authored transitions will use.

## Inputs and required assets

- Temporary neutral placeholders or ingested characters and scene objects.
- The [experience model](../experience-model.md).
- The `SceneNavigator` interface in the [technical architecture](../technical-architecture.md).
- Test labels instead of real portfolio content.

## Implementation scope

- Build the viewport-sized transition scene.
- Add character positioning, portal positioning, obstacle positioning, and explicit layer ordering.
- Add the navigation lock so only one transition runs at a time.
- Normalize scroll, button, keyboard, and touch requests through the navigator.
- Add reduced-motion behavior using short fades or direct section changes.
- Add safe reset and recovery behavior for interruption, timeout, and asset failure.
- Add test labels and destination markers without real portfolio copy.

## Explicit non-goals

- Do not implement the complete intro sequence.
- Do not polish the authored Cube-to-Ship transition.
- Do not add real portfolio content.
- Do not add Lenis, GSAP, or another scrolling abstraction.

## Acceptance criteria

- A generic transition can be triggered from every supported input type.
- A transition can be interrupted safely, completed, and reset.
- A second transition cannot start while one is active.
- At most one extra request is ignored or queued according to the documented rule.
- Reduced-motion navigation reaches the same destination content state.
- A failed asset or transition does not leave navigation permanently locked.
- The transition scene fully covers the viewport without creating unintended persistent overflow.

## Manual visual checks

- Trigger the generic scene from a button, scroll, keyboard, and touch-sized viewport.
- Send repeated input during the transition and confirm the state remains coherent.
- Check character and portal layering at common desktop and mobile sizes.
- Toggle reduced motion and confirm the direct path remains legible.

## Automated tests

- Test valid and invalid scene requests.
- Test the transition lock and one-request queue behavior.
- Test interruption, reset, timeout recovery, and reduced-motion branching.
- Run Playwright tests for supported input paths and stable destination state.

## Exit condition

A generic transition can be triggered, interrupted safely, completed, and reset, with reliable navigation locking and reduced-motion behavior.

