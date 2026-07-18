import { useState, type ReactElement } from 'react'
import { backgroundAssets } from '../../assets/asset-catalog'

export function SceneBackdrop(): ReactElement {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <div aria-hidden="true" className="scene-backdrop scene-backdrop--fallback" />
  }

  return (
    <img
      aria-hidden="true"
      className="scene-backdrop"
      alt=""
      onError={() => setFailed(true)}
      src={backgroundAssets.background}
    />
  )
}
