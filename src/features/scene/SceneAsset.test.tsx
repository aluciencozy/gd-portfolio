import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SceneAsset } from './SceneAsset'

describe('SceneAsset', () => {
  it('keeps a reserved fallback when an asset fails', () => {
    const { container } = render(
      <SceneAsset
        alt=""
        className="w-32"
        dataAttribute="character"
        fallbackLabel="Cube character"
        src="/missing.svg"
      />,
    )

    fireEvent.error(container.querySelector('img') as HTMLImageElement)

    expect(container.querySelector('[data-asset-fallback="Cube character"]')).toBeVisible()
    expect(container.querySelector('[data-transition-character="true"]')).toBeVisible()
  })
})
