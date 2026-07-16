# Technical architecture

## Stack

- Vite with React and TypeScript.
- Tailwind CSS 4 through the Vite plugin, plus a small global stylesheet.
- Motion for React for animation sequencing and transforms. See the [Motion `useAnimate` documentation](https://motion.dev/docs/react-use-animate).
- Vitest and Testing Library for unit/component tests.
- Playwright for end-to-end and screenshot tests.
- Static Vite output with no backend or runtime data dependency.

The first version does not use a router, GSAP, Lenis, or another scrolling library.

## Architectural shape

```text
Portfolio shell
├── semantic scene content
│   ├── Hero / Cube
│   ├── About / Ship
│   ├── Projects / Ball
│   └── Contact / Wave + asset gallery
├── fixed navigation HUD
├── controlled input adapter
└── viewport scene layer
    ├── scene navigator
    ├── source-mode transition profiles
    ├── character renderer
    ├── portal and obstacle renderer
    └── asset loading and fallback
```

Animation state must not own portfolio content. Each scene remains a semantic section mounted in the DOM; inactive scenes are inert and visually hidden while the active scene owns the viewport.

## Core interface

```ts
type SceneId = "hero" | "about" | "projects" | "contact";

interface SceneNavigator {
  getSnapshot(): SceneNavigatorSnapshot;
  transitionTo(scene: SceneId): TransitionCommand | null;
  next(): TransitionCommand | null;
  previous(): TransitionCommand | null;
  complete(): void;
  recover(): void;
}
```

The concrete implementation owns validation, transition locking, direct navigation, ignored repeat input, and recovery to a stable destination state. Views request navigation through this seam rather than changing scene state directly.

## Module responsibilities

### Scene navigation

Own the ordered scene list, current scene, transition lock, direct navigation rules, previous and next behavior, hash state, and input normalization. Wheel, touch, buttons, keyboard, and browser history all enter through the same request path.

### Transition orchestration

Own the shared phased timeline and data-driven source-mode profiles. Coordinate the current scene handoff, moving world, portal timing, destination arrival, cleanup, skip, and timeout recovery.

### Character rendering

Render the active mode with stable dimensions, decorative semantics, reserved space, and a fallback placeholder. Vector assets use responsive sizing so the same composition can be reviewed at desktop and mobile sizes.

### Portal and obstacle rendering

Render portals, spikes, yellow orbs, blocks, and the background. Keep scene geometry and layering separate from timeline control so positions can be tuned without rewriting navigation behavior.

### Section content

Render semantic Hero, About, Projects, and Contact content. Content components expose headings, paragraphs, links, buttons, and the temporary asset gallery independently from transition state.

### Asset loading and fallback behavior

Load normalized web assets with reserved dimensions and predictable naming. A missing or failed asset falls back without collapsing layout or blocking navigation. Original source assets remain separate from optimized web assets.

## Scrolling and viewport behavior

The first implementation controls the viewport rather than allowing partial document scrolling. Wheel and touch events become one-scene requests. The Contact gallery opts into its own bounded scroll container and isolates its events from the scene navigator.

The scene layer does not use a horizontal document or custom scrolling abstraction. Horizontal travel is simulated by translating the environment and portal track inside a fixed viewport.

## Static deployment

`vite build` produces the static `dist/` output. The application does not depend on server-side rendering, API routes, runtime data fetching, or framework-specific route handling.

## Testing strategy

- Unit tests cover scene ordering, valid and invalid navigation, transition locking, ignored repeated input, hash parsing, and recovery.
- Testing Library covers HUD behavior, boundary controls, focus semantics, and asset-gallery behavior.
- Playwright tests exercise refresh, skip, visible navigation, keyboard navigation, wheel/touch-sized viewports, repeated input, direct hashes, browser history, gallery scrolling, and screenshots.
- Visual review covers every idle pose, transition layer, asset fallback, responsive composition, and Contact gallery.
- Production build checks validate the static Vite output and catch missing asset assumptions.
