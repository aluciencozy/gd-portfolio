# Portfolio in Motion

A Vite + React + TypeScript portfolio prototype built around four controlled checkpoints: Hero, About, Projects, and Contact.

The current experience uses a full-viewport repeating PNG backdrop, a persistent animated cube, a top progress bar, and cinematic curtain wipes between sections. Once the black curtain covers the outgoing section, it swaps the route and briefly presents the cube, ship, or wave owned by the departure section. The curtain opens into the matching gameplay sequence, then closes again before revealing the destination cube close-up, smooth pullback, and text.

Wheel input, touch swipes, keyboard commands, checkpoint buttons, and browser hash navigation use the same bounded scene navigator. The document itself does not become a scroll surface. Direct links remain immediate, the opening plays once per tab session, and every cinematic uses the same left-to-right choreography. Wheel and touch input wait for an active transition to finish; a fresh keyboard navigation command can finish it early, and visitors can also persistently skip the curtain and arrival while retaining a short text reveal.

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
