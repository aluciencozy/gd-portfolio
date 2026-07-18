import type { HTMLAttributes, ReactElement } from 'react'
import { motion } from 'motion/react'
import {
  checkpointAssets,
  progressAssets,
} from '../assets/asset-catalog'
import { SCENE_IDS, type SceneId } from '../features/navigation/scene-navigator'

interface CheckpointProgressProps extends HTMLAttributes<HTMLDivElement> {
  current: SceneId
  target: SceneId | null
  onNavigate: (scene: SceneId) => void
}

function progressForScene(scene: SceneId): number {
  return (SCENE_IDS.indexOf(scene) + 0.5) / SCENE_IDS.length
}

export function CheckpointProgress({
  current,
  onNavigate,
  target,
  ...rest
}: CheckpointProgressProps): ReactElement {
  const destination = target ?? current
  const destinationProgress = progressForScene(destination)

  return (
    <div className="checkpoint-progress" {...rest}>
      <div
        aria-label={`Portfolio progress: checkpoint ${SCENE_IDS.indexOf(destination) + 1} of ${SCENE_IDS.length}`}
        className="checkpoint-progress__track"
        role="group"
      >
        <div className="checkpoint-progress__fill-clip">
          <motion.div
            aria-hidden="true"
            className="checkpoint-progress__fill"
            initial={false}
            animate={{
              clipPath: `inset(0 ${100 - destinationProgress * 100}% 0 0)`,
            }}
            style={{ backgroundImage: `url(${progressAssets.fill})` }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
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
          const isActive = scene === destination
          const markerProgress = progressForScene(scene) * 100

          return (
            <button
              aria-current={isActive ? 'step' : undefined}
              aria-label={`${scene} checkpoint`}
              className="checkpoint-progress__marker"
              data-checkpoint-marker={scene}
              disabled={target !== null || scene === current}
              key={scene}
              onClick={() => onNavigate(scene)}
              type="button"
              style={{ left: `${markerProgress}%` }}
            >
              <motion.img
                alt=""
                className="checkpoint-progress__marker-image"
                initial={false}
                animate={{ opacity: isActive ? 0 : 1 }}
                src={checkpointAssets.unfilled}
                transition={{
                  delay: isActive ? 0.16 : 0,
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              />
              <motion.img
                alt=""
                className="checkpoint-progress__marker-image checkpoint-progress__marker-image--filled"
                initial={false}
                animate={{ opacity: isActive ? 1 : 0 }}
                src={checkpointAssets.filled}
                transition={{
                  duration: 0.45,
                  ease: 'easeInOut',
                }}
              />
            </button>
          )
        })}
      </div>

      <span className="sr-only" aria-live="polite">
        {destination} checkpoint active
      </span>
    </div>
  )
}
