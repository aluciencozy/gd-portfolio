# Portfolio Planning Packet

## Project summary

This packet defines a desktop-first, mobile-adapted portfolio that combines readable portfolio content with a memorable game-inspired interaction layer. As visitors move between scenes, a character travels through authored portals and changes mode: Cube, Ship, Ball, and Wave.

The site is a controlled vertical scene sequence. Each scene fills the viewport, while the transition layer simulates horizontal travel by moving the environment from right to left. Buttons, keyboard input, wheel input, and touch swipes all request the same scene transition.

**Primary goal:** get hired while demonstrating a memorable interaction design project.

**Current status:** the Vite foundation and normalized SVG asset preview are implemented. Final portfolio copy and authored intro choreography are still deferred.

## Planning documents

### Direction

- [Product vision](./product-vision.md)
- [Experience model](./experience-model.md)
- [Technical architecture](./technical-architecture.md)
- [Asset manifest](./asset-manifest.md)
- [Quality bar](./quality-bar.md)

### Milestones

1. [Project preparation](./milestones/00-project-preparation.md)
2. [Asset ingestion](./milestones/01-asset-ingestion.md)
3. [Animation foundation](./milestones/02-animation-foundation.md)
4. [Intro sequence](./milestones/03-intro-sequence.md)
5. [Cube to Ship](./milestones/04-cube-to-ship.md)
6. [Remaining transitions](./milestones/05-remaining-transitions.md)
7. [Animation completion](./milestones/06-animation-completion.md)
8. [Portfolio content](./milestones/07-portfolio-content.md)
9. [Responsive accessibility](./milestones/08-responsive-accessibility.md)
10. [Launch readiness](./milestones/09-launch-readiness.md)

## Current decisions

- The project stays on Vite, React, and TypeScript.
- Tailwind CSS provides reusable layout and UI styling, with a small global stylesheet for reset and scene tokens.
- Motion for React provides timeline orchestration.
- The section order is Hero, About, Projects, Contact.
- The mode progression is Cube, Ship, Ball, Wave.
- The first implementation uses a controlled viewport. Any meaningful wheel or touch movement advances one scene rather than partially scrolling the document.
- Visible navigation, keyboard input, wheel input, and touch input share one navigator.
- Extra requests during a transition are ignored.
- Direct navigation uses one source-mode transition with a destination-specific portal and arriving character.
- The initial page opens directly in Hero. The authored intro is deferred.
- Real portfolio copy is deferred until the animation foundation is approved.
- The first version is static and has no backend.
- Every transition has a visible skip control and a timeout recovery path.

## Asset status

Optimized SVGs live in `src/assets/` and original supplied sources remain in `assets/`. The Contact scene includes the complete asset preview. Cube portal is still missing and temporarily uses the Ship portal as a fallback. UFO is retained as a future asset and is not a fifth mode.

Supplied assets are attributed to RobTop Games in the UI and manifest. Rights clearance remains unverified.

## Sequencing rule

Animation work must be completed and approved as a standalone experience before real portfolio information is added. Placeholder labels and test content are allowed during foundation and scene work. Portfolio copy, project case studies, resume links, email, and social links are introduced only in the portfolio-content milestone.
