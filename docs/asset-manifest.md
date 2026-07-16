# Asset manifest

This manifest records the artwork used by the animation system, the current normalized locations, and known gaps. Supplied assets are attributed to RobTop Games. Rights clearance is not independently verified.

## Required and supplied assets

| Asset | Purpose | Optimized location | Status |
| --- | --- | --- | --- |
| Cube icon | Hero character | `src/assets/characters/cube.svg` | Supplied and optimized |
| Ship icon | About character | `src/assets/characters/ship.svg` | Supplied and optimized |
| Ball icon | Projects character | `src/assets/characters/ball.svg` | Supplied and optimized |
| Wave icon | Contact character | `src/assets/characters/wave.svg` | Supplied and optimized |
| UFO icon | Future mode asset | `src/assets/characters/ufo.svg` | Preview-only |
| Cube portal | Destination portal for Hero | Pending; Ship portal fallback | Missing, tracked |
| Ship portal | Destination portal for About | `src/assets/portals/ship-portal.svg` | Supplied and optimized |
| Ball portal | Destination portal for Projects | `src/assets/portals/ball-portal.svg` | Supplied and optimized |
| Wave portal | Destination portal for Contact | `src/assets/portals/wave-portal.svg` | Supplied and optimized |
| Spikes | Scene obstacles | `src/assets/obstacles/spike.svg` | Supplied and optimized |
| Yellow orb | Jump orb and scene object | `src/assets/obstacles/yellow-orb.svg` | Supplied and optimized |
| Block | Scene decoration | `src/assets/obstacles/block.svg` | Supplied and optimized |
| Background | Environment layer | `src/assets/backgrounds/background.svg` | Supplied and optimized |
| Platforms | Scene geometry | Pending | Deferred |
| Foreground layers | Parallax decoration | Pending | Deferred |
| Logo/wordmark | Site identity | Pending | Not supplied |
| Favicon/social preview | Metadata | `public/favicon.svg` / pending | Favicon supplied |

## Source and optimized locations

- Original supplied SVGs remain in the root `assets/` directory.
- Optimized web SVGs live under `src/assets/`, grouped by role.
- `svgo.config.mjs` defines the shared optimization preset.
- The missing Cube portal uses the optimized Ship portal temporarily so the destination state remains renderable.

## Preview checklist

The Contact scene previews every supplied asset in a bounded internal-scroll gallery. Before an asset is promoted into a polished authored scene:

- Check it on light and dark surrounding colors.
- Check bounds at desktop and mobile sizes.
- Confirm transparent edges do not introduce halos.
- Confirm viewBox and aspect ratio preserve the intended silhouette.
- Confirm failure falls back to a reserved-size placeholder.

## Rights and attribution

The current attribution is: “Supplied project assets attributed to RobTop Games. Rights clearance is unverified.” This wording is intentionally not a license or permission claim. Final publication requires a rights review and any required attribution or permission record.
