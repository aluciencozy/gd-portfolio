import { AnimatePresence, motion } from 'motion/react'
import type { ReactElement } from 'react'
import { backgroundAssets } from '../../assets/asset-catalog'
import type { SceneId } from '../navigation/scene-navigator'
import { SCENE_THEMES } from './scene-theme'

interface SceneBackdropProps {
  scene: SceneId
}

export function SceneBackdrop({ scene }: SceneBackdropProps): ReactElement {
  const theme = SCENE_THEMES[scene]

  return (
    <>
      <motion.div
        animate={{ x: ['0svh', '-100svh'] }}
        aria-hidden="true"
        className="scene-backdrop"
        style={{ backgroundImage: `url(${backgroundAssets.background})` }}
        transition={{
          duration: 36,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
      <AnimatePresence initial={false}>
        <motion.div
          animate={{ opacity: 0.94 }}
          aria-hidden="true"
          className="scene-backdrop-tint"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key={`${scene}-tint`}
          style={{ backgroundColor: theme.backdrop }}
          transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
      <AnimatePresence initial={false}>
        <motion.div
          animate={{ opacity: 0.66 }}
          aria-hidden="true"
          className="scene-backdrop-glow"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key={`${scene}-glow`}
          style={{ backgroundColor: theme.glow }}
          transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
    </>
  )
}
