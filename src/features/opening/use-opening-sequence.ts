import { useLayoutEffect, useState } from 'react'
import { useAnimate } from 'motion/react'

export type OpeningPhase = 'intro' | 'revealing' | 'complete'

interface OpeningSequence {
  isActive: boolean
  phase: OpeningPhase
  scope: ReturnType<typeof useAnimate<HTMLDivElement>>[0]
}

const CAMERA_ZOOM = 2.2
const CAMERA_TARGET_Y = 0.53
const EASE_OUT = [0.22, 1, 0.36, 1] as const

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration * 1000)
  })
}

export function useOpeningSequence(enabled: boolean): OpeningSequence {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const [phase, setPhase] = useState<OpeningPhase>(
    enabled ? 'intro' : 'complete',
  )

  useLayoutEffect(() => {
    if (!enabled || !scope.current) {
      return
    }

    const root = scope.current
    const cameras = Array.from(
      root.querySelectorAll<HTMLElement>('[data-opening-camera]'),
    )
    const cube = root.querySelector<HTMLElement>('[data-opening-cube]')
    const progress = root.querySelector<HTMLElement>('[data-opening-progress]')
    const content = Array.from(
      root.querySelectorAll<HTMLElement>('[data-opening-content]'),
    )

    if (
      cameras.length === 0 ||
      !cube ||
      !progress ||
      content.length === 0
    ) {
      setPhase('complete')
      return
    }

    let cancelled = false

    // Strict Mode runs layout effects twice in development. Always restore the
    // settled geometry before measuring so the second run gets identical data.
    cameras.forEach((camera) => {
      camera.getAnimations().forEach((animation) => animation.cancel())
      camera.style.transform = 'none'
      camera.style.transformOrigin = '0 0'
      camera.style.willChange = 'transform'
    })
    cube.getAnimations().forEach((animation) => animation.cancel())
    cube.style.transform = 'none'
    cube.style.transformOrigin = 'center bottom'
    cube.style.willChange = 'transform'

    const cubeRect = cube.getBoundingClientRect()
    const targetX = window.innerWidth / 2
    const targetY = window.innerHeight * CAMERA_TARGET_Y
    const cameraX = targetX - CAMERA_ZOOM * (cubeRect.left + cubeRect.width / 2)
    const cameraY = targetY - CAMERA_ZOOM * (cubeRect.top + cubeRect.height / 2)
    const closeUpCubeTop = targetY - (CAMERA_ZOOM * cubeRect.height) / 2
    const fallStartY =
      (-CAMERA_ZOOM * cubeRect.height - closeUpCubeTop - 24) / CAMERA_ZOOM

    cameras.forEach((camera) => {
      camera.style.transform = `translate3d(${cameraX}px, ${cameraY}px, 0) scale(${CAMERA_ZOOM})`
    })
    cube.style.transform = `translate3d(0, ${fallStartY}px, 0)`

    const run = async (): Promise<void> => {
      try {
        await animate(
          cube,
          {
            y: [fallStartY, 0],
            scaleX: [1, 1, 1.06],
            scaleY: [1, 1, 0.94],
          },
          {
            duration: 0.95,
            ease: [0.55, 0, 1, 0.45],
            times: [0, 0.88, 1],
          },
        )
        await animate(
          cube,
          {
            y: -cubeRect.height * 0.2,
            scaleX: 1,
            scaleY: 1,
          },
          { duration: 0.22, ease: EASE_OUT },
        )
        await animate(
          cube,
          { y: 0 },
          { duration: 0.3, ease: [0.55, 0, 1, 0.45] },
        )
        await wait(0.45)

        if (cancelled) {
          return
        }

        await animate(
          cube,
          { x: -cubeRect.width * 0.55 },
          { duration: 0.3, ease: 'easeInOut' },
        )
        await wait(0.4)

        if (cancelled) {
          return
        }

        await animate(
          cube,
          { x: cubeRect.width * 0.85 },
          { duration: 0.52, ease: 'easeInOut' },
        )
        await wait(0.4)

        if (cancelled) {
          return
        }

        await animate(
          cube,
          { x: 0 },
          { duration: 0.5, ease: 'easeInOut' },
        )
        await wait(0.45)

        if (cancelled) {
          return
        }

        await animate(
          '[data-opening-camera]',
          { x: 0, y: 0, scale: 1 },
          { duration: 1.1, ease: EASE_OUT },
        )
        await wait(0.25)

        if (cancelled) {
          return
        }

        setPhase('revealing')
        ;[progress, ...content].forEach((element) => {
          element.style.visibility = 'visible'
          element.style.willChange = 'transform, opacity, filter'
        })

        await Promise.all([
          animate(
            progress,
            {
              opacity: [0, 1],
              y: [-18, 0],
              filter: ['blur(10px)', 'blur(0px)'],
            },
            { duration: 0.7, ease: EASE_OUT },
          ),
          ...content.map((element, index) => {
            const edge = element.dataset.edge
            const horizontalOffset =
              edge === 'left' ? -56 : edge === 'right' ? 56 : 0
            const verticalOffset =
              edge === 'top' ? -36 : edge === 'bottom' ? 36 : 0

            return animate(
              element,
              {
                opacity: [0, 1],
                x: [horizontalOffset, 0],
                y: [verticalOffset, 0],
                filter: ['blur(10px)', 'blur(0px)'],
              },
              {
                delay: 0.12 + index * 0.08,
                duration: 0.78,
                ease: EASE_OUT,
              },
            )
          }),
        ])

        if (cancelled) {
          return
        }

        cameras.forEach((camera) => {
          camera.style.willChange = 'auto'
        })
        cube.style.willChange = 'auto'
        ;[progress, ...content].forEach((element) => {
          element.style.willChange = 'auto'
        })
        setPhase('complete')
      } catch {
        if (!cancelled) {
          setPhase('complete')
        }
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [animate, enabled, scope])

  return {
    isActive: phase !== 'complete',
    phase,
    scope,
  }
}
