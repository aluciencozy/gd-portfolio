export const SCENE_IDS = ['hero', 'about', 'projects', 'contact'] as const

export type SceneId = (typeof SCENE_IDS)[number]
export type NavigationDirection = 'forward' | 'backward'

export interface TransitionCommand {
  from: SceneId
  to: SceneId
  direction: NavigationDirection
}

export interface SceneNavigatorSnapshot {
  current: SceneId
  target: SceneId | null
  isTransitioning: boolean
}

export interface SceneNavigator {
  getSnapshot(): SceneNavigatorSnapshot
  subscribe(listener: () => void): () => void
  transitionTo(scene: SceneId): TransitionCommand | null
  next(): TransitionCommand | null
  previous(): TransitionCommand | null
  complete(): void
  recover(): void
}

export function createSceneNavigator(initialScene: SceneId = 'hero'): SceneNavigator {
  const listeners = new Set<() => void>()
  let snapshot: SceneNavigatorSnapshot = {
    current: initialScene,
    target: null,
    isTransitioning: false,
  }

  const notify = () => {
    listeners.forEach((listener) => listener())
  }

  const setSnapshot = (nextSnapshot: SceneNavigatorSnapshot) => {
    snapshot = nextSnapshot
    notify()
  }

  const request = (destination: SceneId): TransitionCommand | null => {
    if (snapshot.isTransitioning || destination === snapshot.current) {
      return null
    }

    const currentIndex = SCENE_IDS.indexOf(snapshot.current)
    const destinationIndex = SCENE_IDS.indexOf(destination)
    const direction = destinationIndex > currentIndex ? 'forward' : 'backward'
    const command: TransitionCommand = {
      from: snapshot.current,
      to: destination,
      direction,
    }

    setSnapshot({
      current: snapshot.current,
      target: destination,
      isTransitioning: true,
    })

    return command
  }

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    transitionTo: request,
    next: () => {
      const currentIndex = SCENE_IDS.indexOf(snapshot.current)
      const nextScene = SCENE_IDS[currentIndex + 1]
      return nextScene ? request(nextScene) : null
    },
    previous: () => {
      const currentIndex = SCENE_IDS.indexOf(snapshot.current)
      const previousScene = SCENE_IDS[currentIndex - 1]
      return previousScene ? request(previousScene) : null
    },
    complete: () => {
      if (!snapshot.isTransitioning || !snapshot.target) {
        return
      }

      setSnapshot({
        current: snapshot.target,
        target: null,
        isTransitioning: false,
      })
    },
    recover: () => {
      if (!snapshot.isTransitioning || !snapshot.target) {
        return
      }

      setSnapshot({
        current: snapshot.target,
        target: null,
        isTransitioning: false,
      })
    },
  }
}

export function sceneIdFromHash(hash: string): SceneId | null {
  const candidate = hash.replace(/^#/, '')
  return SCENE_IDS.includes(candidate as SceneId) ? (candidate as SceneId) : null
}

export function sceneHash(scene: SceneId): string {
  return `#${scene}`
}
