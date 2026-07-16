import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('portfolio foundation', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '#hero')
  })

  it('renders the Hero scene without an active-mode badge', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'A portfolio in motion.' })).toBeVisible()
    expect(screen.queryByText(/Active mode:/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next scene' })).toBeEnabled()
  })
})
