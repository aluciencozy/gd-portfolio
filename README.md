# Portfolio in Motion

A Vite, React, and TypeScript portfolio inspired by Geometry Dash. The site is
organized as five full-screen checkpoints: Hero, About, Experience, Projects,
and Contact.

Wheel input, touch swipes, keyboard commands, optional checkpoint marker
buttons, browser history, and direct hash links all use the same bounded scene
navigator. Motion handles the edge-aware content choreography, checkpoint
progress, scene color crossfades, opening sequence, cube reactions, and
continuous cube idle motion that respects reduced-motion preferences.

The project data is centralized in
`src/components/portfolio-data.ts`, including the skills and project arrays.
Adding another project only requires another object in that collection. The
current resume is bundled as a downloadable PDF from the Hero and Contact
screens.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run test:e2e
npm run preview
```

## Inputs

- Wheel or trackpad: previous and next checkpoint; on Experience, scroll the
  timeline until its boundary
- Arrow Left and Arrow Right: previous and next checkpoint
- Arrow Up, Arrow Down, Page Up, Page Down, and Space: previous and next
  checkpoint; on Experience, scroll the timeline until its boundary
- Home and End: first and last checkpoint
- Touch swipe: previous and next checkpoint; on Experience, scroll the
  timeline until its boundary
- Progress bar: animated fill with the current completion percentage beside it
- Checkpoint markers: hidden on first visit; use the accessible Markers toggle
  to show them for direct navigation. The choice is remembered in this browser

## Assets

- Original supplied assets and resume: `assets/`
- Optimized and imported visual assets: `src/assets/`
- SVG optimizer configuration: `svgo.config.mjs`
