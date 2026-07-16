import type { SceneMode } from '../navigation/scene-navigator'

export interface TransitionProfile {
  duration: number
  travelDistance: string
  characterRotation: number
  characterScale: number
}

export const transitionProfiles: Record<SceneMode, TransitionProfile> = {
  cube: {
    duration: 1.2,
    travelDistance: '-56%',
    characterRotation: 360,
    characterScale: 1.04,
  },
  ship: {
    duration: 1.2,
    travelDistance: '-62%',
    characterRotation: 0,
    characterScale: 1.08,
  },
  ball: {
    duration: 1.2,
    travelDistance: '-58%',
    characterRotation: 720,
    characterScale: 1.03,
  },
  wave: {
    duration: 1.2,
    travelDistance: '-64%',
    characterRotation: -14,
    characterScale: 1.1,
  },
}

export function getTransitionProfile(mode: SceneMode): TransitionProfile {
  return transitionProfiles[mode]
}
