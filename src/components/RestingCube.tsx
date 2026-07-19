import { useEffect, type ReactElement } from 'react'
import { useAnimate } from 'motion/react'
import { characterAssets } from '../assets/asset-catalog'
import type { NavigationDirection } from '../features/navigation/scene-navigator'

export interface CubeReaction {
  direction: NavigationDirection
  nonce: number
}

interface RestingCubeProps {
  paused: boolean
  reaction: CubeReaction | null
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const

export function RestingCube({
  paused,
  reaction,
}: RestingCubeProps): ReactElement {
  const [scope, animate] = useAnimate<HTMLDivElement>()

  useEffect(() => {
    if (paused || !scope.current) {
      return
    }

    let interval = 0
    const timeout = window.setTimeout(() => {
      const playIdle = async () => {
        if (!scope.current) {
          return
        }

        await animate(
          scope.current,
          {
            y: [0, 0, -12, 0],
            rotate: [0, -3, 4, 0],
            scaleX: [1, 1.04, 0.98, 1],
            scaleY: [1, 0.96, 1.02, 1],
          },
          { duration: 0.62, ease: EASE_OUT },
        )
      }

      void playIdle()
      interval = window.setInterval(() => void playIdle(), 8_800)
    }, 6_200)

    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [animate, paused, scope])

  useEffect(() => {
    if (paused || !reaction || !scope.current) {
      return
    }

    const direction = reaction.direction === 'forward' ? 1 : -1
    void animate(
      scope.current,
      {
        x: [0, direction * 18, direction * 7, 0],
        rotate: [0, direction * 7, direction * -3, 0],
        scaleX: [1, 0.94, 1.03, 1],
      },
      { duration: 0.42, ease: EASE_OUT },
    )
  }, [animate, paused, reaction, scope])

  return (
    <div
      className="cube-anchor"
      data-cube-reaction={reaction?.nonce}
      data-opening-cube
      data-resting-cube
      ref={scope}
    >
      <img alt="" className="cube-anchor__image" src={characterAssets.cube} />
    </div>
  )
}
