import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactElement,
} from 'react'
import { useAnimate, type AnimationSequence } from 'motion/react'
import { characterAssets, obstacleAssets } from '../assets/asset-catalog'
import {
  createCinematicIntent,
  type CinematicMode,
  type CinematicPhase,
} from '../features/navigation/cinematic-transition'
import type { TransitionCommand } from '../features/navigation/scene-navigator'
import { SceneBackdrop } from '../features/scene/SceneBackdrop'
import { SceneGround } from '../features/scene/SceneGround'

interface CinematicTransitionProps {
  command: TransitionCommand
  skipTransition: boolean
  onCovered: () => void
  onComplete: () => void
  onRecover: () => void
}

export interface CinematicTransitionHandle {
  finishCurrent: () => void
}

interface InterruptSignal {
  promise: Promise<void>
  resolve: () => void
}

interface ArrivalState {
  app: HTMLElement
  cameras: HTMLElement[]
  content: HTMLElement[]
  transform: string
}

const CAMERA_ZOOM = 2.2
const CAMERA_TARGET_Y = 0.53
const COVER_DURATION = 0.7
const ICON_DURATION = 1.1
const REVEAL_DURATION = 0.7
const GAMEPLAY_DURATION = 1.7
const ARRIVAL_DURATION = 1
const CONTENT_DURATION = 0.45
const SKIP_REVEAL_DURATION = 0.35
const EASE_OUT = [0.22, 1, 0.36, 1] as const
const CURTAIN_EASE = [0.65, 0, 0.35, 1] as const

const CURTAIN_CLIPS = {
  forward: {
    start: 'polygon(-112% 0, -12% 0, 0% 100%, -100% 100%)',
    covered: 'polygon(-12% 0, 100% 0, 112% 100%, 0% 100%)',
    end: 'polygon(100% 0, 212% 0, 224% 100%, 112% 100%)',
  },
  backward: {
    start: 'polygon(100% 0, 212% 0, 200% 100%, 88% 100%)',
    covered: 'polygon(0% 0, 112% 0, 100% 100%, -12% 100%)',
    end: 'polygon(-112% 0, 0% 0, -12% 100%, -124% 100%)',
  },
} as const

function createInterruptSignal(): InterruptSignal {
  let resolve: () => void = () => {}
  const promise = new Promise<void>((nextResolve) => {
    resolve = nextResolve
  })

  return { promise, resolve }
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

function ModeObstacles({ mode }: { mode: CinematicMode }): ReactElement | null {
  if (mode === 'cube') {
    return (
      <>
        <div className="cinematic-cube-ground" />
        <img
          alt=""
          aria-hidden="true"
          className="cinematic-cube-spike"
          src={obstacleAssets.spike}
        />
      </>
    )
  }

  if (mode === 'ship') {
    return (
      <svg
        aria-hidden="true"
        className="cinematic-hazards"
        preserveAspectRatio="none"
        viewBox="0 0 1000 600"
      >
        <path
          className="cinematic-hazard-mass"
          d="M0 0H1000V58L940 128 880 72 820 142 760 86 700 156 640 100 580 170 520 114 460 184 400 128 340 198 280 142 220 212 160 156 100 226 40 170 0 218Z"
        />
        <path
          className="cinematic-hazard-edge"
          d="M0 218 40 170 100 226 160 156 220 212 280 142 340 198 400 128 460 184 520 114 580 170 640 100 700 156 760 86 820 142 880 72 940 128 1000 58"
        />
        <path
          className="cinematic-hazard-mass"
          d="M0 600H1000V350L940 410 880 354 820 424 760 368 700 438 640 382 580 452 520 396 460 466 400 410 340 480 280 424 220 494 160 438 100 508 40 452 0 500Z"
        />
        <path
          className="cinematic-hazard-edge"
          d="M0 500 40 452 100 508 160 438 220 494 280 424 340 480 400 410 460 466 520 396 580 452 640 382 700 438 760 368 820 424 880 354 940 410 1000 350"
        />
      </svg>
    )
  }

  return (
    <svg
      aria-hidden="true"
      className="cinematic-hazards"
      preserveAspectRatio="none"
      viewBox="0 0 1000 600"
    >
      <path
        className="cinematic-hazard-mass"
        d="M0 0H1000V80L750 320 500 80 250 320 0 80Z"
      />
      <path
        className="cinematic-hazard-edge"
        d="M0 80 250 320 500 80 750 320 1000 80"
      />
      <path
        className="cinematic-hazard-mass"
        d="M0 600H1000V320L750 560 500 320 250 560 0 320Z"
      />
      <path
        className="cinematic-hazard-edge"
        d="M0 320 250 560 500 320 750 560 1000 320"
      />
      <path
        className="cinematic-wave-trail"
        d="M-40 200 250 440 500 200 750 440 1040 200"
        data-wave-trail
        pathLength="1"
      />
    </svg>
  )
}

export const CinematicTransition = forwardRef<
  CinematicTransitionHandle,
  CinematicTransitionProps
>(function CinematicTransition(
  {
    command,
    skipTransition,
    onCovered,
    onComplete,
    onRecover,
  },
  forwardedRef,
): ReactElement {
  const intent = createCinematicIntent(command)
  const clips = CURTAIN_CLIPS[intent.direction]
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const [phase, setPhase] = useState<CinematicPhase>(
    skipTransition ? 'skip-reveal' : 'cover',
  )
  const activeAnimation = useRef<{ stop: () => void } | null>(null)
  const interruptSignal = useRef<InterruptSignal>(createInterruptSignal())
  const interruptRequested = useRef(false)
  const covered = useRef(false)

  useImperativeHandle(forwardedRef, () => ({
    finishCurrent: () => {
      interruptRequested.current = true
      interruptSignal.current.resolve()
      activeAnimation.current?.stop()
    },
  }))

  useEffect(() => {
    const root = scope.current
    if (!root) {
      onRecover()
      return
    }

    let cancelled = false
    let arrivalState: ArrivalState | null = null

    const play = async (sequence: AnimationSequence): Promise<boolean> => {
      if (interruptRequested.current) {
        return false
      }

      interruptSignal.current = createInterruptSignal()
      const controls = animate(sequence)
      activeAnimation.current = controls

      const interrupted = await Promise.race([
        Promise.resolve(controls).then(() => false),
        interruptSignal.current.promise.then(() => true),
      ])

      if (interrupted) {
        controls.stop()
      }

      if (activeAnimation.current === controls) {
        activeAnimation.current = null
      }

      return !interrupted && !cancelled
    }

    const coverDestination = async (): Promise<void> => {
      if (covered.current) {
        return
      }

      covered.current = true
      onCovered()
      await nextFrame()
    }

    const getApp = (): HTMLElement | null =>
      root.closest<HTMLElement>('.app-shell')

    const getContent = (app: HTMLElement): HTMLElement[] =>
      Array.from(
        app.querySelectorAll<HTMLElement>(
          '[data-opening-eyebrow], [data-opening-heading], [data-opening-body], [data-navigation-prompt]',
        ),
      )

    const clearArrival = (arrival: ArrivalState): void => {
      arrival.cameras.forEach((camera) => {
        camera.style.transform = 'none'
        camera.style.transformOrigin = '0 0'
        camera.style.willChange = 'auto'
      })
      arrival.content.forEach((element) => {
        element.style.visibility = 'visible'
        element.style.opacity = '1'
        element.style.transform = 'none'
        element.style.filter = 'none'
        element.style.willChange = 'auto'
      })
      delete arrival.app.dataset.arriving
    }

    const prepareArrival = (): ArrivalState | null => {
      const app = getApp()
      if (!app) {
        return null
      }

      const cameras = Array.from(
        app.querySelectorAll<HTMLElement>('[data-scene-camera]'),
      )
      const cube = app.querySelector<HTMLElement>('[data-resting-cube]')
      if (!cube || cameras.length === 0) {
        return null
      }

      cameras.forEach((camera) => {
        camera.getAnimations().forEach((animation) => animation.cancel())
        camera.style.transform = 'none'
        camera.style.transformOrigin = '0 0'
      })

      const cubeRect = cube.getBoundingClientRect()
      const targetX = window.innerWidth / 2
      const targetY = window.innerHeight * CAMERA_TARGET_Y
      const cameraX = targetX - CAMERA_ZOOM * (cubeRect.left + cubeRect.width / 2)
      const cameraY = targetY - CAMERA_ZOOM * (cubeRect.top + cubeRect.height / 2)
      const transform = `translate3d(${cameraX}px, ${cameraY}px, 0px) scale(${CAMERA_ZOOM})`
      const content = getContent(app)

      cameras.forEach((camera) => {
        camera.style.transform = transform
        camera.style.willChange = 'transform'
      })
      content.forEach((element) => {
        element.style.visibility = 'visible'
        element.style.opacity = '0'
        element.style.transform = 'translate3d(0, 24px, 0)'
        element.style.filter = 'blur(10px)'
        element.style.willChange = 'transform, opacity, filter'
      })

      app.dataset.arriving = 'true'
      return { app, cameras, content, transform }
    }

    const runShortReveal = async (): Promise<void> => {
      await coverDestination()
      const app = getApp()
      if (!app) {
        onRecover()
        return
      }

      if (arrivalState) {
        clearArrival(arrivalState)
        arrivalState = null
      }

      const curtain = root.querySelector<HTMLElement>('[data-cinematic-curtain]')
      if (curtain) {
        curtain.style.visibility = 'hidden'
      }
      const scene = root.querySelector<HTMLElement>('[data-cinematic-scene]')
      if (scene) {
        scene.style.visibility = 'hidden'
      }

      setPhase('skip-reveal')
      interruptRequested.current = false
      const panel = app.querySelector<HTMLElement>('.route-content__panel')
      if (panel) {
        panel.style.opacity = '0'
        panel.style.transform = 'translate3d(0, 18px, 0)'
        panel.style.filter = 'blur(8px)'
        panel.style.willChange = 'transform, opacity, filter'

        await play([
          [
            panel,
            { opacity: 1, y: 0, filter: 'blur(0px)' },
            { duration: SKIP_REVEAL_DURATION, ease: EASE_OUT },
          ],
        ])

        panel.style.opacity = '1'
        panel.style.transform = 'none'
        panel.style.filter = 'none'
        panel.style.willChange = 'auto'
      }

      if (!cancelled) {
        onComplete()
      }
    }

    const runArrival = async (): Promise<boolean> => {
      if (!arrivalState) {
        return false
      }

      setPhase('arrival')
      const pulledBack = await play([
        [
          arrivalState.cameras,
          {
            transform: [
              arrivalState.transform,
              'translate3d(0px, 0px, 0px) scale(1)',
            ],
          },
          { duration: ARRIVAL_DURATION, ease: EASE_OUT },
        ],
      ])

      if (!pulledBack) {
        return false
      }

      arrivalState.cameras.forEach((camera) => {
        camera.style.transform = 'none'
        camera.style.willChange = 'auto'
      })

      setPhase('content-reveal')
      const revealSequence: AnimationSequence = []
      arrivalState.content.forEach((element, index) => {
        revealSequence.push([
          element,
          { opacity: 1, y: 0, filter: 'blur(0px)' },
          {
            at: Math.min(index, 3) * 0.08,
            duration: CONTENT_DURATION,
            ease: EASE_OUT,
          },
        ])
      })

      if (revealSequence.length > 0 && !(await play(revealSequence))) {
        return false
      }

      clearArrival(arrivalState)
      arrivalState = null
      return true
    }

    const runGameplay = async (): Promise<boolean> => {
      const icon = root.querySelector<HTMLElement>('[data-gameplay-icon]')
      if (!icon) {
        return false
      }

      const width = window.innerWidth
      const height = window.innerHeight
      const direction = intent.direction === 'forward' ? 1 : -1
      const startX = direction === 1 ? -width * 0.2 : width * 1.2
      const endX = direction === 1 ? width * 1.2 : -width * 0.2
      icon.style.visibility = 'visible'

      if (intent.mode === 'cube') {
        return play([
          [
            icon,
            {
              x: [startX, width * 0.32, width * 0.53, width * 0.72, endX],
              y: [0, 0, -Math.min(height * 0.26, 220), 0, 0],
              rotate: [
                0,
                0,
                direction * 180,
                direction * 360,
                direction * 360,
              ],
              scaleX: [1, 0.92, 1, 1.08, 1],
              scaleY: [1, 1.08, 1, 0.92, 1],
            },
            {
              duration: GAMEPLAY_DURATION,
              ease: 'linear',
              times: [0, 0.28, 0.5, 0.72, 1],
            },
          ],
        ])
      }

      if (intent.mode === 'ship') {
        return play([
          [
            icon,
            {
              x: [startX, (startX + endX) / 2, endX],
              y: [height * 0.2, 0, -height * 0.2],
              rotate: [-direction * 12, -direction * 25, -direction * 12],
            },
            {
              duration: GAMEPLAY_DURATION,
              ease: 'easeInOut',
              times: [0, 0.5, 1],
            },
          ],
        ])
      }

      const waveY = [
        -height * 0.16,
        height * 0.24,
        -height * 0.16,
        height * 0.24,
        -height * 0.16,
      ]
      if (direction === -1) {
        waveY.reverse()
      }
      const waveX = [0, 0.25, 0.5, 0.75, 1].map(
        (progress) => startX + (endX - startX) * progress,
      )

      return play([
        [
          icon,
          {
            x: waveX,
            y: waveY,
            rotate: waveY.map((_, index) => {
              if (index === waveY.length - 1) {
                return direction === 1 ? -43 : 223
              }
              const movingDown = waveY[index + 1] > waveY[index]
              return movingDown
                ? direction === 1
                  ? 43
                  : 137
                : direction === 1
                  ? -43
                  : 223
            }),
          },
          {
            duration: GAMEPLAY_DURATION,
            ease: 'linear',
            times: [0, 0.25, 0.5, 0.75, 1],
          },
        ],
        [
          '[data-wave-trail]',
          { strokeDashoffset: [1, 0] },
          { at: 0, duration: GAMEPLAY_DURATION, ease: 'linear' },
        ],
      ])
    }

    const run = async (): Promise<void> => {
      try {
        if (skipTransition) {
          await runShortReveal()
          return
        }

        const curtain = root.querySelector<HTMLElement>(
          '[data-cinematic-curtain]',
        )
        const icon = root.querySelector<HTMLElement>('[data-cinematic-icon]')
        const scene = root.querySelector<HTMLElement>('[data-cinematic-scene]')
        if (!curtain || !icon || !scene) {
          onRecover()
          return
        }

        curtain.style.clipPath = clips.start
        setPhase('cover')
        const entered = await play([
          [
            curtain,
            { clipPath: [clips.start, clips.covered] },
            { duration: COVER_DURATION, ease: CURTAIN_EASE },
          ],
        ])
        if (!entered) {
          curtain.style.clipPath = clips.covered
          await runShortReveal()
          return
        }

        await coverDestination()
        scene.style.visibility = 'visible'

        setPhase('hold')
        const held = await play([
          [
            icon,
            {
              opacity: [0, 1, 1, 0],
              scale: [0.82, 1, 1, 0.92],
            },
            {
              duration: ICON_DURATION,
              ease: EASE_OUT,
              times: [0, 0.23, 0.82, 1],
            },
          ],
        ])
        if (!held) {
          await runShortReveal()
          return
        }

        setPhase('reveal')
        const revealed = await play([
          [
            curtain,
            { clipPath: [clips.covered, clips.end] },
            { duration: REVEAL_DURATION, ease: CURTAIN_EASE },
          ],
        ])
        if (!revealed) {
          await runShortReveal()
          return
        }

        curtain.style.visibility = 'hidden'
        setPhase('gameplay')
        if (!(await runGameplay())) {
          await runShortReveal()
          return
        }

        curtain.style.clipPath = clips.start
        curtain.style.visibility = 'visible'
        icon.style.visibility = 'hidden'
        setPhase('destination-cover')
        const destinationCovered = await play([
          [
            curtain,
            { clipPath: [clips.start, clips.covered] },
            { duration: COVER_DURATION, ease: CURTAIN_EASE },
          ],
        ])
        if (!destinationCovered) {
          await runShortReveal()
          return
        }

        arrivalState = prepareArrival()
        if (!arrivalState) {
          onRecover()
          return
        }
        scene.style.visibility = 'hidden'

        setPhase('destination-reveal')
        const destinationRevealed = await play([
          [
            curtain,
            { clipPath: [clips.covered, clips.end] },
            { duration: REVEAL_DURATION, ease: CURTAIN_EASE },
          ],
        ])
        if (!destinationRevealed) {
          await runShortReveal()
          return
        }

        curtain.style.visibility = 'hidden'
        if (!(await runArrival())) {
          await runShortReveal()
          return
        }

        if (!cancelled) {
          onComplete()
        }
      } catch {
        if (arrivalState) {
          clearArrival(arrivalState)
        }
        if (!cancelled) {
          onRecover()
        }
      }
    }

    void run()

    return () => {
      cancelled = true
      activeAnimation.current?.stop()
      if (arrivalState) {
        clearArrival(arrivalState)
      }
    }
  }, [
    animate,
    clips,
    intent.direction,
    intent.mode,
    onComplete,
    onCovered,
    onRecover,
    scope,
    skipTransition,
  ])

  return (
    <div
      aria-hidden="true"
      className="cinematic-transition"
      data-cinematic-direction={intent.direction}
      data-cinematic-mode={intent.mode}
      data-cinematic-phase={phase}
      ref={scope}
    >
      {!skipTransition && (
        <>
          <div className="cinematic-transition__scene" data-cinematic-scene>
            <SceneBackdrop />
            {intent.mode === 'cube' && <SceneGround />}
            <ModeObstacles mode={intent.mode} />
            <img
              alt=""
              className={`cinematic-character cinematic-character--${intent.mode}`}
              data-gameplay-icon
              src={characterAssets[intent.mode]}
            />
          </div>

          <div className="cinematic-curtain" data-cinematic-curtain>
            <img
              alt=""
              className={`cinematic-curtain__icon cinematic-curtain__icon--${intent.mode}`}
              data-cinematic-icon
              src={characterAssets[intent.mode]}
            />
          </div>
        </>
      )}
    </div>
  )
})

CinematicTransition.displayName = 'CinematicTransition'
