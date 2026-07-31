import backgroundAsset from '../../assets/background-png.png'
import checkpointFilledAsset from './checkpoints/filled.svg'
import checkpointUnfilledAsset from './checkpoints/unfilled.svg'
import cubeAsset from './characters/cube.svg'
import progressFillAsset from './ui/sliderBar-uhd.png'
import progressGrooveAsset from './ui/slidergroove-uhd.png'
import groundAsset from '../../assets/ground-square.png'
import downloadIconAsset from './ui/hero/GJ_downloadBtn_001.png'
import nameAsset from './ui/hero/gd-name-two-lines-left-aligned.png'
import resumeButtonAsset from './ui/hero/GJ_longBtn03_001.png'
import workButtonAsset from './ui/hero/GJ_longBtn02_001.png'
import workIconAsset from './ui/hero/GJ_playBtn_001.png'
import contactBallAsset from './characters/ball.svg'
import contactOrbAsset from './obstacles/yellow-orb.svg'
import contactSpikeAsset from './obstacles/spike.svg'

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

export const heroAssets = {
  name: nameAsset,
  resumeButton: resumeButtonAsset,
  workButton: workButtonAsset,
  downloadIcon: downloadIconAsset,
  workIcon: workIconAsset,
} as const

export const contactAssets = {
  ball: contactBallAsset,
  orb: contactOrbAsset,
  spike: contactSpikeAsset,
} as const
