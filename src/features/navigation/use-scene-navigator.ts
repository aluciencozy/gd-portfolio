import { useCallback, useRef, useState, useSyncExternalStore } from 'react'
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

export function useSceneNavigator(initialScene: SceneId): UseSceneNavigatorResult {
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
    (command: TransitionCommand | null) => {
      if (!command) {
        return false
      }

      setActiveTransition(command)
      return true
    },
    [],
  )

  const transitionTo = useCallback(
    (scene: SceneId) => begin(navigator.transitionTo(scene)),
    [begin, navigator],
  )

  const next = useCallback(() => begin(navigator.next()), [begin, navigator])
  const previous = useCallback(
    () => begin(navigator.previous()),
    [begin, navigator],
  )

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
