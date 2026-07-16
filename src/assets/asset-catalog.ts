import backgroundAsset from './backgrounds/background.svg'
import ballAsset from './characters/ball.svg'
import cubeAsset from './characters/cube.svg'
import shipAsset from './characters/ship.svg'
import ufoAsset from './characters/ufo.svg'
import waveAsset from './characters/wave.svg'
import blockAsset from './obstacles/block.svg'
import spikeAsset from './obstacles/spike.svg'
import yellowOrbAsset from './obstacles/yellow-orb.svg'
import ballPortalAsset from './portals/ball-portal.svg'
import shipPortalAsset from './portals/ship-portal.svg'
import wavePortalAsset from './portals/wave-portal.svg'

export type AssetCategory = 'character' | 'portal' | 'obstacle' | 'background'

export interface AssetEntry {
  id: string
  label: string
  category: AssetCategory
  src: string
  fallback?: boolean
}

export const characterAssets = {
  cube: cubeAsset,
  ship: shipAsset,
  ball: ballAsset,
  wave: waveAsset,
  ufo: ufoAsset,
} as const

export const portalAssets = {
  cube: shipPortalAsset,
  ship: shipPortalAsset,
  ball: ballPortalAsset,
  wave: wavePortalAsset,
} as const

export const obstacleAssets = {
  block: blockAsset,
  spike: spikeAsset,
  yellowOrb: yellowOrbAsset,
} as const

export const backgroundAssets = {
  background: backgroundAsset,
} as const

export const assetCatalog: AssetEntry[] = [
  { id: 'cube', label: 'Cube', category: 'character', src: cubeAsset },
  { id: 'ship', label: 'Ship', category: 'character', src: shipAsset },
  { id: 'ball', label: 'Ball', category: 'character', src: ballAsset },
  { id: 'wave', label: 'Wave', category: 'character', src: waveAsset },
  {
    id: 'ufo',
    label: 'UFO - future mode asset',
    category: 'character',
    src: ufoAsset,
  },
  {
    id: 'cube-portal',
    label: 'Cube portal - temporary Ship portal fallback',
    category: 'portal',
    src: shipPortalAsset,
    fallback: true,
  },
  { id: 'ship-portal', label: 'Ship portal', category: 'portal', src: shipPortalAsset },
  { id: 'ball-portal', label: 'Ball portal', category: 'portal', src: ballPortalAsset },
  { id: 'wave-portal', label: 'Wave portal', category: 'portal', src: wavePortalAsset },
  { id: 'block', label: 'Block', category: 'obstacle', src: blockAsset },
  { id: 'spike', label: 'Spike', category: 'obstacle', src: spikeAsset },
  {
    id: 'yellow-orb',
    label: 'Yellow orb - jump orb',
    category: 'obstacle',
    src: yellowOrbAsset,
  },
  {
    id: 'background',
    label: 'Environment background',
    category: 'background',
    src: backgroundAsset,
  },
]
