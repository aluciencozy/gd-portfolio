import type { ReactElement } from 'react'
import { PortfolioSection } from './PortfolioSection'
import type { SceneId } from '../features/navigation/scene-navigator'

interface RouteStageProps {
  scene: SceneId
}

export function RouteStage({ scene }: RouteStageProps): ReactElement {
  return (
    <div className="route-stage__layers">
      <PortfolioSection
        key={scene}
        className="route-content--current"
        id={scene}
      />
    </div>
  )
}
