import type { HTMLAttributes, ReactElement } from 'react'
import {
  checkpointAssets,
  progressAssets,
} from '../assets/asset-catalog'
import { SCENE_IDS, type SceneId } from '../features/navigation/scene-navigator'

interface CheckpointProgressProps extends HTMLAttributes<HTMLDivElement> {
  current: SceneId
  onNavigate: (scene: SceneId) => void
}

function markerProgressForScene(scene: SceneId): number {
  return (SCENE_IDS.indexOf(scene) + 0.5) / SCENE_IDS.length
}

const sceneFillProgress: Record<SceneId, number> = {
  hero: 0.25,
  about: 0.5,
  projects: 0.75,
  contact: 1,
}

export function CheckpointProgress({
  current,
  onNavigate,
  ...rest
}: CheckpointProgressProps): ReactElement {
  const destinationProgress = sceneFillProgress[current]

  return (
    <div className="checkpoint-progress" {...rest}>
      <div
        aria-label={`Portfolio progress: checkpoint ${SCENE_IDS.indexOf(current) + 1} of ${SCENE_IDS.length}`}
        className="checkpoint-progress__track"
        role="group"
      >
        <div className="checkpoint-progress__fill-clip">
          <div
            aria-hidden="true"
            className="checkpoint-progress__fill"
            style={{
              backgroundImage: `url(${progressAssets.fill})`,
              clipPath: `inset(0 ${100 - destinationProgress * 100}% 0 0)`,
            }}
          />
        </div>

        <img
          alt=""
          aria-hidden="true"
          className="checkpoint-progress__groove"
          src={progressAssets.groove}
        />

        {SCENE_IDS.map((scene) => {
          const isActive = scene === current
          const markerProgress = markerProgressForScene(scene) * 100

          return (
            <button
              aria-current={isActive ? 'step' : undefined}
              aria-label={`${scene} checkpoint`}
              className="checkpoint-progress__marker"
              data-checkpoint-marker={scene}
              disabled={scene === current}
              key={scene}
              onClick={() => onNavigate(scene)}
              type="button"
              style={{ left: `${markerProgress}%` }}
            >
              <img
                alt=""
                className="checkpoint-progress__marker-image"
                src={checkpointAssets.unfilled}
                style={{ opacity: isActive ? 0 : 1 }}
              />
              <img
                alt=""
                className="checkpoint-progress__marker-image checkpoint-progress__marker-image--filled"
                src={checkpointAssets.filled}
                style={{ opacity: isActive ? 1 : 0 }}
              />
            </button>
          )
        })}
      </div>

      <span className="sr-only" aria-live="polite">
        {current} checkpoint active
      </span>
    </div>
  )
}
