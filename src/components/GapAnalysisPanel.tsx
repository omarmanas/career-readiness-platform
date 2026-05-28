import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { gapSeverityTone, gapStatusTone } from '../utils/display'
import { getTopGaps } from '../utils/gaps'

interface GapAnalysisPanelProps {
  selectedTrack: CareerTrack
}

export function GapAnalysisPanel({ selectedTrack }: GapAnalysisPanelProps) {
  const topGaps = getTopGaps(selectedTrack)

  return (
    <article className="panel">
      <div className="section-heading">
        <h3>Actionable gaps</h3>
        <span>{topGaps.length} prioritized</span>
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
                <Badge label={gap.severity} tone={gapSeverityTone[gap.severity]} />
                <Badge label={gap.status} tone={gapStatusTone[gap.status]} />
              </div>
            </div>
            <div className="gap-action">
              <span>Recommended action</span>
              <strong>{gap.recommendedAction.title}</strong>
            </div>
            <div className="gap-meta">
              <span>Impact: {gap.impact}</span>
              <span>Effort: {gap.recommendedAction.effort}</span>
              <span>Category: {gap.category}</span>
            </div>
          </article>
        ))}
      </div>
    </article>
  )
}
