import { AnimatePresence, motion } from 'motion/react'
import type { ReactElement } from 'react'
import { backgroundAssets } from '../../assets/asset-catalog'
import type { SceneId } from '../navigation/scene-navigator'
import { SCENE_THEMES } from './scene-theme'

interface SceneGroundProps {
  scene: SceneId
}

export function SceneGround({ scene }: SceneGroundProps): ReactElement {
  const theme = SCENE_THEMES[scene]

  return (
    <div aria-hidden="true" className="scene-ground">
      <div
        className="scene-ground__image"
        style={{ backgroundImage: `url(${backgroundAssets.ground})` }}
      />
      <AnimatePresence initial={false}>
        <motion.div
          animate={{ opacity: 0.96 }}
          className="scene-ground__tint"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key={`${scene}-ground`}
          style={{ backgroundColor: theme.ground }}
          transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
      <div className="scene-ground__shade" />
      <AnimatePresence initial={false}>
        <motion.div
          animate={{ opacity: 1 }}
          className="scene-ground__horizon"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key={`${scene}-horizon`}
          style={{ boxShadow: `0 0 1.2rem ${theme.accent}` }}
          transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
    </div>
  )
}
