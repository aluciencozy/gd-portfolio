# Portfolio in Motion

A Vite + React + TypeScript portfolio prototype built around four controlled checkpoints: Hero, About, Projects, and Contact.

The current experience uses a full-viewport repeating PNG backdrop, a persistent animated cube, and a top progress bar. Route transitions are intentionally immediate while the portfolio content is being built. The opening animation remains enabled.

Wheel input, touch swipes, keyboard commands, checkpoint buttons, and browser hash navigation use the same bounded scene navigator. The document itself does not become a scroll surface. Direct links remain immediate and the opening plays once per tab session.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run test:e2e
npm run preview
```

## Assets

- Original supplied assets: `assets/`
- Optimized and imported assets: `src/assets/`
- SVG optimizer configuration: `svgo.config.mjs`

The supplied source assets are retained for future visual passes. The active prototype imports the background, ground, cube, ship, wave, checkpoint, and progress-bar assets.

## Project plan

The active implementation roadmap is in [`PLAN.md`](PLAN.md).
