# Portfolio in Motion

A Vite + React + TypeScript portfolio prototype built around four controlled checkpoints: Hero, About, Projects, and Contact.

The current experience uses a full-viewport repeating PNG backdrop, a persistent idle cube, a top progress bar, and Motion-driven route content handoffs. Wheel input, touch swipes, keyboard commands, checkpoint buttons, and browser hash navigation use the same bounded scene navigator. The document itself does not become a scroll surface.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Assets

- Original supplied assets: `assets/`
- Optimized and imported assets: `src/assets/`
- SVG optimizer configuration: `svgo.config.mjs`

The supplied source assets are retained for future visual passes, while the active prototype imports only the PNG background, cube, checkpoint, and progress-bar assets.

## Project plan

The active implementation roadmap is in [`PLAN.md`](PLAN.md).
