# Asset manifest

This checklist describes the artwork needed for the animation system and the site identity. It is a request for supplied assets, not an instruction to create them during this planning phase.

## Required assets

| Asset | Purpose | Preferred format |
| --- | --- | --- |
| Cube icon | Hero character | SVG |
| Ship icon | About character | SVG |
| Ball icon | Projects character | SVG |
| Wave icon | Contact character | SVG |
| Cube portal | Intro and first transition | SVG |
| Ship portal | Cube-to-Ship transition | SVG |
| Ball portal | Ship-to-Ball transition | SVG |
| Wave portal | Ball-to-Wave transition | SVG |
| Spikes | Obstacles | SVG |
| Jump orbs | Intro obstacles | SVG |
| Blocks/platforms | Scene decoration | SVG |
| Background | Main environment | WebP, AVIF, or layered SVG |
| Foreground decorations | Parallax layers | SVG or WebP |
| Particle textures | Optional atmosphere | SVG or WebP |
| Logo/wordmark | Site identity | SVG |
| Favicon/social preview | Metadata | PNG or SVG |

## Ingestion requirements

- Optimize SVGs before use.
- Keep original source assets separate from optimized web assets.
- Use SVG for characters and interactive objects.
- Use WebP or AVIF for large raster backgrounds.
- Use layered backgrounds when parallax is needed.
- Normalize file names, dimensions, viewBox values, and color assumptions before scene integration.
- Record intrinsic dimensions and intended display dimensions for every asset.
- Keep a neutral placeholder for every required visual so a missing asset cannot collapse a scene.

## Suggested naming convention

Use lowercase, descriptive, hyphen-separated names grouped by role. Examples:

```text
characters/cube.svg
characters/ship.svg
portals/ship.svg
obstacles/spikes.svg
backgrounds/environment.webp
identity/wordmark.svg
metadata/social-preview.png
```

The exact final directory may change with the generated Next.js project, but the distinction between original sources and optimized web assets should remain.

## Preview checklist

Before an asset is used in an authored scene:

- Preview it on both light and dark surrounding colors.
- Check its bounds at common desktop and mobile sizes.
- Confirm transparent edges do not introduce halos.
- Confirm the viewBox and aspect ratio preserve the intended silhouette.
- Check that the asset does not cause layout shift while loading.
- Confirm the fallback has matching reserved dimensions.

## Rights and attribution

Treat all supplied Geometry Dash assets as requiring a final rights review before launch. Asset receipt, local availability, or technical optimization does not establish permission to publish, modify, or distribute an asset. Record the source, license, attribution requirement, and permitted use for every non-original asset before deployment.

## Development placeholders

Use temporary neutral placeholders during early animation development if final assets are not available. Placeholders should communicate the object’s role and approximate bounds without being mistaken for approved final art. Replace them only after the authored scene geometry and timing have been reviewed.

