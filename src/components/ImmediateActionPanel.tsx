import { Badge } from './Badge'
import type { CareerTrack } from '../types'
import { actionPriorityTone } from '../utils/display'
import { getImmediateAction } from '../utils/actions'

interface ImmediateActionPanelProps {
  selectedTrack: CareerTrack
}

export function ImmediateActionPanel({
  selectedTrack,
}: ImmediateActionPanelProps) {
  const action = getImmediateAction(selectedTrack)
  const linkedGap = selectedTrack.readinessGaps.find(
    (gap) => gap.id === action?.sourceGapId,
  )

  if (!action) {
    return (
      <article className="panel execution-panel">
        <div className="section-heading">
          <h3>Immediate Action</h3>
          <span>No actions</span>
        </div>
        <p>No generated next actions are available for this track.</p>
      </article>
    )
  }

  return (
    <article className="panel execution-panel">
      <div className="section-heading">
        <h3>Immediate Action</h3>
        <Badge label={action.priority} tone={actionPriorityTone[action.priority]} />
      </div>
      <div className="roi-action">
        <span>{action.category}</span>
        <strong>{action.title}</strong>
        <p>{action.description}</p>
      </div>
      <div className="health-grid">
        <div>
          <span>Impact</span>
          <strong>{action.expectedImpact}</strong>
        </div>
        <div>
          <span>Effort</span>
          <strong>{action.estimatedEffort}</strong>
        </div>
        <div>
          <span>Linked Gap</span>
          <strong>{linkedGap?.title ?? action.sourceGapId}</strong>
        </div>
      </div>
    </article>
  )
}
