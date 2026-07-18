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
import { SceneBackdrop } from './features/scene/SceneBackdrop'

function getInitialScene(): SceneId {
  if (typeof window === 'undefined') {
    return 'hero'
  }

  return sceneIdFromHash(window.location.hash) ?? 'hero'
}

export default function App(): ReactElement {
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
  } = useSceneNavigator(getInitialScene())
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
    isTransitioning,
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

      if (!requestedScene || requestedScene === current || isTransitioning) {
        window.history.replaceState(null, '', sceneHash(current))
        return
      }

      shouldPushHistory.current = false
      transitionTo(requestedScene)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [current, isTransitioning, transitionTo])

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
    <div className="app-shell">
      <SceneBackdrop />
      <div aria-hidden="true" className="scene-overlay" />

      <CheckpointProgress
        current={current}
        target={target}
        onNavigate={navigateTo}
      />

      <main className="route-stage" aria-live="polite">
        <RouteStage
          current={current}
          onComplete={complete}
          onRecover={recover}
          transition={activeTransition}
        />
      </main>

      <div className="cube-anchor">
        <img alt="" className="cube-anchor__image" src={characterAssets.cube} />
      </div>

      <span className="sr-only">Current section: {SCENE_IDS.indexOf(current) + 1} of {SCENE_IDS.length}</span>
    </div>
  )
}
