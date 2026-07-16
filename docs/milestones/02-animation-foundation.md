# Milestone 02: Animation foundation

## Goal

Build the reusable controlled viewport, scene navigator, source-mode transition profiles, and asset-backed scene layer.

## Implementation scope

- Build the viewport-sized transition scene.
- Add character positioning, portal positioning, obstacle positioning, and explicit layer ordering.
- Add the navigation lock so only one transition runs at a time.
- Normalize wheel, touch, button, keyboard, and hash-history requests through one navigator.
- Ignore extra requests during a transition.
- Add visible skip and guard-timeout recovery behavior.
- Add test labels and destination markers without real portfolio copy.

## Explicit non-goals

- Do not implement the complete intro sequence.
- Do not add real portfolio content.
- Do not add Lenis, GSAP, or another scrolling abstraction.

## Acceptance criteria

- A generic transition can be triggered from every supported input type.
- A transition can be skipped, completed, recovered, and reset safely.
- A second transition cannot start while one is active.
- Wheel and touch movement never leave the viewport partially scrolled.
- A failed asset or transition does not leave navigation permanently locked.
- The Contact asset gallery scrolls without triggering scene navigation.

## Automated tests

- Test valid and invalid scene requests.
- Test the transition lock and ignored repeat behavior.
- Test skip, timeout recovery, hashes, history, and asset fallbacks.
- Run Playwright tests for supported input paths and stable destination state.

## Exit condition

A controlled scene can be triggered, skipped, completed, and recovered with reliable navigation locking and source-mode transition profiles.
