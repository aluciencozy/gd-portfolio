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
const SKIP_TRANSITIONS_KEY = 'gd-portfolio-skip-transitions'

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

function getInitialSkipPreference(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    return window.localStorage.getItem(SKIP_TRANSITIONS_KEY) === 'true'
  } catch {
    return false
  }
}

export default function App(): ReactElement {
  const initialScene = useRef<SceneId>(getInitialScene()).current
  const [openingEnabled] = useState(() => shouldPlayOpening(initialScene))
  const [displayScene, setDisplayScene] = useState<SceneId>(initialScene)
  const [skipTransitions, setSkipTransitions] = useState(
    getInitialSkipPreference,
  )
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
  } = useSceneNavigator(initialScene)
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
    onInterrupt: isTransitioning ? finishCurrentTransition : undefined,
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
    try {
      window.localStorage.setItem(
        SKIP_TRANSITIONS_KEY,
        skipTransitions ? 'true' : 'false',
      )
    } catch {
      // The in-memory preference still works when storage is unavailable.
    }
  }, [skipTransitions])

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

  useEffect(() => {
    if (!activeTransition) {
      return
    }

    const timeout = window.setTimeout(() => {
      recover()
    }, 10_000)

    return () => window.clearTimeout(timeout)
  }, [activeTransition, recover])

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
    displayScene === 'hero' &&
    !hasNavigated &&
    !opening.isActive &&
    !isTransitioning

  return (
    <div
      className="app-shell"
      data-cinematic-active={isTransitioning ? 'true' : 'false'}
      data-cinematic-direction={activeTransition?.direction}
      data-cinematic-skip={
        isTransitioning && skipTransitions ? 'true' : 'false'
      }
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
        <RouteStage scene={displayScene} />
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
        <label
          className="skip-transitions-control"
          data-scene-scroll-exempt="true"
        >
          <input
            checked={skipTransitions}
            onChange={(event) => setSkipTransitions(event.target.checked)}
            type="checkbox"
          />
          <span>Skip transitions</span>
        </label>

        {showNavigationPrompt && (
          <p className="navigation-prompt" data-navigation-prompt>
            <span className="navigation-prompt__desktop">Scroll or use arrow keys</span>
            <span className="navigation-prompt__mobile">Swipe to explore</span>
          </p>
        )}
      </div>

      {activeTransition && (
        <CinematicTransition
          command={activeTransition}
          onComplete={completeTransition}
          onCovered={coverDestination}
          onRecover={recoverTransition}
          ref={cinematicRef}
          skipTransition={skipTransitions}
        />
      )}

      <span className="sr-only">Current section: {SCENE_IDS.indexOf(current) + 1} of {SCENE_IDS.length}</span>
    </div>
  )
}
