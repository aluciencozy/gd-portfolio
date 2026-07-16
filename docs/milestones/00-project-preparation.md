# Milestone 00: Project preparation

## Goal

Prepare the initial Next.js project so the planned portfolio architecture can be implemented and deployed as a static site.

## Inputs and required assets

- A user-generated initial Next.js project.
- The agreed section order and state model from the portfolio planning packet.
- No final visual assets are required for this milestone.

## Implementation scope

- Confirm Next.js with TypeScript.
- Confirm CSS Modules, linting, and formatting are configured.
- Confirm static export configuration and the intended deployment target.
- Add the planned directory structure for sections, scene animation, assets, and tests without implementing portfolio content.
- Establish a place for temporary neutral placeholders and an asset manifest.
- Establish the initial Playwright configuration or test boundary.
- Confirm the project can run and build from a clean checkout.

## Explicit non-goals

- Do not add real portfolio copy.
- Do not implement animation timelines.
- Do not create or import final artwork.
- Do not add a backend, API route, or runtime data dependency.
- Do not add a custom scrolling library.

## Acceptance criteria

- TypeScript, CSS Modules, linting, and formatting run successfully.
- Static export configuration matches the deployment target.
- The planned directories exist without pretending that unfinished application behavior is complete.
- A clean checkout can install dependencies, build, and produce the expected static output.
- The test runner can start against the project boundary.

## Manual visual checks

- Open the initial page at a desktop and mobile viewport.
- Confirm the base document has no unexpected horizontal overflow.
- Confirm placeholder layout reserves predictable space.
- Confirm no placeholder content is presented as final portfolio content.

## Automated tests

- Run linting and formatting checks.
- Run TypeScript validation.
- Run the production build and static export.
- Run the initial Playwright smoke test when the test boundary exists.

## Exit condition

The project builds successfully from a clean checkout, the deployment target is confirmed, and the planned seams exist without real portfolio content or animation implementation.

