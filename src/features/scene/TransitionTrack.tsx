import type { ReactElement } from 'react'
import {
  obstacleAssets,
  portalAssets,
} from '../../assets/asset-catalog'
import type { NavigationDirection, SceneMode } from '../navigation/scene-navigator'
import { SceneAsset } from './SceneAsset'

interface TransitionTrackProps {
  direction: NavigationDirection
  portalMode: SceneMode
}

export function TransitionTrack({
  direction,
  portalMode,
}: TransitionTrackProps): ReactElement {
  const portalLeft = direction === 'forward' ? '69%' : '31%'

  return (
    <div
      aria-hidden="true"
      className="absolute inset-y-0 left-[-32vw] flex w-[164vw] items-center"
      data-transition-track="true"
    >
      <SceneAsset
        alt=""
        className="absolute left-[8%] top-[67%] w-[clamp(3rem,8vw,8rem)]"
        fallbackLabel="Block"
        src={obstacleAssets.block}
      />
      <SceneAsset
        alt=""
        className="absolute left-[32%] top-[72%] w-[clamp(2.5rem,6vw,6rem)]"
        fallbackLabel="Spike"
        src={obstacleAssets.spike}
      />
      <SceneAsset
        alt=""
        className="absolute left-[53%] top-[22%] w-[clamp(2.5rem,6vw,6rem)]"
        fallbackLabel="Yellow orb"
        src={obstacleAssets.yellowOrb}
      />
      <SceneAsset
        alt=""
        className="absolute top-1/2 w-[clamp(5rem,13vw,12rem)] -translate-y-1/2"
        dataAttribute="portal"
        fallbackLabel={`${portalMode} portal`}
        src={portalAssets[portalMode]}
        style={{ left: portalLeft }}
      />
      <SceneAsset
        alt=""
        className="absolute left-[89%] top-[64%] w-[clamp(3rem,8vw,8rem)]"
        fallbackLabel="Block"
        src={obstacleAssets.block}
      />
    </div>
  )
}
