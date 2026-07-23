import { motion } from 'motion/react'
import type { HTMLAttributes, ReactElement } from 'react'
import {
  checkpointAssets,
  progressAssets,
} from '../assets/asset-catalog'
import { SCENE_IDS, type SceneId } from '../features/navigation/scene-navigator'

interface CheckpointProgressProps extends HTMLAttributes<HTMLDivElement> {
  current: SceneId
  isTransitioning: boolean
  onNavigate: (scene: SceneId) => void
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const

function markerProgressForScene(scene: SceneId): number {
  return (SCENE_IDS.indexOf(scene) + 0.5) / SCENE_IDS.length
}

export function CheckpointProgress({
  current,
  isTransitioning,
  onNavigate,
  ...rest
}: CheckpointProgressProps): ReactElement {
  const currentIndex = SCENE_IDS.indexOf(current)
  const destinationProgress = (currentIndex + 1) / SCENE_IDS.length
  const percentage = Math.round(destinationProgress * 100)

  return (
    <div className="checkpoint-progress" {...rest}>
      <div className="checkpoint-progress__meta">
        <span>
          {String(currentIndex + 1).padStart(2, '0')} /{' '}
          {String(SCENE_IDS.length).padStart(2, '0')}
        </span>
        <span>{percentage}% complete</span>
      </div>

      <div
        aria-label={`Portfolio progress: checkpoint ${currentIndex + 1} of ${SCENE_IDS.length}`}
        className="checkpoint-progress__track"
        data-progress-value={percentage}
        role="group"
      >
        <div className="checkpoint-progress__fill-clip">
          <motion.div
            animate={{
              clipPath: `inset(0 ${100 - destinationProgress * 100}% 0 0)`,
            }}
            aria-hidden="true"
            className="checkpoint-progress__fill"
            initial={false}
            style={{
              backgroundImage: `url(${progressAssets.fill})`,
            }}
            transition={{ duration: 0.72, ease: EASE_OUT }}
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
            <motion.button
              aria-current={isActive ? 'step' : undefined}
              aria-label={`${scene} checkpoint`}
              className="checkpoint-progress__marker"
              data-checkpoint-marker={scene}
              disabled={isActive || isTransitioning}
              key={scene}
              onClick={() => onNavigate(scene)}
              type="button"
              whileHover={isTransitioning ? undefined : { scale: 1.1, y: -2 }}
              whileTap={isTransitioning ? undefined : { scale: 0.96 }}
              style={{ left: `${markerProgress}%` }}
            >
              <motion.img
                alt=""
                animate={{ opacity: isActive ? 0 : 1, scale: isActive ? 0.9 : 1 }}
                className="checkpoint-progress__marker-image"
                initial={false}
                src={checkpointAssets.unfilled}
                transition={{ duration: 0.28, ease: EASE_OUT }}
              />
              <motion.img
                alt=""
                animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.84 }}
                className="checkpoint-progress__marker-image checkpoint-progress__marker-image--filled"
                initial={false}
                src={checkpointAssets.filled}
                transition={{ duration: 0.36, ease: EASE_OUT }}
              />
            </motion.button>
          )
        })}
      </div>

      <span className="sr-only" aria-live="polite">
        {current} checkpoint active
      </span>
    </div>
  )
}
