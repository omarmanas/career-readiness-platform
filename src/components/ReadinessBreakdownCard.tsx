import type { CareerTrack } from '../types'
import { getText, type Language } from '../i18n'
import { getReadinessBreakdown } from '../utils/intelligence'

interface ReadinessBreakdownCardProps {
  selectedTrack: CareerTrack
  language: Language
}

function getBreakdownLabel(language: Language, label: string) {
  if (label === 'Requirements') return getText(language, 'requirements')
  if (label === 'Training') return getText(language, 'training')
  if (label === 'Documents') return getText(language, 'documents')
  if (label === 'Milestones') return getText(language, 'milestones')
  return label
}

export function ReadinessBreakdownCard({
  selectedTrack,
  language,
}: ReadinessBreakdownCardProps) {
  const { components, overall } = getReadinessBreakdown(selectedTrack)

  return (
    <article className="panel">
      <div className="section-heading">
        <h3>{getText(language, 'readinessBreakdown')}</h3>
        <span>
          {overall}% {getText(language, 'overall')}
        </span>
      </div>
      <div className="breakdown-bar-list">
        {components.map((component) => (
          <div className="breakdown-bar-row" key={component.label}>
            <div className="breakdown-bar-label">
              <span>{getBreakdownLabel(language, component.label)}</span>
              <span className="breakdown-bar-weight">
                {component.weight}% {getText(language, 'weight')}
              </span>
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
              <span className="breakdown-bar-contribution">
                +{component.contribution} {getText(language, 'pointAbbrev')}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="intel-note">
        {getText(language, 'projectionEstimateNote')}
      </p>
    </article>
  )
}
