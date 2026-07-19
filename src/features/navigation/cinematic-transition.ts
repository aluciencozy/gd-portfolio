import type {
  NavigationDirection,
  SceneId,
  TransitionCommand,
} from './scene-navigator'

export const CINEMATIC_MODES = ['cube', 'ship', 'wave'] as const

export type CinematicMode = (typeof CINEMATIC_MODES)[number]

export type CinematicPhase =
  | 'cover'
  | 'hold'
  | 'reveal'
  | 'gameplay'
  | 'destination-cover'
  | 'destination-reveal'
  | 'arrival'
  | 'content-reveal'
  | 'skip-reveal'

export interface CinematicTransitionIntent extends TransitionCommand {
  mode: CinematicMode
}

export function modeForDeparture(
  from: SceneId,
  direction: NavigationDirection,
): CinematicMode {
  if (direction === 'forward') {
    if (from === 'hero') {
      return 'cube'
    }

    if (from === 'about') {
      return 'ship'
    }

    return 'wave'
  }

  if (from === 'contact') {
    return 'wave'
  }

  if (from === 'projects') {
    return 'ship'
  }

  return 'cube'
}

export function createCinematicIntent(
  command: TransitionCommand,
): CinematicTransitionIntent {
  return {
    ...command,
    mode: modeForDeparture(command.from, command.direction),
  }
}
