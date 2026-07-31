import {
  motion,
  type TargetAndTransition,
  type Variants,
} from 'motion/react'
import type { FocusEvent, ReactElement, ReactNode } from 'react'
import type { SceneId } from '../features/navigation/scene-navigator'
import { heroAssets } from '../assets/asset-catalog'
import {
  experienceHighlights,
  projects,
  resumeUrl,
  skillGroups,
} from './portfolio-data'

type ScreenEdge = 'left' | 'right' | 'top' | 'bottom'

interface PortfolioSectionProps {
  id: SceneId
  ariaHidden?: boolean
  onCubeComment: (comment: string | null) => void
  onNavigate: (scene: SceneId) => void
}

interface EdgeRevealProps {
  children: ReactNode
  className?: string
  edge: ScreenEdge
  opening?: boolean
  order?: number
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const

function edgeTransform(edge: ScreenEdge, distance: number): TargetAndTransition {
  if (edge === 'left' || edge === 'right') {
    return { x: edge === 'left' ? -distance : distance, y: 0 }
  }

  return { x: 0, y: edge === 'top' ? -distance : distance }
}

const revealVariants: Variants = {
  initial: ({ edge }: { edge: ScreenEdge; order: number }) => ({
    ...edgeTransform(edge, 88),
    opacity: 0,
    filter: 'blur(12px)',
  }),
  animate: ({ order }: { edge: ScreenEdge; order: number }) => ({
    x: 0,
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      delay: order * 0.065,
      duration: 0.72,
      ease: EASE_OUT,
    },
  }),
  exit: ({ edge, order }: { edge: ScreenEdge; order: number }) => ({
    ...edgeTransform(edge, 112),
    opacity: 0,
    filter: 'blur(9px)',
    transition: {
      delay: order * 0.025,
      duration: 0.42,
      ease: [0.4, 0, 0.7, 0.2],
    },
  }),
}

function EdgeReveal({
  children,
  className = '',
  edge,
  opening = false,
  order = 0,
}: EdgeRevealProps): ReactElement {
  return (
    <motion.div
      className={className}
      custom={{ edge, order }}
      data-edge={edge}
      data-opening-content={opening || undefined}
      variants={revealVariants}
    >
      {children}
    </motion.div>
  )
}

function SectionHeading({
  eyebrow,
  id,
  title,
}: {
  eyebrow: string
  id: string
  title: string
}): ReactElement {
  return (
    <header className="section-heading">
      <p className="route-content__eyebrow">{eyebrow}</p>
      <h1 id={id}>{title}</h1>
    </header>
  )
}

function HeroSection({
  onNavigate,
}: {
  onNavigate: (scene: SceneId) => void
}): ReactElement {
  return (
    <div className="hero-layout">
      <EdgeReveal
        className="hero-copy"
        edge="left"
        opening
      >
        <p className="route-content__eyebrow" data-opening-eyebrow>
          Software engineer / UCF computer science
        </p>
        <h1 data-opening-heading id="hero-heading">
          <span className="sr-only">Alex Cosentino</span>
          <img
            alt="Alex Cosentino"
            className="hero-copy__name"
            src={heroAssets.name}
          />
        </h1>
        <p className="hero-copy__lede" data-opening-body>
          I build dependable full-stack products with playful, high-polish
          interfaces.
        </p>
      </EdgeReveal>

      <EdgeReveal
        className="hero-actions"
        edge="right"
        opening
        order={1}
      >
        <a
          className="hero-button hero-button--primary"
          download
          href={resumeUrl}
          style={{ backgroundImage: `url(${heroAssets.resumeButton})` }}
        >
          <span className="hero-button__copy">Download resume</span>
          <img
            alt=""
            aria-hidden="true"
            className="hero-button__icon"
            src={heroAssets.downloadIcon}
          />
        </a>
        <a
          className="hero-button hero-button--secondary"
          href="#projects"
          onClick={(event) => {
            event.preventDefault()
            onNavigate('projects')
          }}
          style={{ backgroundImage: `url(${heroAssets.workButton})` }}
        >
          <span className="hero-button__copy">Selected work</span>
          <img
            alt=""
            aria-hidden="true"
            className="hero-button__icon"
            src={heroAssets.workIcon}
          />
        </a>
      </EdgeReveal>

    </div>
  )
}

function AboutSection(): ReactElement {
  return (
    <div className="about-layout">
      <EdgeReveal className="about-intro" edge="left">
        <SectionHeading
          eyebrow="Checkpoint 02 / Profile"
          id="about-heading"
          title="Curious by default."
        />
        <p className="route-content__body">
          I’m an Orlando-based software engineer and Computer Science student
          who likes turning complex systems into clear, responsive products.
          My sweet spot is the line between sturdy architecture and interfaces
          that feel alive.
        </p>

        <dl className="about-education" aria-label="Education">
          <div className="about-education__row">
            <dt>Education</dt>
            <dd>University of Central Florida</dd>
          </div>
          <div className="about-education__row">
            <dt>Program</dt>
            <dd>Computer Science B.S.</dd>
          </div>
          <div className="about-education__row">
            <dt>Timeline</dt>
            <dd>Aug 2024 - Present</dd>
          </div>
          <div className="about-education__row about-education__row--score">
            <dt>Academic score</dt>
            <dd>4.0 GPA</dd>
          </div>
        </dl>
      </EdgeReveal>

      <EdgeReveal className="about-loadout" edge="right" order={1}>
        <header className="about-loadout__heading">
          <h2>Technical loadout</h2>
          <span>{skillGroups.reduce((count, group) => count + group.skills.length, 0)} tools</span>
        </header>
        <div className="about-skill-list" role="list">
          {skillGroups.map((group) => (
            <div className="about-skill-row" key={group.label} role="listitem">
              <h3>{group.label}</h3>
              <div className="about-skill-row__chips" aria-label={`${group.label} skills`}>
                {group.skills.map((skill) => (
                  <span className="about-skill-chip" key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </EdgeReveal>
    </div>
  )
}

function ExperienceSection(): ReactElement {
  return (
    <div className="experience-layout">
      <EdgeReveal className="experience-heading" edge="left">
        <SectionHeading
          eyebrow="Checkpoint 03 / Experience"
          id="experience-heading"
          title="Shipping real systems."
        />
        <p className="route-content__body">
          Production engineering, migration strategy, automation, and team
          leadership in a healthcare environment.
        </p>
      </EdgeReveal>

      <div className="experience-timeline" aria-label="Work experience">
        <EdgeReveal className="experience-entry experience-entry--current" edge="right" order={1}>
          <article>
            <header className="experience-entry__header">
              <div>
                <span className="experience-label">01 / Vesta Teleradiology</span>
                <h2>Software Engineering Intern</h2>
              </div>
              <dl className="experience-entry__meta">
                <div><dt>Dates</dt><dd>Feb 2026 - Present</dd></div>
                <div><dt>Location</dt><dd>Lake Mary, FL</dd></div>
              </dl>
            </header>

            <div className="experience-metrics" aria-label="Vesta highlights">
              {experienceHighlights.map((highlight) => (
                <div className="experience-metric" key={highlight.metric}>
                  <strong>{highlight.metric}</strong>
                  <span>{highlight.text}</span>
                </div>
              ))}
            </div>

            <div className="experience-automation">
              <span>Also built</span>
              <p>
                n8n webhook workflows for credentialing status emails and real-time
                system alerts.
              </p>
            </div>
          </article>
        </EdgeReveal>

        <EdgeReveal className="experience-entry experience-entry--current" edge="left" order={2}>
          <article>
            <header className="experience-entry__header">
              <div>
                <span className="experience-label">02 / Hilton Food and Beverage</span>
                <h2>Food and Beverage Attendant</h2>
              </div>
              <dl className="experience-entry__meta">
                <div><dt>Dates</dt><dd>Jun 2024 - Present</dd></div>
                <div><dt>Location</dt><dd>Sanford, FL</dd></div>
              </dl>
            </header>
            <p className="experience-entry__copy">
              Fast-paced guest service, cross-functional teamwork, inventory, and
              real-time problem solving.
            </p>
          </article>
        </EdgeReveal>
      </div>
    </div>
  )
}

function ProjectSection({
  onCubeComment,
}: {
  onCubeComment: (comment: string | null) => void
}): ReactElement {
  const clearCommentOnBlur = (
    event: FocusEvent<HTMLElement>,
  ): void => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      onCubeComment(null)
    }
  }

  return (
    <div className="projects-layout">
      <EdgeReveal className="projects-heading" edge="top">
        <SectionHeading
          eyebrow="Checkpoint 04 / Selected work"
          id="projects-heading"
          title="Built to be used."
        />
        <p>Hover or focus a project. The cube has opinions.</p>
      </EdgeReveal>

      <div className="project-grid">
        {projects.map((project, index) => {
          const edge = index % 2 === 0 ? 'left' : 'right'

          return (
            <EdgeReveal
              className="project-card-wrap"
              edge={edge}
              key={project.name}
              order={index + 1}
            >
              <motion.article
                className="project-card"
                onBlur={clearCommentOnBlur}
                onFocus={() => onCubeComment(project.reaction)}
                onPointerEnter={() => onCubeComment(project.reaction)}
                onPointerLeave={() => onCubeComment(null)}
                tabIndex={0}
                whileFocus={{ y: -6, scale: 1.012 }}
                whileHover={{ y: -6, scale: 1.012 }}
                transition={{ duration: 0.24, ease: EASE_OUT }}
              >
                <div className="project-card__topline">
                  <span className="card-kicker">{project.label}</span>
                  <span>{project.period}</span>
                </div>
                <h2>{project.name}</h2>
                <strong>{project.summary}</strong>
                <p>{project.detail}</p>
                <div className="project-card__footer">
                  <div className="project-card__stack">
                    {project.stack.map((technology) => (
                      <span key={technology}>{technology}</span>
                    ))}
                  </div>
                  {project.href && (
                    <a
                      aria-label={`View ${project.name} on GitHub`}
                      href={project.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      ↗
                    </a>
                  )}
                </div>
              </motion.article>
            </EdgeReveal>
          )
        })}
      </div>
    </div>
  )
}

function ContactSection(): ReactElement {
  return (
    <div className="contact-layout">
      <EdgeReveal className="contact-copy" edge="left">
        <SectionHeading
          eyebrow="Checkpoint 05 / Contact"
          id="contact-heading"
          title="Let’s build something good."
        />
        <p className="route-content__body">
          I’m interested in thoughtful software, ambitious teams, and products
          where engineering quality is part of the user experience.
        </p>
        <a className="contact-email" href="mailto:aluciencozy22@gmail.com">
          aluciencozy22@gmail.com
          <span aria-hidden="true">↗</span>
        </a>
      </EdgeReveal>

      <EdgeReveal className="contact-panel" edge="right" order={1}>
        <div className="contact-panel__status">
          <span aria-hidden="true" />
          Open to software engineering opportunities
        </div>

        <nav aria-label="Contact links" className="contact-links">
          <a href="https://github.com/aluciencozy" rel="noreferrer" target="_blank">
            <span>GitHub</span>
            <strong>@aluciencozy</strong>
            <span aria-hidden="true">↗</span>
          </a>
          <a href="https://linkedin.com/in/alcozy/" rel="noreferrer" target="_blank">
            <span>LinkedIn</span>
            <strong>/in/alcozy</strong>
            <span aria-hidden="true">↗</span>
          </a>
          <a href="tel:+14077246962">
            <span>Phone</span>
            <strong>407 724 6962</strong>
            <span aria-hidden="true">↗</span>
          </a>
          <a download href={resumeUrl}>
            <span>Resume</span>
            <strong>Download PDF</strong>
            <span aria-hidden="true">↓</span>
          </a>
        </nav>
      </EdgeReveal>
    </div>
  )
}

export function PortfolioSection({
  id,
  ariaHidden = false,
  onCubeComment,
  onNavigate,
}: PortfolioSectionProps): ReactElement {
  return (
    <section
      aria-hidden={ariaHidden}
      aria-labelledby={`${id}-heading`}
      className={`route-content route-content--${id}`}
      data-scene={id}
      id={id}
      tabIndex={-1}
    >
      {id === 'hero' && <HeroSection onNavigate={onNavigate} />}
      {id === 'about' && <AboutSection />}
      {id === 'experience' && <ExperienceSection />}
      {id === 'projects' && <ProjectSection onCubeComment={onCubeComment} />}
      {id === 'contact' && <ContactSection />}
    </section>
  )
}
