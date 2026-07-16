# Milestone 09: Launch readiness

## Goal

Validate the complete static portfolio and approve it for deployment.

## Implementation scope

- Run the production Vite build.
- Run the unit, component, and Playwright test suites.
- Check performance, asset sizes, and layout stability.
- Test supported desktop and mobile browser configurations.
- Verify metadata, favicon, social preview, and contact links.
- Perform a final visual QA pass on every transition and idle state.
- Confirm asset rights and attribution requirements before deployment.

## Explicit non-goals

- Do not add new animation features during launch validation without returning to the relevant milestone.
- Do not deploy assets with unresolved rights or attribution requirements.
- Do not accept a failing test, known layout shift, or inaccessible fallback as a launch exception without an explicit decision record.

## Acceptance criteria

- Production build succeeds from a clean checkout.
- Playwright tests pass across the supported browser and viewport matrix.
- Performance and asset-size checks meet agreed thresholds.
- No material layout shift occurs during asset loading.
- Metadata, favicon, social preview, and contact links are correct.
- Every transition and idle state passes final visual review.
- Keyboard, touch, skip, hash, and direct-navigation paths remain usable.
- Asset rights and attribution are confirmed and recorded.

## Exit condition

The static portfolio passes production, browser, responsive, accessibility, performance, visual, metadata, link, and rights checks and is approved for deployment.
