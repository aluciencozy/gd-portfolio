# Animated Portfolio Implementation

## Experience

- Five bounded screens: Hero, About, Experience, Projects, and Contact.
- One navigator for wheel, trackpad, keyboard, touch, checkpoint, history, and
  hash-link inputs.
- Motion-based content exits toward each layout cluster's closest edge.
- Motion-based entrances from the same edge on initial loads and navigation.
- Input locking during a transition so repeated events cannot skip screens.
- Animated checkpoint fill, markers, section count, and completion percentage.
- Blue, pink, green, red, and blue scene themes with synchronized background
  and ground crossfades.

## Content

- Resume download on the Hero and Contact screens.
- UCF Computer Science education and 4.0 GPA.
- Vesta Teleradiology production engineering and leadership highlights.
- Hilton customer-service experience.
- Full resume skill set grouped by language, framework, architecture, and
  cloud/tool categories.
- Four extensible projects: Vesta Credentialing, Demonlist Ultimate, Guess the
  OST, and Git Janitor.
- Email, phone, GitHub, and LinkedIn contact paths.

## Cube

- Persistent, continuous idle motion between interactions.
- Directional hops for successful navigation and bounded-endpoint feedback.
- Project-specific reactions on hover and keyboard focus.
- Motion-based speech card entrance and exit.

## Validation

- Lint and production TypeScript build.
- Playwright coverage for opening behavior, animated navigation, wheel input,
  checkpoint input, endpoints, project reactions, and direct section links.
- Visual inspection at desktop and mobile sizes, including transition frames,
  background coverage, overflow, and interactive cube states.
