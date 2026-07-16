# Milestone 04: Cube to Ship

## Goal

Build and polish the first authored transition from Hero and Cube to About and Ship.

## Inputs and required assets

- Cube icon and Ship icon.
- Ship portal.
- Spikes, blocks/platforms, and approved scene decorations.
- The completed intro and animation foundation.
- Test Hero and About labels, without real portfolio copy.

## Implementation scope

- Clear Hero content at the transition handoff without losing the destination context.
- Cover the viewport with the transition scene.
- Move the Cube through authored obstacles.
- Align and enter the Ship portal.
- Transform or hand off to the Ship mode as designed.
- Settle the Ship into its arrival and idle pose.
- Reveal About test content after arrival.
- Expose the independently testable transition controls and reset path.

## Explicit non-goals

- Do not add real About copy.
- Do not implement Ship-to-Ball or later transitions.
- Do not add final project or contact content.
- Do not introduce a custom scrolling library.

## Acceptance criteria

- The transition has authored timing, obstacle arrangement, portal treatment, and arrival pose.
- Hero content clears predictably and the scene fully covers the viewport.
- The Cube reaches the Ship portal without clipping or ambiguous collision behavior.
- The Ship arrives and settles in a stable pose before About content reveals.
- The transition works forward, resets, and safely handles rapid input.
- Reduced-motion mode reaches About without requiring the authored travel sequence.

## Manual visual checks

- Review the transition frame by frame at desktop size for obstacle clearance and portal alignment.
- Check visual hierarchy during the handoff from Hero to scene to About.
- Review Ship scale, orientation, and idle movement after arrival.
- Review mobile composition instead of relying on desktop scaling.

## Automated tests

- Test Hero-to-About navigation and stable About arrival.
- Test rapid input, reset, reverse navigation where supported, and reduced motion.
- Add a Playwright visual-state smoke test using stable test labels.

## Exit condition

The Cube-to-Ship transition is visually polished, independently testable, recoverable, and complete without real portfolio content.

