import { useCallback, useEffect, useRef, type ReactElement } from 'react'
import { CheckpointProgress } from './components/CheckpointProgress'
import { RouteStage } from './components/RouteStage'
import { characterAssets } from './assets/asset-catalog'
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

export default function App(): ReactElement {
  const initialScene = useRef<SceneId>(getInitialScene()).current
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
  const opening = useOpeningSequence(initialScene === 'hero')
  const shouldPushHistory = useRef(false)

  const startRequest = useCallback((request: () => boolean): void => {
    if (request()) {
      shouldPushHistory.current = true
    }
  }, [])

  const navigateTo = useCallback(
    (scene: SceneId) => startRequest(() => transitionTo(scene)),
    [startRequest, transitionTo],
  )
  const navigateNext = useCallback(
    () => startRequest(next),
    [next, startRequest],
  )
  const navigatePrevious = useCallback(
    () => startRequest(previous),
    [previous, startRequest],
  )

  useControlledSceneInput({
    isTransitioning: isTransitioning || opening.isActive,
    onNext: navigateNext,
    onPrevious: navigatePrevious,
    onScene: navigateTo,
  })

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
    }, 3200)

    return () => window.clearTimeout(timeout)
  }, [activeTransition, recover])

  return (
    <div
      className="app-shell"
      data-opening={opening.isActive ? 'true' : 'false'}
      data-opening-phase={opening.phase}
      ref={opening.scope}
    >
      <div className="opening-background-camera" data-opening-camera>
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
        aria-hidden={opening.isActive || undefined}
        aria-live="polite"
        className="route-stage"
      >
        <RouteStage
          current={current}
          onComplete={complete}
          onRecover={recover}
          transition={activeTransition}
        />
      </main>

      <div className="opening-cube-camera" data-opening-camera>
        <div className="cube-anchor" data-opening-cube>
          <img alt="" className="cube-anchor__image" src={characterAssets.cube} />
        </div>
      </div>

      <span className="sr-only">Current section: {SCENE_IDS.indexOf(current) + 1} of {SCENE_IDS.length}</span>
    </div>
  )
}
