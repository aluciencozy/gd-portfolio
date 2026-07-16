import type { ReactElement } from 'react'
import { SCENE_IDS, type SceneId } from '../features/navigation/scene-navigator'

interface NavigationHudProps {
  current: SceneId
  isTransitioning: boolean
  onNavigate: (scene: SceneId) => void
}

const SCENE_LABELS: Record<SceneId, string> = {
  hero: 'Hero',
  about: 'About',
  projects: 'Projects',
  contact: 'Contact',
}

export function NavigationHud({
  current,
  isTransitioning,
  onNavigate,
}: NavigationHudProps): ReactElement {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex justify-center p-4 sm:p-6">
      <nav
        aria-label="Portfolio sections"
        className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full border border-white/15 bg-slate-950/65 p-1.5 shadow-xl shadow-black/20 backdrop-blur-md"
      >
        {SCENE_IDS.map((scene) => (
          <button
            aria-current={current === scene ? 'page' : undefined}
            className={`rounded-full px-3 py-2 text-[0.65rem] font-bold tracking-[0.14em] uppercase transition sm:px-4 ${
              current === scene
                ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                : 'text-white/65 hover:bg-white/10 hover:text-white'
            } disabled:pointer-events-none disabled:opacity-45`}
            disabled={isTransitioning}
            key={scene}
            onClick={() => onNavigate(scene)}
            type="button"
          >
            {SCENE_LABELS[scene]}
          </button>
        ))}
      </nav>
    </header>
  )
}

interface SceneStepControlsProps {
  current: SceneId
  isTransitioning: boolean
  onNext: () => void
  onPrevious: () => void
}

export function SceneStepControls({
  current,
  isTransitioning,
  onNext,
  onPrevious,
}: SceneStepControlsProps): ReactElement {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-between p-4 sm:p-6">
      <button
        aria-label="Previous scene"
        className="pointer-events-auto rounded-full border border-white/20 bg-slate-950/65 px-4 py-3 text-xs font-bold tracking-[0.14em] text-white uppercase shadow-lg backdrop-blur-md transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-30"
        disabled={isTransitioning || current === 'hero'}
        onClick={onPrevious}
        type="button"
      >
        <span aria-hidden="true">←</span> Previous
      </button>
      <button
        aria-label="Next scene"
        className="pointer-events-auto rounded-full border border-white/20 bg-slate-950/65 px-4 py-3 text-xs font-bold tracking-[0.14em] text-white uppercase shadow-lg backdrop-blur-md transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-30"
        disabled={isTransitioning || current === 'contact'}
        onClick={onNext}
        type="button"
      >
        Next <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}
