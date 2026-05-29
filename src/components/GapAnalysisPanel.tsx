import { Badge } from './Badge'
import { getPriorityText, getStatusText, getText, type Language } from '../i18n'
import type { CareerTrack } from '../types'
import { gapSeverityTone, gapStatusTone } from '../utils/display'
import { getTopGaps } from '../utils/gaps'

interface GapAnalysisPanelProps {
  selectedTrack: CareerTrack
  language: Language
}

export function GapAnalysisPanel({
  selectedTrack,
  language,
}: GapAnalysisPanelProps) {
  const topGaps = getTopGaps(selectedTrack)

  return (
    <article className="panel">
      <div className="section-heading">
        <h3>{getText(language, 'actionableGaps')}</h3>
        <span>
          {topGaps.length} {getText(language, 'prioritized')}
        </span>
      </div>
      <div className="gap-list">
        {topGaps.map((gap) => (
          <article className="gap-card" key={gap.id}>
            <div className="gap-card-header">
              <div>
                <strong>{gap.title}</strong>
                <p>{gap.reason}</p>
              </div>
              <div className="badge-pair">
                <Badge
                  label={getPriorityText(language, gap.severity)}
                  tone={gapSeverityTone[gap.severity]}
                />
                <Badge
                  label={getStatusText(language, gap.status)}
                  tone={gapStatusTone[gap.status]}
                />
              </div>
            </div>
            <div className="gap-action">
              <span>{getText(language, 'recommendedAction')}</span>
              <strong>{gap.recommendedAction.title}</strong>
            </div>
            <div className="gap-meta">
              <span>
                {getText(language, 'impact')}:{' '}
                {getPriorityText(language, gap.impact)}
              </span>
              <span>
                {getText(language, 'effort')}:{' '}
                {getPriorityText(language, gap.recommendedAction.effort)}
              </span>
              <span>
                {getText(language, 'category')}: {gap.category}
              </span>
            </div>
          </article>
        ))}
      </div>
    </article>
  )
}
