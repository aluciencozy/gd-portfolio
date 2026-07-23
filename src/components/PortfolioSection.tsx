import {
  motion,
  type TargetAndTransition,
  type Variants,
} from 'motion/react'
import type { FocusEvent, ReactElement, ReactNode } from 'react'
import type { SceneId } from '../features/navigation/scene-navigator'
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
          Alex
          <span> Cosentino</span>
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
        <a className="button button--primary" download href={resumeUrl}>
          Download resume
          <span aria-hidden="true">↓</span>
        </a>
        <a
          className="button button--ghost"
          href="#projects"
          onClick={(event) => {
            event.preventDefault()
            onNavigate('projects')
          }}
        >
          Selected work
          <span aria-hidden="true">↗</span>
        </a>
      </EdgeReveal>

      <EdgeReveal
        className="hero-proof"
        edge="right"
        opening
        order={2}
      >
        <div>
          <span className="hero-proof__value">50K+</span>
          <span className="hero-proof__label">records migrated</span>
        </div>
        <div>
          <span className="hero-proof__value">4.0</span>
          <span className="hero-proof__label">UCF GPA</span>
        </div>
        <div>
          <span className="hero-proof__value">Full stack</span>
          <span className="hero-proof__label">product focus</span>
        </div>
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

        <div className="education-card">
          <div>
            <span className="card-kicker">Education</span>
            <strong>University of Central Florida</strong>
            <span>Computer Science B.S. / Aug 2024 - Present</span>
          </div>
          <span className="education-card__gpa">4.0 GPA</span>
        </div>
      </EdgeReveal>

      <EdgeReveal className="skills-board" edge="right" order={1}>
        <div className="skills-board__heading">
          <span className="card-kicker">Technical loadout</span>
          <span>{skillGroups.reduce((count, group) => count + group.skills.length, 0)} tools</span>
        </div>
        {skillGroups.map((group) => (
          <div className="skill-row" key={group.label}>
            <span className="skill-row__label">{group.label}</span>
            <div className="skill-row__chips">
              {group.skills.map((skill) => (
                <span className="skill-chip" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
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

      <EdgeReveal className="experience-card" edge="right" order={1}>
        <div className="experience-card__topline">
          <div>
            <span className="card-kicker">Vesta Teleradiology</span>
            <h2>Software Engineering Intern</h2>
          </div>
          <div className="experience-card__meta">
            <span>Feb 2026 - Present</span>
            <span>Lake Mary, FL</span>
          </div>
        </div>

        <div className="experience-grid">
          {experienceHighlights.map((highlight) => (
            <div className="experience-highlight" key={highlight.metric}>
              <strong>{highlight.metric}</strong>
              <span>{highlight.text}</span>
            </div>
          ))}
        </div>

        <div className="experience-card__automation">
          <span>Also built</span>
          <p>
            n8n webhook workflows for credentialing status emails and real-time
            system alerts.
          </p>
        </div>
      </EdgeReveal>

      <EdgeReveal className="secondary-role" edge="left" order={2}>
        <span className="card-kicker">Hilton Food and Beverage</span>
        <strong>Food and Beverage Attendant</strong>
        <span>Jun 2024 - Present / Sanford, FL</span>
        <p>
          Fast-paced guest service, cross-functional teamwork, inventory, and
          real-time problem solving.
        </p>
      </EdgeReveal>
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
