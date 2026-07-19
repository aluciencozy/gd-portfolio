import type { SceneId, TransitionCommand } from './scene-navigator'

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

export function modeForDeparture(from: SceneId): CinematicMode {
  if (from === 'hero') {
    return 'cube'
  }

  if (from === 'about') {
    return 'ship'
  }

  return 'wave'
}

export function createCinematicIntent(
  command: TransitionCommand,
): CinematicTransitionIntent {
  return {
    ...command,
    mode: modeForDeparture(command.from),
  }
}
