# Milestone 06: Animation completion

## Goal

Complete and approve the entire animation system as a standalone experience before real portfolio information is added.

## Inputs and required assets

- Completed intro and all authored transitions.
- Final or near-final character, portal, obstacle, and environment assets.
- Test labels and neutral placeholder content.
- The [quality bar](../quality-bar.md).

## Implementation scope

- Run the complete intro and transition sequence.
- Tune timing, easing, scale, layering, camera movement, and idle states.
- Test desktop and mobile scene behavior.
- Test repeated input, reverse navigation, refresh, direct section navigation, skip, and recovery.
- Capture visual references or screenshots for regression comparison.
- Review performance, asset loading, layout stability, and reduced-motion behavior.
- Record known exceptions and resolve all issues that violate the quality bar.

## Explicit non-goals

- Do not add real Hero, About, Projects, or Contact information.
- Do not add project cards, case studies, resume links, or social links.
- Do not expand the scene system with unrelated visual features.

## Acceptance criteria

- The full animation system works as a standalone experience from refresh through Contact.
- Every transition is individually reviewable and passes its own acceptance criteria.
- Desktop and mobile scenes are intentionally composed.
- Rapid input, reverse navigation, direct section navigation, refresh, and skip produce stable states.
- Reduced motion preserves all states and content access.
- No layout shift, broken state, overlapping animation, or unnecessary performance cost remains.
- Visual references are available for regression comparison.
- The animation is approved before content integration begins.

## Manual visual checks

- Perform a picky visual pass on every transition and idle state.
- Check spacing, contrast, timing, portal alignment, character scale, layer ordering, and arrival poses.
- Compare current scenes with captured reference images at the agreed viewport sizes.
- Review keyboard and touch behavior as a visitor, not only as an implementation test.

## Automated tests

- Run the complete Playwright scenario suite.
- Run responsive viewport coverage.
- Run reduced-motion coverage.
- Run production build, linting, TypeScript checks, and performance-oriented checks.
- Preserve screenshot baselines or other stable visual references where practical.

## Exit condition

The animation system is approved as a standalone experience. Only after this exit condition is met may real portfolio content be integrated.

