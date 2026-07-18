import type { ReactElement } from 'react'
import { backgroundAssets } from '../../assets/asset-catalog'

export function SceneGround(): ReactElement {
  return (
    <div aria-hidden="true" className="scene-ground">
      <div
        className="scene-ground__image"
        style={{ backgroundImage: `url(${backgroundAssets.ground})` }}
      />
      <div className="scene-ground__shade" />
      <div className="scene-ground__horizon" />
    </div>
  )
}
