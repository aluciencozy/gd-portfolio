import { useCallback, useRef, useSyncExternalStore } from 'react'
import {
  createSceneNavigator,
  type SceneId,
  type SceneNavigator,
} from './scene-navigator'

export interface UseSceneNavigatorResult {
  current: SceneId
  navigateTo: (scene: SceneId) => boolean
  next: () => boolean
  previous: () => boolean
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

  const navigateTo = useCallback(
    (scene: SceneId) => navigator.navigateTo(scene),
    [navigator],
  )
  const next = useCallback(() => navigator.next(), [navigator])
  const previous = useCallback(() => navigator.previous(), [navigator])

  return {
    current: snapshot.current,
    navigateTo,
    next,
    previous,
  }
}
