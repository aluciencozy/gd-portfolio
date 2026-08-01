import { motion } from 'motion/react'
import {
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type ReactElement,
} from 'react'
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
const CHECKPOINT_MARKERS_KEY = 'gd-portfolio-checkpoint-markers'

function markerProgressForScene(scene: SceneId): number {
  return (SCENE_IDS.indexOf(scene) + 0.5) / SCENE_IDS.length
}

function getInitialMarkerVisibility(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    return window.localStorage.getItem(CHECKPOINT_MARKERS_KEY) === 'true'
  } catch {
    return false
  }
}

export function CheckpointProgress({
  current,
  isTransitioning,
  onNavigate,
  ...rest
}: CheckpointProgressProps): ReactElement {
  const [showMarkers, setShowMarkers] = useState(getInitialMarkerVisibility)
  const currentIndex = SCENE_IDS.indexOf(current)
  const destinationProgress = (currentIndex + 1) / SCENE_IDS.length
  const percentage = Math.round(destinationProgress * 100)
  const percentageLabel = `${percentage.toFixed(2)}%`

  const handleMarkerVisibilityChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const nextValue = event.target.checked
    setShowMarkers(nextValue)

    try {
      window.localStorage.setItem(CHECKPOINT_MARKERS_KEY, String(nextValue))
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }
  }

  return (
    <div
      className="checkpoint-progress"
      data-checkpoint-markers={showMarkers ? 'visible' : 'hidden'}
      {...rest}
    >
      <div className="checkpoint-progress__header">
        <div className="checkpoint-progress__bar">
          <div
            aria-label="Portfolio progress"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={percentage}
            aria-valuetext={percentageLabel}
            className="checkpoint-progress__track"
            data-progress-value={percentage}
            role="progressbar"
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
          </div>

          {showMarkers &&
            SCENE_IDS.map((scene) => {
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
                  style={{ left: `${markerProgress}%` }}
                >
                  <motion.span
                    className="checkpoint-progress__marker-interaction"
                    whileHover={
                      isTransitioning ? undefined : { opacity: 0.82 }
                    }
                    whileTap={
                      isTransitioning ? undefined : { opacity: 0.68 }
                    }
                  >
                    <motion.img
                      alt=""
                      animate={{ opacity: isActive ? 0 : 1 }}
                      className="checkpoint-progress__marker-image"
                      initial={false}
                      src={checkpointAssets.unfilled}
                      transition={{ duration: 0.28, ease: EASE_OUT }}
                    />
                    <motion.img
                      alt=""
                      animate={{ opacity: isActive ? 1 : 0 }}
                      className="checkpoint-progress__marker-image checkpoint-progress__marker-image--filled"
                      initial={false}
                      src={checkpointAssets.filled}
                      transition={{ duration: 0.36, ease: EASE_OUT }}
                    />
                  </motion.span>
                </motion.button>
              )
            })}
        </div>

        <span className="checkpoint-progress__percentage">
          {percentageLabel}
        </span>
      </div>

      <label className="checkpoint-progress__toggle">
        <input
          aria-label="Show checkpoint markers"
          checked={showMarkers}
          onChange={handleMarkerVisibilityChange}
          role="switch"
          type="checkbox"
        />
        <span aria-hidden="true" className="checkpoint-progress__toggle-track" />
        <span>Markers</span>
      </label>

      <span className="sr-only" aria-live="polite">
        {current} checkpoint active
      </span>
    </div>
  )
}
