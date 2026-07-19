export const SCENE_IDS = ['hero', 'about', 'projects', 'contact'] as const

export type SceneId = (typeof SCENE_IDS)[number]
export type NavigationDirection = 'forward' | 'backward'

export interface SceneNavigatorSnapshot {
  current: SceneId
}

export interface SceneNavigator {
  getSnapshot(): SceneNavigatorSnapshot
  subscribe(listener: () => void): () => void
  navigateTo(scene: SceneId): boolean
  next(): boolean
  previous(): boolean
}

export function createSceneNavigator(initialScene: SceneId = 'hero'): SceneNavigator {
  const listeners = new Set<() => void>()
  let snapshot: SceneNavigatorSnapshot = {
    current: initialScene,
  }

  const notify = () => {
    listeners.forEach((listener) => listener())
  }

  const navigateTo = (destination: SceneId): boolean => {
    if (destination === snapshot.current) {
      return false
    }

    snapshot = { current: destination }
    notify()
    return true
  }

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    navigateTo,
    next: () => {
      const currentIndex = SCENE_IDS.indexOf(snapshot.current)
      const nextScene = SCENE_IDS[currentIndex + 1]
      return nextScene ? navigateTo(nextScene) : false
    },
    previous: () => {
      const currentIndex = SCENE_IDS.indexOf(snapshot.current)
      const previousScene = SCENE_IDS[currentIndex - 1]
      return previousScene ? navigateTo(previousScene) : false
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
