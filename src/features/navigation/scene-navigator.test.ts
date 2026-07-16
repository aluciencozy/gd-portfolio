import { describe, expect, it } from 'vitest'
import {
  createSceneNavigator,
  sceneHash,
  sceneIdFromHash,
} from './scene-navigator'

describe('scene navigator', () => {
  it('starts at Hero and creates a source-aware forward transition', () => {
    const navigator = createSceneNavigator()

    const command = navigator.transitionTo('about')

    expect(command).toMatchObject({
      from: 'hero',
      to: 'about',
      direction: 'forward',
      sourceMode: 'cube',
      destinationMode: 'ship',
      portalMode: 'ship',
    })
    expect(navigator.getSnapshot()).toMatchObject({
      current: 'hero',
      target: 'about',
      isTransitioning: true,
    })
  })

  it('ignores repeated requests while a transition is active', () => {
    const navigator = createSceneNavigator('about')

    expect(navigator.next()).not.toBeNull()
    expect(navigator.next()).toBeNull()
    expect(navigator.previous()).toBeNull()
  })

  it('uses the destination mode as the portal for reverse navigation', () => {
    const navigator = createSceneNavigator('projects')

    const command = navigator.previous()

    expect(command).toMatchObject({
      from: 'projects',
      to: 'about',
      direction: 'backward',
      sourceMode: 'ball',
      destinationMode: 'ship',
      portalMode: 'ship',
    })
  })

  it('completes and recovers to the requested destination', () => {
    const navigator = createSceneNavigator('contact')

    navigator.previous()
    navigator.complete()
    expect(navigator.getSnapshot()).toEqual({
      current: 'projects',
      target: null,
      isTransitioning: false,
    })

    navigator.previous()
    navigator.recover()
    expect(navigator.getSnapshot().current).toBe('about')
  })

  it('does not navigate beyond the scene sequence', () => {
    const navigator = createSceneNavigator('hero')

    expect(navigator.previous()).toBeNull()
    navigator.complete()
    expect(navigator.getSnapshot().current).toBe('hero')
  })

  it('parses and creates stable scene hashes', () => {
    expect(sceneIdFromHash('#projects')).toBe('projects')
    expect(sceneIdFromHash('contact')).toBe('contact')
    expect(sceneIdFromHash('#unknown')).toBeNull()
    expect(sceneHash('about')).toBe('#about')
  })
})
