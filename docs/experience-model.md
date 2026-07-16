# Experience model

## User journey

On first load, the visitor starts in the Hero scene with the Cube. The authored intro is deferred until the foundation is approved.

From Hero onward, the visitor can move through the scene sequence using wheel movement, touch swipes, visible buttons, keyboard input, or direct section navigation. A viewport-filling transition carries the current mode through a moving environment and destination portal before revealing the arriving mode.

## State model

The primary state sequence is:

```text
hero-idle
transitioning-from-cube
about-idle
transitioning-from-ship
projects-idle
transitioning-from-ball
contact-idle
transitioning-from-wave
```

The four idle states are stable content states. Transition states are exclusive animation states. The source mode selects the travel profile; the destination scene selects the portal and arriving character.

## Input behavior

All inputs request a destination through the same navigator:

- Wheel movement in either direction requests the next or previous scene.
- A meaningful touch swipe requests the next or previous scene.
- Arrow keys, PageUp/PageDown, Space, Home, and End map to scene requests.
- Visible section buttons request a direct destination.
- Previous and next controls request adjacent scenes.
- Browser hash Back/Forward requests the hash destination.
- One transition runs at a time.
- Extra requests during a transition are ignored.
- Gallery scrolling is isolated and does not request a scene.

The viewport is locked to prevent partial document scrolling. The Contact asset gallery is the intentional internal-scroll exception.

## Transition contract

Every transition must satisfy this contract:

1. The current scene remains understandable until the transition begins.
2. The transition fully covers the viewport.
3. Character, portal, obstacles, and visual layers have deterministic positions and ordering.
4. The source-mode profile completes its travel phase.
5. The destination portal crosses the anchored character.
6. The destination character arrives in a stable pose.
7. The destination scene becomes readable after arrival.
8. The navigator unlocks and exposes the next valid actions.
9. Skip and timeout recovery resolve to the same destination state.

## Intro behavior

The authored intro is a later milestone. The current foundation starts directly in Hero and does not delay access to portfolio content.

## Failure and recovery states

If an asset fails to load, the scene uses a reserved-size placeholder. If a transition fails to complete, a guard timeout or error path resolves to the destination scene and unlocks navigation. Refreshing at a hash produces a stable scene rather than replaying an incomplete transition.
