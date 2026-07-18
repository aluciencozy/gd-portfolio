# Checkpoint Navigation Prototype

## Summary

Keep the four routes: Hero, About, Projects, and Contact. Replace the current portal and scene transition system with a persistent top progress bar, a persistent idle cube, and simple Motion-based route content handoffs.

The opening cube-fall animation is deferred to a later pass. This pass opens directly in the settled state.

## Implementation Changes

- Remove the deprecated transition overlay, portals, obstacles, extra characters, background motion, asset gallery, visible navbar, and Previous/Next controls.
- Keep wheel, touch swipe, keyboard, hash navigation, and checkpoint button navigation. Endpoints do not wrap.
- Keep route content minimal and centered: route label, title, and short body copy only.
- Keep the cube globally mounted at the bottom-left, approximately `clamp(96px, 12vw, 164px)`, with no idle or route-change animation.
- Render the progress system near `5svh` from the top:
  - Groove centered and responsive.
  - Four checkpoint buttons at 12.5%, 37.5%, 62.5%, and 87.5%, centered within their route segments.
  - Render the checkpoint markers at approximately 50% larger than the prior prototype size.
  - Markers hang below the groove.
  - Only the active marker uses the filled SVG; all others use the unfilled SVG.
  - Checkpoint clicks navigate directly to their route and do not depend on the surrounding screen surface.
  - The bar fill persists from the left edge to the active checkpoint.
  - Repeat the 128x32 fill PNG horizontally inside a clipped reveal layer.
  - When a checkpoint activates, its filled artwork fades in first; the unfilled artwork fades out after a short 160ms delay.
- Route transitions use `motion/react` and an imperative `useAnimate` timeline:
  - Outgoing centered content moves outward by approximately 35% of its measured width and fades out.
  - Forward navigation exits left and enters from the right. Backward navigation reverses this.
  - The bar fill animates to the destination while the old and new marker fills crossfade.
  - The outgoing content fully disappears.
  - Hold the clean stage for approximately 500-800ms.
  - Incoming content then moves inward and fades in.
  - Target total duration is approximately 1.8 seconds.
  - Input is ignored while the timeline runs.
- The progress bar and cube remain fixed throughout route changes.
- Respect the requested full-motion behavior. Do not add `prefers-reduced-motion` handling.

## Types and Architecture

- Retain the four `SceneId` routes and hash navigation.
- Remove mode-specific types and transition data such as cube, ship, ball, wave, and portal metadata.
- Add typed route progress metadata derived from the route list so checkpoint count and percentages stay synchronized.
- Add an internal progress component with active route, current percentage, target percentage, and marker state.
- Keep route navigation state separate from animation orchestration so direct hash loads render immediately in their settled state.
- Use measured element bounds for the 35% content translation rather than hard-coded pixel distances.
- Keep the current `motion` dependency and use `motion/react`; do not add a separate animation library.

## Assets and Cleanup

- Optimize the supplied unfilled and filled checkpoint SVGs with the existing SVGO setup and losslessly optimize the PNGs without changing their visual dimensions.
- Import only the background, cube, checkpoint pair, and progress PNGs from `src/assets`.
- Keep unused source assets in the repository but remove their imports, catalog entries, and rendered usage.
- Remove the entire `docs/` directory.
- Maintain this roadmap in the root `PLAN.md`.
- Remove all existing unit tests, E2E tests, snapshots, Vitest and Playwright configuration, test scripts, and unused test dependencies. Update the lockfile through the package manager.
- Update the README so it describes the checkpoint navigation prototype and only lists supported commands.

## Background and Validation

- Make the background a static full-viewport layer using `100vw`, `100svh`, and `object-fit: cover`.
- Verify no horizontal or vertical black bars at desktop, mobile, narrow, and wide aspect ratios.
- Reproduce the current transition and background issue in the running app as a visual baseline before editing.
- Validate with lint, typecheck, build, and manual visual inspection of initial Hero, direct `#contact`, forward and backward navigation, checkpoint buttons, wheel, swipe, keyboard, endpoint behavior, marker crossfades, progress fill, content pause, responsive sizing, and absence of old assets.

## Future Phases

- Opening sequence: off-angle cube falls, rotates upright, bounces, touches the landing checkpoint, triggers its filled state, then the filled checkpoint flies continuously to the first top-bar marker while the cube arcs to bottom-left.
- Cube guidance: keep the cube persistent and introduce an anchored speech card for dialogue.
- Later polish: cube movement between sections, refined copy choreography, visual effects, and final portfolio content.
