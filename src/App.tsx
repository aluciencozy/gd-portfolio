import { motion } from 'motion/react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from 'react'
import { CheckpointProgress } from './components/CheckpointProgress'
import { RestingCube, type CubeReaction } from './components/RestingCube'
import { RouteStage } from './components/RouteStage'
import {
  sceneHash,
  sceneIdFromHash,
  SCENE_IDS,
  type NavigationDirection,
  type SceneId,
} from './features/navigation/scene-navigator'
import { useControlledSceneInput } from './features/navigation/use-controlled-scene-input'
import { useSceneNavigator } from './features/navigation/use-scene-navigator'
import { useOpeningSequence } from './features/opening/use-opening-sequence'
import { SceneBackdrop } from './features/scene/SceneBackdrop'
import { SceneGround } from './features/scene/SceneGround'

function getInitialScene(): SceneId {
  if (typeof window === 'undefined') {
    return 'hero'
  }

  return sceneIdFromHash(window.location.hash) ?? 'hero'
}

const OPENING_PLAYED_KEY = 'gd-portfolio-opening-played'

function shouldPlayOpening(scene: SceneId): boolean {
  if (scene !== 'hero' || typeof window === 'undefined') {
    return false
  }

  try {
    return window.sessionStorage.getItem(OPENING_PLAYED_KEY) !== 'true'
  } catch {
    return true
  }
}

export default function App(): ReactElement {
  const initialScene = useRef<SceneId>(getInitialScene()).current
  const [openingEnabled] = useState(() => shouldPlayOpening(initialScene))
  const [hasNavigated, setHasNavigated] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(!openingEnabled)
  const [transitionDirection, setTransitionDirection] =
    useState<NavigationDirection>('forward')
  const [cubeReaction, setCubeReaction] = useState<CubeReaction | null>(null)
  const [cubeComment, setCubeComment] = useState<string | null>(null)
  const reactionNonce = useRef(0)
  const { current, navigateTo: navigateScene } =
    useSceneNavigator(initialScene)
  const opening = useOpeningSequence(openingEnabled)
  const shouldPushHistory = useRef(false)

  const reactAtBoundary = useCallback(
    (direction: CubeReaction['direction']): void => {
      reactionNonce.current += 1
      setCubeReaction({ direction, nonce: reactionNonce.current })
    },
    [],
  )

  const requestScene = useCallback(
    (scene: SceneId, pushHistory = true): boolean => {
      if (opening.isActive || isTransitioning || scene === current) {
        return false
      }

      const direction =
        SCENE_IDS.indexOf(scene) > SCENE_IDS.indexOf(current)
          ? 'forward'
          : 'backward'

      shouldPushHistory.current = pushHistory
      setHasNavigated(true)
      setIsTransitioning(true)
      setTransitionDirection(direction)
      setCubeComment(null)
      reactionNonce.current += 1
      setCubeReaction({ direction, nonce: reactionNonce.current })
      return navigateScene(scene)
    },
    [current, isTransitioning, navigateScene, opening.isActive],
  )

  const navigateTo = useCallback(
    (scene: SceneId) => {
      requestScene(scene)
    },
    [requestScene],
  )
  const navigateNext = useCallback(() => {
    const destination = SCENE_IDS[SCENE_IDS.indexOf(current) + 1]
    if (destination) {
      requestScene(destination)
    } else {
      reactAtBoundary('forward')
    }
  }, [current, reactAtBoundary, requestScene])
  const navigatePrevious = useCallback(() => {
    const destination = SCENE_IDS[SCENE_IDS.indexOf(current) - 1]
    if (destination) {
      requestScene(destination)
    } else {
      reactAtBoundary('backward')
    }
  }, [current, reactAtBoundary, requestScene])

  useControlledSceneInput({
    isLocked: opening.isActive || isTransitioning,
    onNext: navigateNext,
    onPrevious: navigatePrevious,
    onScene: navigateTo,
  })

  useEffect(() => {
    if (!openingEnabled || opening.phase !== 'complete') {
      return
    }

    try {
      window.sessionStorage.setItem(OPENING_PLAYED_KEY, 'true')
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }
  }, [opening.phase, openingEnabled])

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const previousHtmlOverflow = html.style.overflow
    const previousBodyOverflow = body.style.overflow

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    return () => {
      html.style.overflow = previousHtmlOverflow
      body.style.overflow = previousBodyOverflow
    }
  }, [])

  useEffect(() => {
    if (shouldPushHistory.current) {
      window.history.pushState(null, '', sceneHash(current))
      shouldPushHistory.current = false
    } else if (window.location.hash !== sceneHash(current)) {
      window.history.replaceState(null, '', sceneHash(current))
    }
  }, [current])

  useEffect(() => {
    const handlePopState = () => {
      const requestedScene = sceneIdFromHash(window.location.hash)

      if (
        !requestedScene ||
        requestedScene === current ||
        opening.isActive ||
        isTransitioning
      ) {
        window.history.replaceState(null, '', sceneHash(current))
        return
      }

      requestScene(requestedScene, false)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [current, isTransitioning, opening.isActive, requestScene])

  const showNavigationPrompt =
    current === 'hero' &&
    !hasNavigated &&
    !opening.isActive

  return (
    <div
      className="app-shell"
      data-opening={opening.isActive ? 'true' : 'false'}
      data-opening-phase={opening.phase}
      data-transitioning={isTransitioning ? 'true' : 'false'}
      ref={opening.scope}
    >
      <div
        className="opening-background-camera"
        data-opening-camera
        data-scene-camera
      >
        <SceneBackdrop scene={current} />
        <SceneGround scene={current} />
      </div>

      <CheckpointProgress
        aria-hidden={opening.isActive || undefined}
        data-opening-progress
        current={current}
        isTransitioning={isTransitioning}
        onNavigate={navigateTo}
      />

      <main
        aria-hidden={opening.isActive || undefined}
        aria-live="polite"
        className="route-stage"
      >
        <RouteStage
          direction={transitionDirection}
          onCubeComment={setCubeComment}
          onNavigate={navigateTo}
          onTransitionComplete={() => setIsTransitioning(false)}
          scene={current}
        />
      </main>

      <div
        className="opening-cube-camera"
        data-opening-camera
        data-scene-camera
      >
        <RestingCube
          comment={cubeComment}
          paused={opening.isActive}
          reaction={cubeReaction}
        />
      </div>

      <div
        aria-hidden={opening.isActive || undefined}
        className="navigation-utilities"
      >
        {showNavigationPrompt && (
          <motion.p
            animate={{ opacity: [0.48, 0.94, 0.48], y: [0, -4, 0] }}
            className="navigation-prompt"
            data-navigation-prompt
            transition={{
              duration: 1.8,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          >
            <span className="navigation-prompt__desktop">Scroll or use arrow keys</span>
            <span className="navigation-prompt__mobile">Swipe to explore</span>
          </motion.p>
        )}
      </div>

      <span className="sr-only">Current section: {SCENE_IDS.indexOf(current) + 1} of {SCENE_IDS.length}</span>
    </div>
  )
}
