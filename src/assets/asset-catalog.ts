import backgroundAsset from '../../assets/background-png.png'
import checkpointFilledAsset from './checkpoints/filled.svg'
import checkpointUnfilledAsset from './checkpoints/unfilled.svg'
import cubeAsset from './characters/cube.svg'
import progressFillAsset from './ui/sliderBar-uhd.png'
import progressGrooveAsset from './ui/slidergroove-uhd.png'
import groundAsset from '../../assets/ground-square.png'

export const characterAssets = {
  cube: cubeAsset,
} as const

export const backgroundAssets = {
  background: backgroundAsset,
  ground: groundAsset,
} as const

export const checkpointAssets = {
  filled: checkpointFilledAsset,
  unfilled: checkpointUnfilledAsset,
} as const

export const progressAssets = {
  fill: progressFillAsset,
  groove: progressGrooveAsset,
} as const
