# Milestone 03: Intro sequence

## Goal

Build the complete opening animation as one combined experience and resolve it into a usable Hero state.

## Inputs and required assets

- Cube icon.
- Cube portal.
- Spikes.
- Jump orbs.
- Blocks/platforms and background layers as available.
- The animation foundation from Milestone 02.

## Implementation scope

- Build the complete opening animation as one experience.
- Animate the Cube jumping over spikes.
- Animate the Cube interacting with jump orbs.
- Animate the Cube entering the first portal.
- Resolve the intro into Hero.
- Add a subtle Cube idle animation after arrival.
- Make the intro play once per page session.
- Add a visible, keyboard-reachable skip path.

## Explicit non-goals

- Do not add real Hero copy.
- Do not implement the Cube-to-Ship transition.
- Do not add final portfolio links or identity content.
- Do not make the intro a required game mechanic.

## Acceptance criteria

- A refresh starts the intro in a stable initial state.
- The Cube clears spikes, interacts with jump orbs, enters the portal, and arrives in Hero in the authored order.
- Hero is readable after the arrival pose settles.
- The intro plays once per page session.
- Skip resolves immediately and safely to `hero-idle`.
- Repeated input during the intro cannot create overlapping timelines.
- Reduced-motion mode bypasses the travel sequence and exposes Hero content.

## Manual visual checks

- Review the full sequence from refresh through Hero at desktop size.
- Check spike clearance, orb interaction, portal alignment, character scale, and arrival pose.
- Review the sequence at a mobile viewport and identify any composition that needs intentional adaptation.
- Confirm the skip control remains visible, legible, and keyboard reachable during the whole intro.

## Automated tests

- Test intro start, completion, skip, and once-per-session behavior.
- Test reduced-motion resolution to Hero.
- Test rapid input during intro and verify the final stable state.
- Run a Playwright refresh-to-Hero smoke test.

## Exit condition

The full intro works from refresh through Hero without real portfolio content, including the one-time rule, skip path, and reduced-motion path.

