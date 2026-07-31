import { useEffect, useRef } from 'react'
import type { SceneId } from './scene-navigator'

interface ControlledSceneInputOptions {
  isLocked: boolean
  onNext: () => void
  onPrevious: () => void
  onScene: (scene: SceneId) => void
}

const TOUCH_THRESHOLD = 16
const NEXT_KEYS = new Set(['ArrowDown', 'ArrowRight', 'PageDown', ' ', 'Spacebar'])
const PREVIOUS_KEYS = new Set(['ArrowUp', 'ArrowLeft', 'PageUp'])

function getSceneScrollContainer(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) {
    return null
  }

  const container = target.closest('[data-scene-scroll-container="true"]')
  return container instanceof HTMLElement ? container : null
}

function canScroll(container: HTMLElement, direction: number): boolean {
  const maxScrollTop = container.scrollHeight - container.clientHeight

  if (maxScrollTop <= 0) {
    return false
  }

  return direction > 0 ? container.scrollTop < maxScrollTop : container.scrollTop > 0
}

function getScrollDirection(key: string): number | null {
  if (key === 'ArrowDown' || key === 'PageDown' || key === ' ' || key === 'Spacebar') {
    return 1
  }

  if (key === 'ArrowUp' || key === 'PageUp') {
    return -1
  }

  return null
}

function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.tagName === 'INPUT' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'TEXTAREA' ||
      Boolean(target.closest('button, a, [data-keyboard-native="true"]')))
  )
}

export function useControlledSceneInput({
  isLocked,
  onNext,
  onPrevious,
  onScene,
}: ControlledSceneInputOptions): void {
  const wheelReady = useRef(true)
  const wheelResetTimeout = useRef<number | null>(null)

  useEffect(() => {
    let touchStartY: number | null = null
    let touchPreviousY: number | null = null
    let touchScrollContainer: HTMLElement | null = null
    let touchScrollBoundary = false

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) {
        return
      }

      const scrollContainer = getSceneScrollContainer(event.target)
      if (scrollContainer !== null && canScroll(scrollContainer, event.deltaY)) {
        return
      }

      event.preventDefault()
      if (wheelResetTimeout.current !== null) {
        window.clearTimeout(wheelResetTimeout.current)
      }
      wheelResetTimeout.current = window.setTimeout(() => {
        wheelReady.current = true
      }, 180)

      if (!wheelReady.current) {
        return
      }

      wheelReady.current = false
      if (isLocked) {
        return
      }

      if (event.deltaY > 0) {
        onNext()
      } else {
        onPrevious()
      }
    }

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      touchStartY = touch?.clientY ?? null
      touchPreviousY = touchStartY
      touchScrollContainer = getSceneScrollContainer(event.target)
      touchScrollBoundary = false
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (touchScrollContainer === null) {
        event.preventDefault()
        return
      }

      const touch = event.touches[0]
      if (touchPreviousY === null || touch === undefined) {
        return
      }

      event.preventDefault()
      const scrollDelta = touchPreviousY - touch.clientY
      const maxScrollTop = Math.max(
        0,
        touchScrollContainer.scrollHeight - touchScrollContainer.clientHeight,
      )
      const desiredScrollTop = touchScrollContainer.scrollTop + scrollDelta
      const nextScrollTop = Math.min(maxScrollTop, Math.max(0, desiredScrollTop))

      touchScrollContainer.scrollTop = nextScrollTop
      touchScrollBoundary ||= nextScrollTop !== desiredScrollTop
      touchPreviousY = touch.clientY
    }

    const handleTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0]
      const touchEndY = touch?.clientY
      const deltaY = touchStartY !== null && touchEndY !== undefined ? touchEndY - touchStartY : 0
      const isSwipe = Math.abs(deltaY) >= TOUCH_THRESHOLD
      const shouldNavigate = touchScrollContainer === null || touchScrollBoundary

      if (shouldNavigate && isSwipe) {
        event.preventDefault()
        if (!isLocked && deltaY < 0) {
          onNext()
        } else if (!isLocked) {
          onPrevious()
        }
      }

      touchStartY = null
      touchPreviousY = null
      touchScrollContainer = null
      touchScrollBoundary = false
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const scrollContainer = getSceneScrollContainer(event.target)

      if (
        event.defaultPrevented ||
        event.repeat ||
        isEditableTarget(event.target)
      ) {
        return
      }

      const isNavigationKey =
        NEXT_KEYS.has(event.key) ||
        PREVIOUS_KEYS.has(event.key) ||
        event.key === 'Home' ||
        event.key === 'End'

      if (scrollContainer !== null) {
        const scrollDirection = getScrollDirection(event.key)
        if (scrollDirection !== null && canScroll(scrollContainer, scrollDirection)) {
          return
        }
      }

      if (isLocked && isNavigationKey) {
        event.preventDefault()
        return
      }

      if (NEXT_KEYS.has(event.key)) {
        event.preventDefault()
        onNext()
      } else if (PREVIOUS_KEYS.has(event.key)) {
        event.preventDefault()
        onPrevious()
      } else if (event.key === 'Home') {
        event.preventDefault()
        onScene('hero')
      } else if (event.key === 'End') {
        event.preventDefault()
        onScene('contact')
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLocked, onNext, onPrevious, onScene])
}
