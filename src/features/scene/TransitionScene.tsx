import { useEffect, type ReactElement } from 'react'
import { useAnimate } from 'motion/react'
import { characterAssets } from '../../assets/asset-catalog'
import type { TransitionCommand } from '../navigation/scene-navigator'
import { SceneAsset } from './SceneAsset'
import { getTransitionProfile } from './transition-profiles'
import { TransitionTrack } from './TransitionTrack'

interface TransitionSceneProps {
  transition: TransitionCommand
  onComplete: () => void
  onRecover: () => void
  onSkip: () => void
}

const MODE_LABELS = {
  cube: 'Cube',
  ship: 'Ship',
  ball: 'Ball',
  wave: 'Wave',
} as const

const TIMELINE_PHASES = {
  character: 0.22,
  track: 0.42,
  portal: 0.14,
  flash: 0.1,
  arrival: 0.12,
} as const

function reversePercentage(value: string): string {
  return value.replace('-', '')
}

export function TransitionScene({
  transition,
  onComplete,
  onRecover,
  onSkip,
}: TransitionSceneProps): ReactElement {
  const [scope, animate] = useAnimate()
  const profile = getTransitionProfile(transition.sourceMode)
  const travelDistance =
    transition.direction === 'forward'
      ? profile.travelDistance
      : reversePercentage(profile.travelDistance)
  const rotation =
    transition.direction === 'forward'
      ? profile.characterRotation
      : -profile.characterRotation

  useEffect(() => {
    let cancelled = false

    const runTimeline = async () => {
      try {
        await animate(
          '[data-transition-character]',
          { rotate: rotation, scale: profile.characterScale },
          { duration: profile.duration * TIMELINE_PHASES.character, ease: 'easeInOut' },
        )
        await animate(
          '[data-transition-track]',
          { x: travelDistance },
          { duration: profile.duration * TIMELINE_PHASES.track, ease: [0.22, 1, 0.36, 1] },
        )
        await animate(
          '[data-transition-portal]',
          { scale: [1, 1.16, 1.05], rotate: [0, 5, 0] },
          { duration: profile.duration * TIMELINE_PHASES.portal, ease: 'easeInOut' },
        )
        await animate(
          '[data-transition-flash]',
          { opacity: [0, 0.9, 0] },
          { duration: profile.duration * TIMELINE_PHASES.flash, ease: 'easeOut' },
        )
        await animate(
          '[data-transition-arrival]',
          { opacity: 1, scale: 1, y: 0 },
          { duration: profile.duration * TIMELINE_PHASES.arrival, ease: 'easeOut' },
        )

        if (!cancelled) {
          onComplete()
        }
      } catch {
        if (!cancelled) {
          onRecover()
        }
      }
    }

    void runTimeline()

    return () => {
      cancelled = true
    }
  }, [animate, onComplete, onRecover, profile, rotation, travelDistance])

  return (
    <div
      aria-label={`Transitioning to ${MODE_LABELS[transition.destinationMode]}`}
      className="fixed inset-0 z-30 overflow-hidden bg-slate-950/90"
      ref={scope}
      role="dialog"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_42%)]" />

      <TransitionTrack
        direction={transition.direction}
        portalMode={transition.portalMode}
      />

      <SceneAsset
        alt=""
        className="absolute left-1/2 top-1/2 w-[clamp(4.5rem,10vw,9rem)] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_1.5rem_rgba(255,255,255,0.5)]"
        dataAttribute="character"
        fallbackLabel={`${transition.sourceMode} character`}
        src={characterAssets[transition.sourceMode]}
      />

      <SceneAsset
        alt=""
        className="absolute left-1/2 top-1/2 w-[clamp(4.5rem,10vw,9rem)] -translate-x-1/2 -translate-y-1/2 scale-75 opacity-0 drop-shadow-[0_0_1.5rem_rgba(255,255,255,0.8)]"
        dataAttribute="arrival"
        fallbackLabel={`${transition.destinationMode} character`}
        src={characterAssets[transition.destinationMode]}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-white opacity-0 mix-blend-screen"
        data-transition-flash="true"
      />

      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4 px-4 text-center text-white">
        <p className="rounded-full border border-white/25 bg-black/40 px-4 py-2 text-sm font-semibold tracking-[0.18em] uppercase backdrop-blur-sm">
          {MODE_LABELS[transition.sourceMode]} travel
          <span className="mx-2 text-white/45">to</span>
          {MODE_LABELS[transition.destinationMode]}
        </p>
        <button
          className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.14em] text-white uppercase transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          onClick={onSkip}
          type="button"
        >
          Skip transition
        </button>
      </div>
    </div>
  )
}
