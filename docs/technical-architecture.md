# Technical architecture

## Stack

- Next.js with TypeScript.
- Static export deployment.
- Motion for React for animation sequencing and transforms. See the [Motion `useAnimate` documentation](https://motion.dev/docs/react-use-animate).
- CSS Modules for layout and scene styling.
- Playwright for end-to-end testing.
- Native browser scrolling, without Lenis or GSAP in the first version.

GSAP may be added only if the authored transition timelines exceed Motion’s maintainability. That decision requires evidence from the implemented scenes and an architecture review. It is not part of the initial stack.

The project remains a static portfolio unless a future requirement explicitly adds a backend.

## Architectural shape

The page is organized around semantic sections and a replaceable animation layer:

```text
Page shell
├── semantic section content
│   ├── Hero
│   ├── About
│   ├── Projects
│   └── Contact
├── visible section navigation
└── scene animation layer
    ├── scene navigator
    ├── transition orchestrator
    ├── character renderer
    ├── portal and obstacle renderer
    └── asset loading and fallback
```

Animation state must not own portfolio content. A visitor should be able to render and navigate the semantic sections with animation disabled.

## Core interface

The navigation seam is intentionally small:

```ts
type SceneId = "hero" | "about" | "projects" | "contact";

interface SceneNavigator {
  current: SceneId;
  isTransitioning: boolean;
  transitionTo(scene: SceneId): Promise<void>;
  next(): Promise<void>;
  previous(): Promise<void>;
}
```

The concrete implementation owns validation, transition locking, one-request queuing, reduced-motion branching, and recovery to a stable destination state. Views request navigation through this seam rather than changing scene state directly.

## Module responsibilities

### Scene navigation

Own the ordered scene list, current scene, transition lock, direct navigation rules, previous and next behavior, and input normalization. Connect scroll, buttons, keyboard, and touch events to one request path.

### Transition orchestration

Own the authored sequence for each source and destination pair. Coordinate the current section handoff, full-viewport scene, character motion, portal timing, destination arrival, cleanup, and unlock. Each transition should have an independently testable timeline and reset path.

### Character rendering

Render the active mode with stable dimensions, transform origins, accessible decorative semantics, and a placeholder fallback. Character assets should be visually crisp at common desktop resolutions and deliberately resized for mobile.

### Portal and obstacle rendering

Render portals, spikes, jump orbs, blocks, platforms, and other authored scene objects. Keep scene geometry and layering separate from timeline control so positions can be tuned without rewriting navigation behavior.

### Section content

Render semantic Hero, About, Projects, and Contact content. Content components expose headings, paragraphs, links, buttons, project details, and contact actions independently from the scene animation.

### Reduced-motion behavior

Read the user’s motion preference, expose it to the animation layer, and provide a deterministic short-fade or direct-navigation path. The content and navigation API must remain identical.

### Asset loading and fallback behavior

Load normalized web assets with reserved dimensions and predictable naming. A missing or failed asset must fall back to a neutral placeholder without collapsing layout or blocking navigation. Original source assets remain separate from optimized web assets.

## Scrolling and viewport behavior

Use native browser scrolling in the first version. Normal document flow provides the section structure; a viewport-sized scene layer handles each transition. Avoid a custom scrolling abstraction until a real requirement demonstrates that native behavior cannot support the authored experience.

The scene layer must not permanently capture scroll or pointer input. It may temporarily coordinate input during a transition, then return control to the destination section.

## Static deployment

Configure Next.js for a static export and verify that every intended route, metadata file, asset, and fallback works from the exported output. The first version should not depend on server-side rendering, API routes, or runtime data fetching.

## Testing strategy

- Unit-level tests cover scene ordering, valid and invalid navigation, transition locking, one-request queuing, reduced-motion branching, and recovery.
- Playwright tests exercise refresh, intro skip, visible navigation, keyboard navigation, touch-sized viewports, repeated input, and direct section access.
- Visual review covers each authored transition, each idle pose, asset loading, responsive composition, and reduced-motion presentation.
- Production build checks validate static export output and catch missing asset or route assumptions.

