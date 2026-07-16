# Milestone 03: Intro sequence

## Goal

Build the complete opening animation as one combined experience and resolve it into a usable Hero state.

## Inputs and required assets

- Cube icon.
- Cube portal, or an approved replacement once supplied.
- Spikes, yellow orb, blocks, and background.
- The animation foundation from Milestone 02.

## Implementation scope

- Build the complete opening animation as one experience.
- Animate the Cube jumping over spikes.
- Animate the Cube interacting with the yellow orb.
- Animate the Cube entering the first portal.
- Resolve the intro into Hero.
- Add a subtle Cube idle animation after arrival.
- Make the intro play once per page session.
- Add a visible, keyboard-reachable skip path.

## Explicit non-goals

- Do not add real Hero copy.
- Do not implement later mode transitions in this milestone.
- Do not add final portfolio links or identity content.
- Do not make the intro a required game mechanic.

## Acceptance criteria

- A refresh starts the intro in a stable initial state.
- The Cube clears spikes, interacts with the orb, enters the portal, and arrives in Hero in authored order.
- Hero is readable after the arrival pose settles.
- The intro plays once per page session.
- Skip resolves immediately and safely to Hero.
- Repeated input during the intro cannot create overlapping timelines.

## Exit condition

The full intro works from refresh through Hero without real portfolio content, including the one-time rule and skip path.
