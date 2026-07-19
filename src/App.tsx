import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from 'react'
import { CheckpointProgress } from './components/CheckpointProgress'
import {
  CinematicTransition,
  type CinematicTransitionHandle,
} from './components/CinematicTransition'
import { RestingCube, type CubeReaction } from './components/RestingCube'
import { RouteStage } from './components/RouteStage'
import {
  sceneHash,
  sceneIdFromHash,
  SCENE_IDS,
  type SceneId,
} from './features/navigation/scene-navigator'
import { useControlledSceneInput } from './features/navigation/use-controlled-scene-input'
import { useSceneNavigator } from './features/navigation/use-scene-navigator'
import { ENABLE_CINEMATIC_TRANSITIONS } from './features/navigation/transition-config'
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
  const [displayScene, setDisplayScene] = useState<SceneId>(initialScene)
  const [hasNavigated, setHasNavigated] = useState(false)
  const [cubeReaction, setCubeReaction] = useState<CubeReaction | null>(null)
  const reactionNonce = useRef(0)
  const cinematicRef = useRef<CinematicTransitionHandle>(null)
  const {
    activeTransition,
    complete,
    current,
    isTransitioning,
    next,
    previous,
    recover,
    transitionTo,
    target,
  } = useSceneNavigator(initialScene, ENABLE_CINEMATIC_TRANSITIONS)
  const opening = useOpeningSequence(openingEnabled)
  const shouldPushHistory = useRef(false)

  const startRequest = useCallback((request: () => boolean): boolean => {
    if (request()) {
      shouldPushHistory.current = true
      setHasNavigated(true)
      return true
    }

    return false
  }, [])

  const navigateTo = useCallback(
    (scene: SceneId) => startRequest(() => transitionTo(scene)),
    [startRequest, transitionTo],
  )
  const reactAtBoundary = useCallback(
    (direction: CubeReaction['direction']): void => {
      reactionNonce.current += 1
      setCubeReaction({ direction, nonce: reactionNonce.current })
    },
    [],
  )
  const navigateNext = useCallback(() => {
    if (!startRequest(next)) {
      reactAtBoundary('forward')
    }
  }, [next, reactAtBoundary, startRequest])
  const navigatePrevious = useCallback(() => {
    if (!startRequest(previous)) {
      reactAtBoundary('backward')
    }
  }, [previous, reactAtBoundary, startRequest])

  const finishCurrentTransition = useCallback(() => {
    cinematicRef.current?.finishCurrent()
  }, [])

  useControlledSceneInput({
    isTransitioning: isTransitioning || opening.isActive,
    onKeyboardSkip: isTransitioning ? finishCurrentTransition : undefined,
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
    if (isTransitioning) {
      return
    }

    if (shouldPushHistory.current) {
      window.history.pushState(null, '', sceneHash(current))
      shouldPushHistory.current = false
    } else if (window.location.hash !== sceneHash(current)) {
      window.history.replaceState(null, '', sceneHash(current))
    }
  }, [current, isTransitioning])

  useEffect(() => {
    const handlePopState = () => {
      const requestedScene = sceneIdFromHash(window.location.hash)

      if (
        !requestedScene ||
        requestedScene === current ||
        isTransitioning ||
        opening.isActive
      ) {
        window.history.replaceState(null, '', sceneHash(current))
        return
      }

      shouldPushHistory.current = false
      transitionTo(requestedScene)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [current, isTransitioning, opening.isActive, transitionTo])

  const coverDestination = useCallback(() => {
    if (activeTransition) {
      setDisplayScene(activeTransition.to)
    }
  }, [activeTransition])

  const completeTransition = useCallback(() => {
    if (activeTransition) {
      setDisplayScene(activeTransition.to)
    }
    complete()
  }, [activeTransition, complete])

  const recoverTransition = useCallback(() => {
    if (activeTransition) {
      setDisplayScene(activeTransition.to)
    }
    recover()
  }, [activeTransition, recover])

  const showNavigationPrompt =
    current === 'hero' &&
    (isTransitioning ? displayScene : current) === 'hero' &&
    !hasNavigated &&
    !opening.isActive &&
    !isTransitioning
  const sceneToRender = isTransitioning ? displayScene : current

  return (
    <div
      className="app-shell"
      data-cinematic-active={isTransitioning ? 'true' : 'false'}
      data-transitions-enabled={ENABLE_CINEMATIC_TRANSITIONS ? 'true' : 'false'}
      data-opening={opening.isActive ? 'true' : 'false'}
      data-opening-phase={opening.phase}
      ref={opening.scope}
    >
      <div
        className="opening-background-camera"
        data-opening-camera
        data-scene-camera
      >
        <SceneBackdrop />
        <SceneGround />
      </div>

      <CheckpointProgress
        animateTransitions={ENABLE_CINEMATIC_TRANSITIONS}
        aria-hidden={opening.isActive || undefined}
        data-opening-progress
        current={current}
        target={target}
        onNavigate={navigateTo}
      />

      <main
        aria-hidden={opening.isActive || isTransitioning || undefined}
        aria-live="polite"
        className="route-stage"
      >
        <RouteStage scene={sceneToRender} />
      </main>

      <div
        className="opening-cube-camera"
        data-opening-camera
        data-scene-camera
      >
        <RestingCube
          paused={opening.isActive || isTransitioning}
          reaction={cubeReaction}
        />
      </div>

      <div
        aria-hidden={opening.isActive || isTransitioning || undefined}
        className="navigation-utilities"
      >
        {showNavigationPrompt && (
          <p className="navigation-prompt" data-navigation-prompt>
            <span className="navigation-prompt__desktop">Scroll or use arrow keys</span>
            <span className="navigation-prompt__mobile">Swipe to explore</span>
          </p>
        )}
      </div>

      {ENABLE_CINEMATIC_TRANSITIONS && activeTransition && (
        <CinematicTransition
          command={activeTransition}
          onComplete={completeTransition}
          onCovered={coverDestination}
          onRecover={recoverTransition}
          ref={cinematicRef}
        />
      )}

      <span className="sr-only">Current section: {SCENE_IDS.indexOf(current) + 1} of {SCENE_IDS.length}</span>
    </div>
  )
}
