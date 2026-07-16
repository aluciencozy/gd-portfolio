# Milestone 01: Asset ingestion

## Goal

Ingest, normalize, optimize, and independently preview the supplied artwork needed for the scenes.

## Inputs and required assets

- Supplied Cube, Ship, Ball, and Wave icons.
- Cube, Ship, Ball, and Wave portals.
- Spikes, jump orbs, blocks, and platforms.
- Background and foreground decoration layers.
- Optional particle textures.
- Logo/wordmark and favicon/social preview assets.
- The [asset manifest](../asset-manifest.md), including source and rights information.

## Implementation scope

- Add supplied assets to the source and optimized asset locations.
- Optimize SVGs and normalize naming, viewBox values, dimensions, and color assumptions.
- Convert large raster backgrounds to WebP or AVIF when appropriate.
- Preserve original source assets separately from optimized web assets.
- Create a manifest that records purpose, intrinsic dimensions, display dimensions, source, license, and fallback.
- Add neutral placeholders with matching reserved dimensions.
- Create an independent preview path or test fixture for every mode, portal, and obstacle.

## Explicit non-goals

- Do not author transition timelines.
- Do not add real portfolio copy.
- Do not tune final scene choreography.
- Do not assume supplied Geometry Dash assets are cleared for publication.

## Acceptance criteria

- Every required asset in the manifest has a supplied file or an explicitly tracked placeholder.
- Optimized web assets render without broken viewBox, transparency, or aspect-ratio behavior.
- Missing assets fall back without layout collapse.
- Original sources and optimized outputs are distinguishable.
- Rights and attribution status is recorded for every supplied non-original asset.
- Each mode and portal can be previewed independently at multiple sizes.

## Manual visual checks

- Preview every character and portal on contrasting backgrounds.
- Inspect desktop and mobile-sized renderings for clipping, halos, and unexpected scaling.
- Confirm asset bounds align with the intended collision or placement bounds.
- Confirm placeholders have stable dimensions and are clearly temporary.

## Automated tests

- Validate manifest references and required asset names.
- Check that optimized assets exist at the paths used by previews.
- Run an asset smoke test at representative sizes.
- Run linting and the production build.

## Exit condition

All required assets can be previewed independently, with normalized web versions, stable fallbacks, and documented rights status.

