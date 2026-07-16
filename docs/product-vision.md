# Product vision

## Concept

The character travels through portals as the visitor moves between portfolio scenes. Each portal marks a change in character mode:

1. Hero introduces the Cube.
2. About introduces the Ship.
3. Projects introduces the Ball.
4. Contact completes the journey with the Wave.

The effect should feel like a small authored game sequence embedded in a portfolio, not like a game visitors must learn to access information.

## Interaction model

The portfolio uses a controlled viewport. Wheel movement, touch swipes, keyboard commands, visible navigation, and previous/next controls all request one destination scene through the same navigator. The page does not partially scroll between scenes.

The transition layer simulates horizontal travel. The character stays near a stable focal point while the background, obstacles, and destination portal move across the viewport. Reverse navigation mirrors the travel direction and uses the current mode’s profile with the destination scene’s portal and character.

The Contact scene includes a bounded internal-scroll asset gallery. Gallery scrolling is isolated from scene navigation.

## Information architecture

| Section | Character mode | Visitor question answered |
| --- | --- | --- |
| Hero | Cube | Who is this person and what do they do? |
| About | Ship | What is their background, approach, and perspective? |
| Projects | Ball | What work can a visitor inspect? |
| Contact | Wave | How can a visitor start a conversation? |

The section order is fixed for the first version. Direct section navigation is available even when a visitor does not follow the forward sequence.

## Success criteria

The experience succeeds when:

- Visitors understand the current scene quickly.
- Visitors can reach every scene without learning game mechanics.
- The animation feels memorable without creating overlapping or locked states.
- The site works on desktop, mobile, keyboard navigation, and touch input.
- Section content remains readable while scenes are active and after they settle.
- Every transition has a visible skip path.
- Direct hash navigation and browser history resolve to stable scene states.

## Experience principles

### Content first

Headings, explanatory text, links, and calls to action have a stable place in the active scene. Scene choreography supports those elements instead of replacing them.

### One clear event at a time

Transitions have a readable beginning, travel beat, portal beat, and arrival beat. Extra decoration must not compete with the character or destination content.

### Designed adaptation

The first mobile implementation uses the same vector composition with deliberate responsive sizing. Scene geometry can be simplified later if visual review identifies clipping or crowding.

### Graceful interruption

Visitors can change direction or choose a scene without leaving the application in a half-transitioned state. Extra input is ignored during an active transition, and skip or recovery resolves to the destination.

### Memorable, not exhausting

The first visit should feel special. Repeated navigation, refreshes, and direct hashes should stay efficient and predictable.
