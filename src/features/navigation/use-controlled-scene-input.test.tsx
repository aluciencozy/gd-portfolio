import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useControlledSceneInput } from './use-controlled-scene-input'

function InputHarness({
  onNext,
  onPrevious,
  onScene,
  isTransitioning = false,
}: {
  onNext: () => void
  onPrevious: () => void
  onScene: (scene: 'hero' | 'about' | 'projects' | 'contact') => void
  isTransitioning?: boolean
}): ReactElement {
  useControlledSceneInput({
    isTransitioning,
    onNext,
    onPrevious,
    onScene,
  })

  return (
    <div data-testid="page">
      <div data-scene-scroll-exempt="true" data-testid="gallery" tabIndex={0}>
        Gallery
      </div>
    </div>
  )
}

describe('controlled scene input', () => {
  it('maps keyboard commands to the navigator seam', () => {
    const onNext = vi.fn()
    const onPrevious = vi.fn()
    const onScene = vi.fn()
    render(<InputHarness onNext={onNext} onPrevious={onPrevious} onScene={onScene} />)

    fireEvent.keyDown(window, { key: 'ArrowDown' })
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    fireEvent.keyDown(window, { key: 'End' })

    expect(onNext).toHaveBeenCalledOnce()
    expect(onPrevious).toHaveBeenCalledOnce()
    expect(onScene).toHaveBeenCalledWith('contact')
  })

  it('turns wheel and touch movement into one request while isolating the gallery', () => {
    const onNext = vi.fn()
    const onPrevious = vi.fn()
    const onScene = vi.fn()
    render(<InputHarness onNext={onNext} onPrevious={onPrevious} onScene={onScene} />)
    const page = screen.getByTestId('page')
    const gallery = screen.getByTestId('gallery')

    fireEvent.wheel(page, { deltaY: 20 })
    fireEvent.wheel(gallery, { deltaY: 20 })
    fireEvent.keyDown(gallery, { key: 'ArrowDown' })
    fireEvent.touchStart(page, { touches: [{ clientY: 200 }] })
    fireEvent.touchEnd(page, { changedTouches: [{ clientY: 100 }] })

    expect(onNext).toHaveBeenCalledTimes(2)
    expect(onPrevious).not.toHaveBeenCalled()
    expect(onScene).not.toHaveBeenCalled()
  })

  it('ignores scene input during an active transition', () => {
    const onNext = vi.fn()
    const onPrevious = vi.fn()
    const onScene = vi.fn()
    render(
      <InputHarness
        isTransitioning
        onNext={onNext}
        onPrevious={onPrevious}
        onScene={onScene}
      />,
    )

    fireEvent.wheel(screen.getByTestId('page'), { deltaY: 20 })
    fireEvent.keyDown(window, { key: 'ArrowDown' })

    expect(onNext).not.toHaveBeenCalled()
    expect(onPrevious).not.toHaveBeenCalled()
    expect(onScene).not.toHaveBeenCalled()
  })
})
