# Portfolio Planning Packet

## Project summary

This packet defines a desktop-first, mobile-adapted portfolio that combines readable portfolio content with a memorable game-inspired interaction layer. As visitors move between sections, a character travels through authored portals and changes mode: Cube, Ship, Ball, and Wave.

The site is a vertical-scrolling portfolio. Full-screen horizontal-style transition scenes carry the character between normal page sections, while the page content remains the primary interface and source of information.

**Primary goal:** get hired while demonstrating a memorable interaction design project.

**Current status:** planning only. The initial Next.js project, application code, assets, animation timelines, and portfolio copy are not part of this documentation phase.

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

## Non-negotiable decisions

- The portfolio uses vertical page scrolling, with full-screen horizontal-style game transition scenes between sections.
- The section order is Hero, About, Projects, Contact.
- The mode progression is Cube, Ship, Ball, Wave.
- Normal page content is always the primary interface. Visitors must not need to learn game mechanics to browse or contact the owner.
- The initial intro sequence is developed as one combined experience.
- Each later transition is authored, implemented, and polished individually.
- All animation scenes are completed and reviewed before real portfolio content is integrated.
- Reduced-motion behavior exposes the same content and navigation through short fades or direct section changes.
- The animation system is replaceable. The portfolio remains usable if animation is disabled.
- The first implementation uses Next.js with TypeScript, Motion for React, CSS Modules, Playwright, and native browser scrolling.
- The first version is a static portfolio. No backend is planned.

## Decision log

| Decision | Rationale |
| --- | --- |
| Use game-inspired transitions as a storytelling layer | The interaction should be distinctive without making the portfolio itself difficult to understand. |
| Keep sections as normal readable page content | Semantic content, navigation, searchability, and accessibility must not depend on animation. |
| Use one intro experience, then individual transitions | The opening can establish the visual language together; later scenes can be tuned and reviewed in isolation. |
| Use native browser scrolling first | It preserves expected browser behavior and avoids adding a scrolling abstraction before it is necessary. |
| Prefer Motion for React before GSAP | Motion covers the planned sequencing and transforms with a smaller initial animation surface. |
| Delay real portfolio copy until animation approval | Scene timing, legibility, and composition can be reviewed without content changes hiding animation problems. |
| Use temporary neutral placeholders when needed | Animation development can proceed while supplied artwork is still being prepared. |
| Treat supplied Geometry Dash assets as requiring a rights review | Asset availability does not establish permission to publish or distribute an asset. |

## Sequencing rule

Animation work must be completed and approved as a standalone experience before real portfolio information is added. Placeholder labels and test content are allowed during foundation and scene work. Portfolio copy, project case studies, resume links, email, and social links are introduced only in the portfolio-content milestone.

