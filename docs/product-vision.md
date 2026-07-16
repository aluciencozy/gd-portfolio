# Product vision

## Concept

The character travels through portals as the visitor moves between portfolio sections. Each portal marks a change in the character's mode and gives the page transition a clear narrative beat:

1. The Hero introduces the Cube.
2. The About section introduces the Ship.
3. The Projects section introduces the Ball.
4. The Contact section completes the journey with the Wave.

The effect should feel like a small, authored game sequence embedded in a portfolio, not like a game that visitors must play to access information.

## Interface hierarchy

Normal page content is the primary interface. The game-inspired animation is the storytelling layer.

The content must therefore remain understandable when a visitor:

- scrolls normally;
- uses visible section navigation;
- navigates with a keyboard;
- has reduced motion enabled;
- skips the intro or a transition;
- loads the page before artwork finishes loading; or
- uses a device that cannot sustain the full visual treatment.

Animation may guide attention and create memorable moments, but it must not be the only way to discover a section, activate a link, or understand the owner’s work.

## Information architecture

| Section | Character mode | Visitor question answered |
| --- | --- | --- |
| Hero | Cube | Who is this person and what do they do? |
| About | Ship | What is their background, approach, and perspective? |
| Projects | Ball | What work can a visitor inspect? |
| Contact | Wave | How can a visitor start a conversation? |

The section order is fixed for the first version. Direct section navigation must still be available even when a visitor does not follow the authored sequence.

## Success criteria

The experience succeeds when:

- Visitors understand who the owner is quickly.
- Visitors can reach projects and contact information without learning game mechanics.
- The animation feels memorable without preventing browsing.
- The site works on desktop, mobile, keyboard navigation, and reduced-motion settings.
- The section content remains readable while scenes are active and after they settle.
- A visitor can skip or bypass animation without losing context or access to the same actions.
- A first-time visitor can identify the next useful action without being asked to decode the transition.

## Experience principles

### Content first

Headings, explanatory text, links, and calls to action have a stable place in the document flow. Scene choreography supports those elements instead of replacing them.

### One clear event at a time

Transitions should have a readable beginning, travel beat, portal beat, and arrival beat. Extra decoration must not compete with the character or destination content.

### Designed adaptation

Mobile uses a deliberate composition with fewer visual elements and a shorter or simplified route where necessary. It is not a desktop scene scaled until it fits.

### Graceful interruption

Visitors can change direction or choose a section without leaving the application in a half-transitioned state. The system either ignores excess input or queues one request according to the experience model.

### Memorable, not exhausting

The first visit should feel special. Repeated navigation, refreshes, and direct links should stay efficient and predictable.

