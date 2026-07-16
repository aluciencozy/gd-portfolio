import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NavigationHud, SceneStepControls } from './NavigationHud'

describe('navigation HUD', () => {
  it('sends direct section selections to the navigator seam', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()

    render(
      <NavigationHud
        current="hero"
        isTransitioning={false}
        onNavigate={onNavigate}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Projects' }))

    expect(onNavigate).toHaveBeenCalledWith('projects')
    expect(screen.getByRole('button', { name: 'Hero' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('disables navigation while a transition is active', () => {
    render(
      <NavigationHud
        current="about"
        isTransitioning
        onNavigate={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Projects' })).toBeDisabled()
  })

  it('disables previous and next at the sequence boundaries', () => {
    render(
      <SceneStepControls
        current="hero"
        isTransitioning={false}
        onNext={vi.fn()}
        onPrevious={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Previous scene' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next scene' })).not.toBeDisabled()
  })
})
