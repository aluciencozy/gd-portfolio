import { useEffect } from 'react'
import type { SceneId } from './scene-navigator'

interface ControlledSceneInputOptions {
  isTransitioning: boolean
  onNext: () => void
  onPrevious: () => void
  onScene: (scene: SceneId) => void
}

const TOUCH_THRESHOLD = 16

function isSceneScrollExempt(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest('[data-scene-scroll-exempt="true"]'))
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
  isTransitioning,
  onNext,
  onPrevious,
  onScene,
}: ControlledSceneInputOptions): void {
  useEffect(() => {
    let touchStartY: number | null = null
    let touchStartExempt = false

    const handleWheel = (event: WheelEvent) => {
      if (isSceneScrollExempt(event.target) || event.deltaY === 0) {
        return
      }

      event.preventDefault()
      if (isTransitioning) {
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
      touchStartExempt = isSceneScrollExempt(event.target)
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!touchStartExempt) {
        event.preventDefault()
      }
    }

    const handleTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0]
      const touchEndY = touch?.clientY
      const deltaY = touchStartY !== null && touchEndY !== undefined ? touchEndY - touchStartY : 0
      const isSwipe = Math.abs(deltaY) >= TOUCH_THRESHOLD

      if (!touchStartExempt && isSwipe) {
        event.preventDefault()
        if (!isTransitioning) {
          if (deltaY < 0) {
            onNext()
          } else {
            onPrevious()
          }
        }
      }

      touchStartY = null
      touchStartExempt = false
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        isSceneScrollExempt(event.target) ||
        isEditableTarget(event.target) ||
        isTransitioning
      ) {
        return
      }

      const nextKeys = new Set(['ArrowDown', 'ArrowRight', 'PageDown', ' ', 'Spacebar'])
      const previousKeys = new Set(['ArrowUp', 'ArrowLeft', 'PageUp'])

      if (nextKeys.has(event.key)) {
        event.preventDefault()
        onNext()
      } else if (previousKeys.has(event.key)) {
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
  }, [isTransitioning, onNext, onPrevious, onScene])
}
