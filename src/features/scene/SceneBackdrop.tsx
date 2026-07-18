import type { ReactElement } from 'react'
import { backgroundAssets } from '../../assets/asset-catalog'

export function SceneBackdrop(): ReactElement {
  return (
    <>
      <div
        aria-hidden="true"
        className="scene-backdrop"
        style={{ backgroundImage: `url(${backgroundAssets.background})` }}
      />
      <div aria-hidden="true" className="scene-backdrop-tint" />
    </>
  )
}
