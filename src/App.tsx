import { useCallback, useEffect, useRef, type ReactElement } from 'react'
import { NavigationHud, SceneStepControls } from './components/NavigationHud'
import { PortfolioSection } from './components/PortfolioSection'
import { sceneHash, sceneIdFromHash, SCENE_IDS, type SceneId } from './features/navigation/scene-navigator'
import { useControlledSceneInput } from './features/navigation/use-controlled-scene-input'
import { useSceneNavigator } from './features/navigation/use-scene-navigator'
import { SceneBackdrop } from './features/scene/SceneBackdrop'
import { TransitionScene } from './features/scene/TransitionScene'

function getInitialScene(): SceneId {
  if (typeof window === 'undefined') {
    return 'hero'
  }

  return sceneIdFromHash(window.location.hash) ?? 'hero'
}

export default function App(): ReactElement {
  const motionEnabled =
    typeof window === 'undefined' ||
    !new URLSearchParams(window.location.search).has('visualTest')
  const {
    activeTransition,
    complete,
    current,
    isTransitioning,
    next,
    previous,
    recover,
    skip,
    transitionTo,
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
    }, 2600)

    return () => window.clearTimeout(timeout)
  }, [activeTransition, recover])

  return (
    <div className="relative isolate h-[100svh] overflow-hidden bg-slate-950 text-white selection:bg-cyan-300 selection:text-slate-950">
      <SceneBackdrop
        direction={activeTransition?.direction}
        isTransitioning={isTransitioning}
        motionEnabled={motionEnabled}
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-slate-950/45" />

      <NavigationHud
        current={current}
        isTransitioning={isTransitioning}
        onNavigate={navigateTo}
      />

      <main className="relative z-10 h-full">
        {SCENE_IDS.map((scene, index) => (
          <PortfolioSection
            id={scene}
            isActive={current === scene}
            key={scene}
            mode={(['cube', 'ship', 'ball', 'wave'] as const)[index]}
            onNavigate={navigateTo}
            onNext={navigateNext}
            onPrevious={navigatePrevious}
            motionEnabled={motionEnabled}
          />
        ))}
      </main>

      <SceneStepControls
        current={current}
        isTransitioning={isTransitioning}
        onNext={navigateNext}
        onPrevious={navigatePrevious}
      />

      {activeTransition && (
        <TransitionScene
          key={`${activeTransition.from}-${activeTransition.to}`}
          onComplete={complete}
          onRecover={recover}
          onSkip={skip}
          transition={activeTransition}
        />
      )}
    </div>
  )
}
