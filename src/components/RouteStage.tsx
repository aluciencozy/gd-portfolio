import { AnimatePresence, motion } from 'motion/react'
import type { ReactElement } from 'react'
import type {
  NavigationDirection,
  SceneId,
} from '../features/navigation/scene-navigator'
import { PortfolioSection } from './PortfolioSection'

interface RouteStageProps {
  direction: NavigationDirection
  onCubeComment: (comment: string | null) => void
  onNavigate: (scene: SceneId) => void
  onTransitionComplete: () => void
  scene: SceneId
}

const sceneVariants = {
  initial: { opacity: 0.999 },
  animate: {
    opacity: 1,
    transition: { duration: 0.76 },
  },
  exit: {
    opacity: 0.999,
    transition: { duration: 0.5 },
  },
}

export function RouteStage({
  direction,
  onCubeComment,
  onNavigate,
  onTransitionComplete,
  scene,
}: RouteStageProps): ReactElement {
  return (
    <div className="route-stage__layers">
      <AnimatePresence initial mode="wait">
        <motion.div
          animate="animate"
          className="route-stage__scene"
          custom={direction}
          data-navigation-direction={direction}
          exit="exit"
          initial="initial"
          key={scene}
          onAnimationComplete={(definition) => {
            if (definition === 'animate') {
              onTransitionComplete()
            }
          }}
          variants={sceneVariants}
        >
          <PortfolioSection
            id={scene}
            onCubeComment={onCubeComment}
            onNavigate={onNavigate}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
