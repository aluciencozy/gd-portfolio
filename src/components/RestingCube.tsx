import {
  AnimatePresence,
  motion,
  useAnimate,
  useReducedMotion,
} from 'motion/react'
import { useEffect, useRef, type ReactElement } from 'react'
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

interface CubeCommentProps {
  comment: string | null
  paused: boolean
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const
const EASE_IN_OUT = [0.42, 0, 0.58, 1] as const
const CUBE_JUMP_DISTANCE = 44

export function RestingCube({
  comment,
  paused,
  reaction,
}: RestingCubeProps): ReactElement {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const [reactionScope, animateReaction] = useAnimate<HTMLDivElement>()
  const reduceMotion = useReducedMotion() ?? false
  const cubeMotion = useRef({ rotate: 0, x: 0 })

  useEffect(() => {
    if (paused || reduceMotion || !reaction || !scope.current) {
      return
    }

    const direction = reaction.direction === 'forward' ? 1 : -1
    const start = cubeMotion.current
    const targetX = start.x === 0 ? direction * CUBE_JUMP_DISTANCE : -start.x
    const targetRotate = start.rotate + direction * 90
    cubeMotion.current = { rotate: targetRotate, x: targetX }

    void animate(
      scope.current,
      {
        x: [start.x, start.x + (targetX - start.x) * 0.52, targetX],
        y: [0, -48, 0],
        rotate: [start.rotate, start.rotate + direction * 45, targetRotate],
        scaleX: [1, 0.96, 1],
        scaleY: [1, 1.05, 1],
      },
      { duration: 0.72, ease: EASE_IN_OUT, times: [0, 0.5, 1] },
    )
  }, [animate, paused, reaction, reduceMotion, scope])

  useEffect(() => {
    if (
      paused ||
      reduceMotion ||
      !comment ||
      !reactionScope.current
    ) {
      return
    }

    void animateReaction(
      reactionScope.current,
      {
        y: [0, -20, 0, -7, 0],
        rotate: [0, -6, 5, -2, 0],
        scale: [1, 1.06, 1, 1.025, 1],
      },
      { duration: 0.72, ease: EASE_OUT },
    )
  }, [animateReaction, comment, paused, reactionScope, reduceMotion])

  return (
    <div
      className="cube-anchor"
      data-cube-reaction={reaction?.nonce}
      data-opening-cube
      data-resting-cube
      ref={scope}
    >
      <div className="cube-anchor__reaction" ref={reactionScope}>
        <motion.div
          animate={
            paused || reduceMotion
              ? { rotate: 0, scaleX: 1, scaleY: 1, x: 0, y: 0 }
              : {
                  rotate: [0, -1.5, 1.25, 0],
                  scaleX: [1, 1.018, 0.992, 1],
                  scaleY: [1, 0.986, 1.012, 1],
                  x: [0, -6, 6, 0],
                  y: [0, -7, -2, 0],
                }
          }
          className="cube-anchor__idle"
          transition={
            paused || reduceMotion
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
    </div>
  )
}

export function CubeComment({
  comment,
  paused,
}: CubeCommentProps): ReactElement {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <AnimatePresence>
      {comment && !paused && (
        <motion.div
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          aria-live="polite"
          className="cube-comment"
          exit={{ opacity: 0, scale: 0.94, x: -12, y: 8 }}
          initial={{ opacity: 0, scale: 0.92, x: -18, y: 10 }}
          key={comment}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.28, ease: EASE_OUT }
          }
        >
          {comment}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
