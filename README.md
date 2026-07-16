# Portfolio in Motion

A Vite + React + TypeScript portfolio foundation inspired by Geometry Dash-style scene transitions.

The current implementation provides four controlled scenes:

1. Hero / Cube
2. About / Ship
3. Projects / Ball
4. Contact / Wave

Wheel input, touch swipes, keyboard commands, visible navigation, and browser hash navigation all use the same scene navigator. The environment moves horizontally inside a fixed viewport; the document itself does not become a horizontal scroll surface.

## Commands

```bash
npm run dev
npm run lint
npm test
npm run build
npm run test:e2e
```

Playwright requires a Chromium installation with its system dependencies. Use `npx playwright install-deps chromium` on a machine where sudo authentication is available.

## Assets

- Original supplied SVGs: `assets/`
- Optimized web SVGs: `src/assets/`
- Asset optimizer configuration: `svgo.config.mjs`
- Asset manifest and rights notes: `docs/asset-manifest.md`

The Contact scene includes a bounded gallery of all supplied assets. Supplied assets are attributed to RobTop Games; rights clearance is currently unverified.

## Documentation

The implementation plan and milestone packet live in [`docs/README.md`](docs/README.md).
