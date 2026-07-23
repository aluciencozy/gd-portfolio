import resumeUrl from '../../assets/alex_cosentino_resume.pdf?url'

export { resumeUrl }

export const skillGroups = [
  {
    label: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'Java', 'C'],
  },
  {
    label: 'Frameworks',
    skills: [
      'Next.js',
      'React',
      'Node.js',
      'tRPC',
      'Drizzle ORM',
      'FastAPI',
      'Motion',
    ],
  },
  {
    label: 'Data & architecture',
    skills: [
      'Supabase',
      'PostgreSQL',
      'REST APIs',
      'Webhooks',
      'Socket.io',
    ],
  },
  {
    label: 'Cloud & tools',
    skills: [
      'GCP',
      'AWS',
      'Docker',
      'GitHub Actions',
      'Git',
      'n8n',
    ],
  },
] as const

export const experienceHighlights = [
  {
    metric: '50K+',
    text: 'legacy records migrated into Supabase with zero data loss',
  },
  {
    metric: '10+',
    text: 'Python migration scripts with transactional integrity checks',
  },
  {
    metric: 'CI/CD',
    text: 'GitHub Actions pipelines deploying reviewed changes to GCP Cloud Run',
  },
  {
    metric: 'Lead',
    text: 'acting team lead for sprint planning, delegation, and executive demos',
  },
] as const

export interface Project {
  name: string
  period: string
  summary: string
  detail: string
  stack: readonly string[]
  reaction: string
  href?: string
  label: string
}

// Add another object here to extend the project collection.
export const projects: readonly Project[] = [
  {
    name: 'Vesta Credentialing',
    period: '2026 - Present',
    summary: 'Enterprise healthcare credentialing, rebuilt from the ground up.',
    detail:
      'A type-safe Next.js and tRPC system replacing 30+ Google Sheets with RBAC, audited state transitions, and a single reliable source of truth.',
    stack: ['Next.js', 'tRPC', 'Drizzle', 'Supabase'],
    reaction: 'This one replaced 30+ spreadsheets. Very satisfying.',
    label: 'Production system',
  },
  {
    name: 'Demonlist Ultimate',
    period: '2025 - 2026',
    summary: 'A scalable leaderboard for the hardest Geometry Dash levels.',
    detail:
      'A three-tier AWS platform with a Next.js frontend, Dockerized FastAPI services, PostgreSQL, S3 media, and a Gemini-powered assistant.',
    stack: ['Next.js', 'FastAPI', 'AWS', 'Docker'],
    reaction: 'My favorite boss battle: full stack, cloud, and Geometry Dash.',
    href: 'https://github.com/aluciencozy/demonlist',
    label: 'Featured build',
  },
  {
    name: 'Guess the OST',
    period: '2026 - Present',
    summary: 'Real-time multiplayer music trivia with synchronized rooms.',
    detail:
      'Low-latency Socket.io gameplay with live chat, concurrent audio events, shared lobby state, and a motion-rich React interface.',
    stack: ['React', 'Node.js', 'Socket.io', 'Motion'],
    reaction: 'This one has immaculate game-night energy.',
    href: 'https://github.com/aluciencozy/guess-the-ost',
    label: 'Live multiplayer',
  },
  {
    name: 'Git Janitor',
    period: 'Open source',
    summary: 'A keyboard-first CLI for safer repository maintenance.',
    detail:
      'An npm-published TypeScript tool that prunes merged branches, synchronizes remotes, and makes complex Git cleanup approachable.',
    stack: ['TypeScript', 'Node.js', 'npm', 'Git'],
    reaction: 'Tiny tool, huge quality-of-life win. Clean repos feel great.',
    label: 'Developer tool',
  },
] as const
