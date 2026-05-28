import { useState } from 'react'
import type { ReactNode } from 'react'

interface CollapsibleSectionProps {
  title: string
  description: string
  children: ReactNode
}

export function CollapsibleSection({
  title,
  description,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className={isOpen ? 'collapsible-section open' : 'collapsible-section'}>
      <button
        className="collapsible-trigger"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span className="collapsible-heading">
          <strong>{title}</strong>
          <small>{description}</small>
        </span>
        <span className="collapse-indicator" aria-hidden="true">
          {isOpen ? '▼' : '▶'}
        </span>
      </button>
      <div className="collapsible-content" aria-hidden={!isOpen}>
        <div className="collapsible-content-inner">{children}</div>
      </div>
    </section>
  )
}
