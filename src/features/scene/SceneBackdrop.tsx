import { useState, type ReactElement } from 'react'
import { motion } from 'motion/react'
import { backgroundAssets } from '../../assets/asset-catalog'
import type { NavigationDirection } from '../navigation/scene-navigator'

interface SceneBackdropProps {
  isTransitioning: boolean
  direction?: NavigationDirection
  motionEnabled?: boolean
}

export function SceneBackdrop({
  isTransitioning,
  direction = 'forward',
  motionEnabled = true,
}: SceneBackdropProps): ReactElement {
  const [failed, setFailed] = useState(false)
  const animation = !motionEnabled
    ? { x: '0%', scale: 1.04 }
    : isTransitioning
    ? { x: direction === 'forward' ? ['0%', '-12%'] : ['0%', '12%'], scale: [1.04, 1.14] }
    : { x: ['0%', '-7%', '0%'], scale: [1.04, 1.08, 1.04] }
  const transition = !motionEnabled
    ? { duration: 0 }
    : isTransitioning
    ? { duration: 1.2, ease: 'easeInOut' as const }
    : { duration: 44, ease: 'easeInOut' as const, repeat: Infinity }

  if (failed) {
    return (
      <motion.div
        aria-hidden="true"
        animate={animation}
        className="pointer-events-none fixed inset-[-6%] z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.28),transparent_36%),linear-gradient(135deg,#0f172a,#020617)] opacity-90"
        transition={transition}
      />
    )
  }

  return (
      <motion.img
        aria-hidden="true"
        className="pointer-events-none fixed inset-[-6%] z-0 h-full w-full object-cover object-center opacity-90"
      alt=""
      animate={animation}
      onError={() => setFailed(true)}
      src={backgroundAssets.background}
      transition={transition}
    />
  )
}
