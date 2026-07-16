# Experience model

## User journey

On first load, the visitor sees the intro sequence. The Cube moves through the initial obstacle course, enters the first portal, and resolves into the Hero section. The intro plays once per page session and has a visible skip path.

From the Hero onward, the visitor can move through the section sequence using scrolling, visible buttons, keyboard input, or touch gestures. A transition covers the viewport, carries the current character through an authored scene, and reveals the destination section when the arriving character settles.

The visitor may also use the visible section navigation to reach a destination directly. Direct navigation must preserve readable content even when the authored route is bypassed.

## State model

The primary state sequence is:

```text
intro
hero-idle
transitioning-to-about
about-idle
transitioning-to-projects
projects-idle
transitioning-to-contact
contact-idle
```

`hero-idle`, `about-idle`, `projects-idle`, and `contact-idle` are stable content states. The `transitioning-*` states are exclusive animation states. `intro` is a one-time entry state that resolves into `hero-idle` or directly into a skip result.

## Input behavior

Scroll, visible navigation buttons, keyboard controls, and touch navigation all request a destination scene through the same navigator. They must not each implement their own transition state.

- A request for the next scene moves forward in the sequence.
- A request for the previous scene moves backward when a previous scene exists.
- Direct section navigation requests a specific scene.
- One transition may run at a time.
- Extra input during a transition is ignored or queued only once.
- A queued request is discarded if it would be invalid after the active transition completes.
- Navigation remains available through a visible fallback control.

The exact gesture threshold and scroll cooldown are implementation details, but they must prevent accidental repeated transitions from one physical input.

## Transition contract

Every authored transition must satisfy this contract:

1. The current section remains understandable until the transition begins.
2. The transition scene fully covers the viewport.
3. The character, portal, obstacles, and visual layers have deterministic positions and ordering.
4. The character reaches the destination portal in a complete, authored motion.
5. The destination character arrives in a stable pose.
6. The destination section becomes readable after arrival.
7. The navigator unlocks and exposes the next valid actions.
8. An interrupted, skipped, or reduced-motion path resolves to the same destination content state.

## Intro behavior

The initial intro animation plays once per page session. It includes the Cube jumping over spikes, interacting with jump orbs, entering the first portal, and resolving into the Hero. A visible skip control completes the intro immediately and leaves the visitor in `hero-idle`.

The intro must not delay access to the Hero indefinitely. The skip control must be keyboard reachable, announced clearly, and available throughout the sequence.

## Reduced motion

Reduced-motion mode preserves the state model and all destination content but changes the visual behavior:

- Intro resolves with a short fade or direct reveal.
- Transition scenes use short fades and direct section changes.
- Continuous idle animation, camera movement, particles, and large travel motions are removed or minimized.
- Navigation remains available through normal scrolling and visible controls.

Reduced motion is a behavior mode, not a content mode. It must not remove headings, links, project information, or contact actions.

## Failure and recovery states

If an asset fails to load, the scene uses a neutral placeholder with the same reserved dimensions. If a transition fails to complete, a timeout or error boundary resolves to the destination section and unlocks navigation. Refreshing at a section should produce a stable section state rather than replaying an incomplete transition.

