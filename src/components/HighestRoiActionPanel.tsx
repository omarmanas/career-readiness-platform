import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { gapSeverityTone } from '../utils/display'
import { getHighestRoiAction } from '../utils/gaps'

interface HighestRoiActionPanelProps {
  selectedTrack: CareerTrack
}

export function HighestRoiActionPanel({
  selectedTrack,
}: HighestRoiActionPanelProps) {
  const roiAction = getHighestRoiAction(selectedTrack)

  if (!roiAction) {
    return (
      <article className="panel roi-panel">
        <div className="section-heading">
          <h3>Highest ROI Action</h3>
          <span>No open gaps</span>
        </div>
        <p>All actionable gaps are resolved or deferred.</p>
      </article>
    )
  }

  const { gap } = roiAction

  return (
    <article className="panel roi-panel">
      <div className="section-heading">
        <h3>Highest ROI Action</h3>
        <Badge label={gap.severity} tone={gapSeverityTone[gap.severity]} />
      </div>
      <div className="roi-action">
        <span>{gap.category}</span>
        <strong>{gap.recommendedAction.title}</strong>
        <p>{gap.recommendedAction.whyItMatters}</p>
      </div>
      <div className="health-grid">
        <div>
          <span>Expected Impact</span>
          <strong>{gap.recommendedAction.impact}</strong>
        </div>
        <div>
          <span>Estimated Effort</span>
          <strong>{gap.recommendedAction.effort}</strong>
        </div>
        <div>
          <span>Linked Gap</span>
          <strong>{gap.title}</strong>
        </div>
      </div>
    </article>
  )
}
