import type { SceneId } from '../features/navigation/scene-navigator'

export interface RouteContent {
  eyebrow: string
  title: string
  body: string
}

export const ROUTE_CONTENT: Record<SceneId, RouteContent> = {
  hero: {
    eyebrow: 'Checkpoint 01 / Hero',
    title: 'A portfolio in motion.',
    body: 'The journey starts here. Move forward to explore the work, ideas, and experiments ahead.',
  },
  about: {
    eyebrow: 'Checkpoint 02 / About',
    title: 'A little more about the maker.',
    body: 'This space will introduce the person, process, and perspective behind the work.',
  },
  projects: {
    eyebrow: 'Checkpoint 03 / Projects',
    title: 'Selected work in progress.',
    body: 'The project runway will become a home for case studies, experiments, and playful builds.',
  },
  contact: {
    eyebrow: 'Checkpoint 04 / Contact',
    title: 'Let’s make contact.',
    body: 'The final checkpoint will become the place to start a conversation or collaborate.',
  },
}
