import type { CareerTrack } from '../types'
import { getReadinessBreakdown } from '../utils/intelligence'

interface ReadinessBreakdownCardProps {
  selectedTrack: CareerTrack
}

export function ReadinessBreakdownCard({ selectedTrack }: ReadinessBreakdownCardProps) {
  const { components, overall } = getReadinessBreakdown(selectedTrack)

  return (
    <article className="panel">
      <div className="section-heading">
        <h3>Readiness Breakdown</h3>
        <span>{overall}% overall</span>
      </div>
      <div className="breakdown-bar-list">
        {components.map((component) => (
          <div className="breakdown-bar-row" key={component.label}>
            <div className="breakdown-bar-label">
              <span>{component.label}</span>
              <span className="breakdown-bar-weight">{component.weight}% weight</span>
            </div>
            <div className="breakdown-bar-track" aria-hidden="true">
              <div
                className="breakdown-bar-fill"
                style={{ width: `${component.pct}%` }}
              />
            </div>
            <div className="breakdown-bar-stats">
              <strong>
                {component.completed}/{component.total} &nbsp; {component.pct}%
              </strong>
              <span className="breakdown-bar-contribution">+{component.contribution} pts</span>
            </div>
          </div>
        ))}
      </div>
      <p className="intel-note">
        Weighted contribution: requirements 40%, training 25%, documents 20%, milestones 15%.
      </p>
    </article>
  )
}
