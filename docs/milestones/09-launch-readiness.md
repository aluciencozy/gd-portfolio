# Milestone 09: Launch readiness

## Goal

Validate the complete static portfolio and approve it for deployment.

## Inputs and required assets

- Complete portfolio application.
- Final optimized assets and fallbacks.
- Approved visual references.
- Deployment target and production configuration.
- Asset rights and attribution records.

## Implementation scope

- Run the production build and static export.
- Run the Playwright test suite.
- Check performance, asset sizes, and layout stability.
- Test current Chrome, Safari, and Firefox.
- Test desktop and mobile viewport sizes.
- Verify metadata, favicon, social preview, sitemap, and contact links.
- Perform a final visual QA pass on every transition and idle state.
- Confirm asset rights and attribution requirements before deployment.

## Explicit non-goals

- Do not add new animation features during launch validation without returning to the relevant milestone.
- Do not deploy assets with unresolved rights or attribution requirements.
- Do not accept a failing test, known layout shift, or inaccessible fallback as a launch exception without an explicit decision record.

## Acceptance criteria

- Production build and static export succeed from a clean checkout.
- Playwright tests pass across the supported browser and viewport matrix.
- Performance and asset-size checks meet the project’s agreed thresholds.
- No material layout shift occurs during asset loading.
- Metadata, favicon, social preview, sitemap, and contact links are correct.
- Every transition and idle state passes final visual review.
- Reduced-motion, keyboard, touch, and direct-navigation paths remain usable.
- Asset rights and attribution are confirmed and recorded.

## Manual visual checks

- Review the deployed or deployment-equivalent export on Chrome, Safari, and Firefox.
- Check every transition at desktop and mobile sizes.
- Check every idle state, section reveal, portal alignment, character pose, and fallback.
- Verify metadata previews and the favicon in a clean browser profile.
- Perform a final visitor walkthrough without relying on game mechanics.

## Automated tests

- Run linting, formatting, TypeScript validation, and the production build.
- Run static-export validation.
- Run the full Playwright browser and viewport matrix.
- Run accessibility, performance, asset-size, and layout-stability checks.
- Check sitemap and metadata outputs.

## Exit condition

The static portfolio passes production, browser, responsive, accessibility, performance, visual, metadata, link, and rights checks and is approved for deployment.

