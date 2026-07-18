import { useEffect, useRef, type ReactElement } from 'react'
import { useAnimate } from 'motion/react'
import { PortfolioSection } from './PortfolioSection'
import type { SceneId, TransitionCommand } from '../features/navigation/scene-navigator'

interface RouteStageProps {
  current: SceneId
  transition: TransitionCommand | null
  onComplete: () => void
  onRecover: () => void
}

const EXIT_DURATION = 0.4
const CLEAN_STAGE_PAUSE = 0.7
const ENTER_DURATION = 0.7
const EASE_OUT = [0.22, 1, 0.36, 1] as const

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })
}

export function RouteStage({
  current,
  transition,
  onComplete,
  onRecover,
}: RouteStageProps): ReactElement {
  const [scope, animate] = useAnimate()
  const currentRef = useRef<HTMLElement>(null)
  const targetRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!transition || !currentRef.current || !targetRef.current) {
      return
    }

    let cancelled = false

    const runTimeline = async () => {
      const currentElement = currentRef.current
      const targetElement = targetRef.current

      if (!currentElement || !targetElement) {
        return
      }

      try {
        const currentWidth = currentElement.getBoundingClientRect().width || window.innerWidth
        const targetWidth = targetElement.getBoundingClientRect().width || window.innerWidth
        const direction = transition.direction === 'forward' ? 1 : -1
        const exitX = -direction * currentWidth * 0.35
        const enterX = direction * targetWidth * 0.35

        await animate(
          targetElement,
          { x: enterX, opacity: 0 },
          { duration: 0 },
        )
        await animate(
          currentElement,
          { x: exitX, opacity: 0 },
          { duration: EXIT_DURATION, ease: EASE_OUT },
        )

        if (cancelled) {
          return
        }

        await wait(CLEAN_STAGE_PAUSE * 1000)

        if (cancelled) {
          return
        }

        await animate(
          targetElement,
          { x: 0, opacity: 1 },
          { duration: ENTER_DURATION, ease: EASE_OUT },
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
  }, [animate, onComplete, onRecover, transition])

  return (
    <div className="route-stage__layers" ref={scope}>
      <PortfolioSection
        key={`current-${current}`}
        ref={currentRef}
        ariaHidden={Boolean(transition)}
        className="route-content--current"
        id={current}
      />

      {transition && (
        <PortfolioSection
          key={`target-${transition.to}`}
          ref={targetRef}
          ariaHidden
          className="route-content--target"
          id={transition.to}
        />
      )}
    </div>
  )
}
