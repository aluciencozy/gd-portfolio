import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import {
  createSceneNavigator,
  type SceneId,
  type SceneNavigator,
  type TransitionCommand,
} from './scene-navigator'

export interface UseSceneNavigatorResult {
  current: SceneId
  target: SceneId | null
  isTransitioning: boolean
  activeTransition: TransitionCommand | null
  transitionTo: (scene: SceneId) => boolean
  next: () => boolean
  previous: () => boolean
  complete: () => void
  recover: () => void
  skip: () => void
}

export function useSceneNavigator(
  initialScene: SceneId,
  animateTransitions = true,
): UseSceneNavigatorResult {
  const navigatorRef = useRef<SceneNavigator | null>(null)
  if (!navigatorRef.current) {
    navigatorRef.current = createSceneNavigator(initialScene)
  }

  const navigator = navigatorRef.current
  const snapshot = useSyncExternalStore(
    navigator.subscribe,
    navigator.getSnapshot,
    navigator.getSnapshot,
  )
  const [activeTransition, setActiveTransition] = useState<TransitionCommand | null>(
    null,
  )

  const begin = useCallback(
    (command: TransitionCommand | null, animate: boolean) => {
      if (!command) {
        return false
      }

      if (!animate) {
        navigator.complete()
        setActiveTransition(null)
        return true
      }

      setActiveTransition(command)
      return true
    },
    [navigator],
  )

  const transitionTo = useCallback(
    (scene: SceneId) =>
      begin(navigator.transitionTo(scene), animateTransitions),
    [animateTransitions, begin, navigator],
  )

  const next = useCallback(
    () => begin(navigator.next(), animateTransitions),
    [animateTransitions, begin, navigator],
  )
  const previous = useCallback(
    () => begin(navigator.previous(), animateTransitions),
    [animateTransitions, begin, navigator],
  )

  useEffect(() => {
    if (animateTransitions || !snapshot.isTransitioning) {
      return
    }

    navigator.complete()
    setActiveTransition(null)
  }, [animateTransitions, navigator, snapshot.isTransitioning])

  const complete = useCallback(() => {
    navigator.complete()
    setActiveTransition(null)
  }, [navigator])

  const recover = useCallback(() => {
    navigator.recover()
    setActiveTransition(null)
  }, [navigator])

  return {
    current: snapshot.current,
    target: snapshot.target,
    isTransitioning: snapshot.isTransitioning,
    activeTransition,
    transitionTo,
    next,
    previous,
    complete,
    recover,
    skip: complete,
  }
}
