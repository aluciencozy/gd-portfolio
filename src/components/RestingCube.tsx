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
  onPositionChange: (x: number) => void
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

function groundOffsetForRotation(
  rotation: number,
  width: number,
  height: number,
  scaleX = 1,
  scaleY = 1,
): number {
  const radians = (rotation * Math.PI) / 180
  const halfWidth = (width * scaleX) / 2
  const scaledHeight = height * scaleY
  const sine = Math.abs(Math.sin(radians))
  const cosine = Math.cos(radians)

  return cosine >= 0
    ? halfWidth * sine
    : halfWidth * sine - scaledHeight * cosine
}

export function RestingCube({
  comment,
  onPositionChange,
  paused,
  reaction,
}: RestingCubeProps): ReactElement {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const [reactionScope, animateReaction] = useAnimate<HTMLDivElement>()
  const reduceMotion = useReducedMotion() ?? false
  const cubeMotion = useRef({ rotate: 0, x: 0, y: 0 })

  useEffect(() => {
    if (paused || reduceMotion || !reaction || !scope.current) {
      return
    }

    const direction = reaction.direction === 'forward' ? 1 : -1
    const start = cubeMotion.current
    const targetX = start.x === 0 ? direction * CUBE_JUMP_DISTANCE : -start.x
    const targetRotate = start.rotate + direction * 90
    const cubeStyle = getComputedStyle(scope.current)
    const cubeWidth = Number.parseFloat(cubeStyle.width)
    const cubeHeight = Number.parseFloat(cubeStyle.height)
    const middleRotate = start.rotate + direction * 45
    const middleGroundOffset = groundOffsetForRotation(
      middleRotate,
      cubeWidth,
      cubeHeight,
      0.96,
      1.05,
    )
    const targetGroundOffset = groundOffsetForRotation(
      targetRotate,
      cubeWidth,
      cubeHeight,
    )
    const middleY = Math.min(-48, -middleGroundOffset - 24)
    const targetY = -targetGroundOffset
    cubeMotion.current = { rotate: targetRotate, x: targetX, y: targetY }
    onPositionChange(targetX)

    void animate(
      scope.current,
      {
        x: [start.x, start.x + (targetX - start.x) * 0.52, targetX],
        y: [start.y, middleY, targetY],
        rotate: [start.rotate, middleRotate, targetRotate],
        scaleX: [1, 0.96, 1],
        scaleY: [1, 1.05, 1],
      },
      { duration: 0.72, ease: EASE_IN_OUT, times: [0, 0.5, 1] },
    )
  }, [animate, onPositionChange, paused, reaction, reduceMotion, scope])

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
      data-resting-cube
    >
      <motion.div
        animate={
          paused || reduceMotion
            ? { rotate: 0, scaleX: 1, scaleY: 1, x: 0, y: 0 }
            : {
                rotate: [0, -1.5, 1.25, 0],
                scaleX: [1, 1.018, 0.992, 1],
                scaleY: [1, 0.986, 1.012, 1],
                x: [0, -6, 6, 0],
                y: [0, -10, -5, 0],
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
        <div className="cube-anchor__reaction" ref={reactionScope}>
          <div
            className="cube-anchor__motion"
            data-opening-cube
            ref={scope}
          >
            <img alt="" className="cube-anchor__image" src={characterAssets.cube} />
          </div>
        </div>
      </motion.div>
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
