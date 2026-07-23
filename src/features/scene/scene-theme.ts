import type { SceneId } from '../navigation/scene-navigator'

export interface SceneTheme {
  accent: string
  backdrop: string
  ground: string
  glow: string
}

export const SCENE_THEMES: Record<SceneId, SceneTheme> = {
  hero: {
    accent: '#8da2ff',
    backdrop: '#1737bd',
    ground: '#254bd7',
    glow: 'rgb(85 118 255 / 42%)',
  },
  about: {
    accent: '#ff9dd4',
    backdrop: '#a61b68',
    ground: '#d12f87',
    glow: 'rgb(255 80 171 / 38%)',
  },
  experience: {
    accent: '#8ff0b7',
    backdrop: '#0d713f',
    ground: '#159857',
    glow: 'rgb(63 226 135 / 34%)',
  },
  projects: {
    accent: '#ffaaa3',
    backdrop: '#a7272e',
    ground: '#d33c41',
    glow: 'rgb(255 77 77 / 34%)',
  },
  contact: {
    accent: '#9eafff',
    backdrop: '#1737bd',
    ground: '#254bd7',
    glow: 'rgb(85 118 255 / 42%)',
  },
}
