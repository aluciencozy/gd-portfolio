import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { useEffect, type ReactElement } from 'react'
import { characterAssets } from '../assets/asset-catalog'
import type { NavigationDirection } from '../features/navigation/scene-navigator'

export interface CubeReaction {
  direction: NavigationDirection
  nonce: number
}

interface RestingCubeProps {
  comment: string | null
  paused: boolean
  reaction: CubeReaction | null
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const

export function RestingCube({
  comment,
  paused,
  reaction,
}: RestingCubeProps): ReactElement {
  const [scope, animate] = useAnimate<HTMLDivElement>()

  useEffect(() => {
    if (paused || !reaction || !scope.current) {
      return
    }

    const direction = reaction.direction === 'forward' ? 1 : -1
    void animate(
      scope.current,
      {
        x: [0, direction * 22, direction * 9, 0],
        y: [0, -16, -5, 0],
        rotate: [0, direction * 9, direction * -4, 0],
        scaleX: [1, 0.96, 1.03, 1],
        scaleY: [1, 1.04, 0.98, 1],
      },
      { duration: 0.58, ease: EASE_OUT },
    )
  }, [animate, paused, reaction, scope])

  useEffect(() => {
    if (paused || !comment || !scope.current) {
      return
    }

    void animate(
      scope.current,
      {
        y: [0, -20, 0, -7, 0],
        rotate: [0, -6, 5, -2, 0],
        scale: [1, 1.06, 1, 1.025, 1],
      },
      { duration: 0.72, ease: EASE_OUT },
    )
  }, [animate, comment, paused, scope])

  return (
    <div
      className="cube-anchor"
      data-cube-reaction={reaction?.nonce}
      data-opening-cube
      data-resting-cube
      ref={scope}
    >
      <AnimatePresence>
        {comment && !paused && (
          <motion.div
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            aria-live="polite"
            className="cube-comment"
            exit={{ opacity: 0, scale: 0.94, x: -12, y: 8 }}
            initial={{ opacity: 0, scale: 0.92, x: -18, y: 10 }}
            key={comment}
            transition={{ duration: 0.28, ease: EASE_OUT }}
          >
            {comment}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={
          paused
            ? { rotate: 0, scaleX: 1, scaleY: 1, y: 0 }
            : {
                rotate: [0, -1.5, 1.25, 0],
                scaleX: [1, 1.018, 0.992, 1],
                scaleY: [1, 0.986, 1.012, 1],
                y: [0, -7, -2, 0],
              }
        }
        className="cube-anchor__idle"
        transition={
          paused
            ? { duration: 0.2 }
            : {
                duration: 3.2,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: 0.25,
              }
        }
      >
        <img alt="" className="cube-anchor__image" src={characterAssets.cube} />
      </motion.div>
    </div>
  )
}
