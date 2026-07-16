import { useEffect, useRef, useState, type ReactElement } from 'react'
import { motion } from 'motion/react'
import { AssetGallery } from './AssetGallery'
import { characterAssets } from '../assets/asset-catalog'
import type { SceneId, SceneMode } from '../features/navigation/scene-navigator'

interface PortfolioSectionProps {
  id: SceneId
  mode: SceneMode
  isActive: boolean
  onNext: () => void
  onPrevious: () => void
  onNavigate: (scene: SceneId) => void
  motionEnabled: boolean
}

const CONTENT: Record<SceneId, { eyebrow: string; title: string; body: string }> = {
  hero: {
    eyebrow: 'Scene 01 / Cube mode',
    title: 'A portfolio in motion.',
    body: 'Foundation scene placeholder. The Cube introduces the journey and the next transition.',
  },
  about: {
    eyebrow: 'Scene 02 / Ship mode',
    title: 'About placeholder.',
    body: 'This is where background, approach, and perspective will live once the animation foundation is approved.',
  },
  projects: {
    eyebrow: 'Scene 03 / Ball mode',
    title: 'Projects placeholder.',
    body: 'This scene will become the project runway for case studies, experiments, and selected work.',
  },
  contact: {
    eyebrow: 'Scene 04 / Wave mode',
    title: 'Let’s make contact.',
    body: 'Contact content will be added later. For now, this final scene also hosts the normalized SVG preview.',
  },
}

const IDLE_ANIMATION: Record<SceneMode, { y?: number[]; rotate?: number[] }> = {
  cube: { y: [0, -6, 0], rotate: [0, 4, -4, 0] },
  ship: { y: [0, -5, 0], rotate: [0, 2, 0] },
  ball: { rotate: [0, 180, 360] },
  wave: { y: [0, -5, 0], rotate: [0, -4, 4, 0] },
}

export function PortfolioSection({
  id,
  mode,
  isActive,
  onNext,
  onPrevious,
  onNavigate,
  motionEnabled,
}: PortfolioSectionProps): ReactElement {
  const content = CONTENT[id]
  const isFirst = id === 'hero'
  const isLast = id === 'contact'
  const headingRef = useRef<HTMLHeadingElement>(null)
  const wasActive = useRef(isActive)
  const [characterFailed, setCharacterFailed] = useState(false)
  const idleTransition = {
    duration: motionEnabled ? (mode === 'ball' ? 5 : 3.4) : 0,
    ease: 'easeInOut' as const,
    ...(motionEnabled ? { repeat: Infinity } : {}),
  }
  const idleAnimation = motionEnabled ? IDLE_ANIMATION[mode] : undefined

  useEffect(() => {
    if (isActive && !wasActive.current) {
      headingRef.current?.focus()
    }

    wasActive.current = isActive
  }, [isActive])

  return (
    <section
      aria-hidden={!isActive}
      className={`absolute inset-0 overflow-hidden px-5 pb-24 pt-24 transition-opacity duration-300 sm:px-10 sm:pb-28 sm:pt-28 ${
        isActive ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'
      }`}
      data-scene={id}
      id={id}
      inert={!isActive}
      tabIndex={-1}
    >
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)] lg:gap-16">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold tracking-[0.28em] text-cyan-200/80 uppercase">
              {content.eyebrow}
            </p>
            <h1
              className="max-w-xl text-4xl leading-[0.95] font-black tracking-[-0.055em] text-white outline-none sm:text-6xl lg:text-8xl"
              ref={headingRef}
              tabIndex={-1}
            >
              {content.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
              {content.body}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {!isFirst && (
                <button
                  className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-xs font-bold tracking-[0.16em] text-white uppercase transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  onClick={onPrevious}
                  type="button"
                >
                  Previous mode
                </button>
              )}
              {!isLast && (
                <button
                  className="rounded-full bg-cyan-300 px-5 py-3 text-xs font-black tracking-[0.16em] text-slate-950 uppercase shadow-lg shadow-cyan-300/20 transition hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                  onClick={onNext}
                  type="button"
                >
                  Enter {id === 'hero' ? 'About' : id === 'about' ? 'Projects' : 'Contact'}
                </button>
              )}
              {id !== 'hero' && (
                <button
                  className="rounded-full border border-white/15 px-5 py-3 text-xs font-bold tracking-[0.16em] text-white/70 uppercase transition hover:border-white/35 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  onClick={() => onNavigate('hero')}
                  type="button"
                >
                  Return to Hero
                </button>
              )}
            </div>
          </div>

          <div className="relative flex min-h-[13rem] items-center justify-center lg:min-h-[20rem]">
            <div className="absolute h-48 w-48 rounded-full bg-cyan-300/15 blur-3xl sm:h-64 sm:w-64" />
            {characterFailed ? (
              <motion.div
                aria-hidden="true"
                animate={idleAnimation}
                className="relative z-10 aspect-square w-[clamp(8rem,25vw,18rem)] rounded-2xl border border-white/20 bg-white/10 shadow-inner shadow-white/10"
                data-asset-fallback={`${mode} character`}
                transition={idleTransition}
              />
            ) : (
              <motion.img
                alt=""
                animate={idleAnimation}
                className="relative z-10 w-[clamp(8rem,25vw,18rem)] drop-shadow-[0_1.5rem_2rem_rgba(0,0,0,0.35)]"
                onError={() => setCharacterFailed(true)}
                src={characterAssets[mode]}
                transition={idleTransition}
              />
            )}
          </div>
        </div>

        {id === 'contact' && (
          <div className="mt-6 lg:mt-8">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-sm font-black tracking-[0.18em] text-white uppercase">
                  Normalized asset preview
                </h2>
                <p className="mt-1 text-xs text-white/50">
                  Supplied project assets, attributed to RobTop Games. Rights clearance is unverified.
                </p>
              </div>
            </div>
            <AssetGallery />
          </div>
        )}
      </div>
    </section>
  )
}
