import { forwardRef, type ReactElement } from 'react'
import type { SceneId } from '../features/navigation/scene-navigator'
import { ROUTE_CONTENT } from './route-content'

interface PortfolioSectionProps {
  id: SceneId
  ariaHidden?: boolean
  className?: string
}

export const PortfolioSection = forwardRef<HTMLElement, PortfolioSectionProps>(
  function PortfolioSection(
    { id, ariaHidden = false, className = '' },
    ref,
  ): ReactElement {
    const content = ROUTE_CONTENT[id]
    const headingId = `${id}-heading`

    return (
      <section
        ref={ref}
        aria-hidden={ariaHidden}
        aria-labelledby={headingId}
        className={`route-content ${className}`}
        data-scene={id}
        id={id}
        tabIndex={-1}
      >
        <div className="route-content__panel">
          <p className="route-content__eyebrow">{content.eyebrow}</p>
          <h1 id={headingId}>{content.title}</h1>
          <p className="route-content__body">{content.body}</p>
        </div>
      </section>
    )
  },
)

PortfolioSection.displayName = 'PortfolioSection'
